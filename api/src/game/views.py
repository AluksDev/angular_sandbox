import logging
from datetime import timedelta

from django.conf import settings
from django.db.models import Subquery, OuterRef, Max, Min, Count, Sum, Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema, no_body
from rest_framework import status, viewsets, mixins, permissions
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
from rest_framework.response import Response
from django.core.exceptions import ValidationError

from utils.filters import NullsLastOrderingFilter

from authentication.models import Department
from authentication.serializers import DepartmentSerializer
from .models import GameUserAnswer, GameQuestion, GameAnswer, Score
from .serializers import (PodiumSerializer, GameQuestionSerializer, GameAnswerSerializer, GameUserAnswerSerializer,
                          ScoreSerializer, StageMapSerializer, StagePodiumSerializer, StageSerializer)

logger = logging.getLogger(__name__)


class GameQuestionView(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet):
    """
    Views for Game Question REST
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [SearchFilter, DjangoFilterBackend, NullsLastOrderingFilter]
    serializer_class = GameQuestionSerializer
    queryset = GameQuestion.objects.all().order_by('stage_number')
    search_fields = ("question", "stage_number", "title")
    filterset_fields = {"is_active", "stage_number", "department_score__department"}
    ordering_fields = (
        'id', 'title', 'question', 'is_active', 'is_phishing',
        'explanation', 'date_activated', 'stage_number', 'created',
    )
    ordering = ("stage_number", "date_activated", "id")

    @swagger_auto_schema()
    def list(self, request, *args, **kwargs):
        """Gets a list of questions"""
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema()
    def retrieve(self, request, *args, **kwargs):
        """Retrieves a question"""
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema()
    def partial_update(self, request, *args, **kwargs):
        """Partially updates a question"""
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema()
    def create(self, request, *args, **kwargs):
        """Create a question"""
        if GameQuestion.objects.count() >= 20:
            return Response(
                {"detail": "You have already submitted 20 questions."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema()
    def destroy(self, request, *args, **kwargs):
        """Delete a question"""
        instance = self.get_object()
        if GameUserAnswer.objects.filter(question=instance).exists():
            return Response(
                {'detail': 'This question has been answered by some users and cannot be deleted.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema()
    @action(detail=True, methods=["delete"])
    def force_destroy(self, request, *args, **kwargs):
        """Endpoint to delete a question and all its related objects. USE ONLY FOR TRYOUTS"""
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: StageMapSerializer(many=True),
        },
        
    )
    @action(detail=False, methods=["get"])
    def get_map_stages(self, request, *args, **kwargs):
        """Delete a question"""
        user = request.user
        # Get the department from the filters
        department_id = request.GET.get('department_score__department', None)
        data = []

        # Get all questions with an assigned stage number
        questions = GameQuestion.objects.filter(stage_number__isnull=False).order_by("stage_number")
        # Iterate over the stages to get an array with the stage's state
        for question in questions:
            answer = question.user_answers.filter(user=user).first()  # If it does not exist, returns None

            if department_id and int(
                    department_id) != user.department.id:  # If the user is trying to access a different department
                if not user.is_staff:  # If the user is not staff/admin
                    department_id = user.department.id
                else:
                    answer = None  # So that admins impersonating other departments do not see their own answers

            # Get department score
            department_score = question.department_score.filter(department_id=department_id).first()
            # Append data
            data.append({
                'stage_number': question.stage_number,
                'question': question,
                'is_active': question.is_active,
                'is_answered': True if answer else False,
                'department_is_correct': department_score.has_reached_max if department_score else False,
                'user_is_correct': answer.is_correct if answer else None,
                'answer': answer
            })
        return Response(StageMapSerializer(data, many=True).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: StageSerializer(many=True),
        },
        
    )
    @action(detail=False, methods=["get"])
    def get_active_stages(self, request, *args, **kwargs):
        active_stages = GameQuestion.objects.filter(stage_number__isnull=False, is_active=True).order_by(
            "-stage_number")
        return Response(StageSerializer(active_stages, many=True).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=no_body,
        manual_parameters=[
            openapi.Parameter(
                name="image",
                in_=openapi.IN_FORM,
                type=openapi.TYPE_FILE,
                required=True,
                description="Image file to upload"
            )
        ],
        responses={status.HTTP_200_OK: GameQuestionSerializer},
        
    )
    @action(detail=True, methods=["POST"], parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, *args, **kwargs):
        """Endpoint to post the image of the question"""
        question = self.get_object()
        if 'image' not in request.FILES:
            return Response({'detail': 'Image file is required.'}, status=status.HTTP_400_BAD_REQUEST)

        question.image = request.FILES['image']
        question.save()

        return Response(GameQuestionSerializer(question).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=no_body,
        responses={status.HTTP_200_OK: GameQuestionSerializer},
        
    )
    @action(detail=True, methods=["delete"])
    def delete_image(self, request, *args, **kwargs):
        """Endpoint to delete the image of the question"""
        question = self.get_object()
        question.image.delete()
        return Response(status=status.HTTP_200_OK)


class GameAnswerView(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet):
    """
    Views for Game Question REST
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, DjangoFilterBackend, NullsLastOrderingFilter]
    serializer_class = GameAnswerSerializer
    queryset = GameAnswer.objects.all()
    search_fields = ("id", "question")
    # filterset_fields = {"is_active"}
    ordering_fields = (
        'id', 'question', ('question__stage_number', 'stage_number'),
        'answer', 'is_correct', 'created',
    )
    ordering = ("created",)

    @swagger_auto_schema()
    def list(self, request, *args, **kwargs):
        """Gets a list of answers"""
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema()
    def retrieve(self, request, *args, **kwargs):
        """Retrieves an answer"""
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema()
    def partial_update(self, request, *args, **kwargs):
        """Partially updates an answer"""
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema()
    def create(self, request, *args, **kwargs):
        """Create an answer"""
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema()
    def destroy(self, request, *args, **kwargs):
        """Delete an answer"""
        return super().destroy(request, *args, **kwargs)


class UserAnswerView(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet):
    """
    Views for Game Question REST
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, DjangoFilterBackend, NullsLastOrderingFilter]
    serializer_class = GameUserAnswerSerializer
    queryset = GameUserAnswer.objects.all()
    search_fields = ("id", "question")
    # filterset_fields = {"is_active"}
    ordering_fields = (
        'id', 'user', 'question', 'answer',
        ('answer__is_correct', 'is_correct'), 'created',
    )
    ordering = ("created",)

    @swagger_auto_schema()
    def list(self, request, *args, **kwargs):
        """Gets a list of user answers"""
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema()
    def retrieve(self, request, *args, **kwargs):
        """Retrieves a user answer"""
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema()
    def partial_update(self, request, *args, **kwargs):
        """Partially updates a user answer"""
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema()
    def create(self, request, *args, **kwargs):
        """Create a user answer"""
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema()
    def destroy(self, request, *args, **kwargs):
        """Delete a user answer"""
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        responses={
            status.HTTP_204_NO_CONTENT: "Users answers deleted successfully.",
        },
        
    )
    @action(detail=False, methods=["get"])
    def delete_all(self, request, *args, **kwargs):
        GameUserAnswer.objects.all().delete()
        Score.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: "Scores recalculated successfully.",
        },
        
    )
    @action(detail=False, methods=["get"])
    def recalculate_score(self, request, *args, **kwargs):
        user_answers = GameUserAnswer.objects.all()
        for answer in user_answers:
            answer.update_department_score()
        return Response(status=status.HTTP_200_OK)


class ScoreView(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet):
    """
    Views for Game Question REST
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, DjangoFilterBackend, NullsLastOrderingFilter]
    serializer_class = ScoreSerializer
    queryset = Score.objects.all()
    search_fields = ("id", "question")
    filterset_fields = {"question", "question__stage_number"}
    ordering_fields = (
        'id', 'score', 'question',
        ('question__stage_number', 'stage_number'),
        'department', ('department__name', 'department_name'),
        'timestamp', 'is_weekly_winner', 'has_reached_max',
        'accuracy', 'created',
    )
    ordering = ("created",)

    @swagger_auto_schema()
    def list(self, request, *args, **kwargs):
        """Gets a list of scores"""
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema()
    def retrieve(self, request, *args, **kwargs):
        """Retrieves a score"""
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema()
    def partial_update(self, request, *args, **kwargs):
        """Partially updates a score"""
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema()
    def create(self, request, *args, **kwargs):
        """Create a user answer"""
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema()
    def destroy(self, request, *args, **kwargs):
        """Deletes a score"""
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        responses={
            status.HTTP_204_NO_CONTENT: "Scores deleted successfully.",
        },
        
    )
    @action(detail=False, methods=["get"])
    def delete_all(self, request, *args, **kwargs):
        Score.objects.all().delete()
        GameUserAnswer.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: PodiumSerializer(many=True),
        },
        
    )
    @action(detail=False, methods=["get"])
    def get_weekly_podium(self, request, *args, **kwargs):
        """Returns the weekly podium, annotating the scores accumulated during the weeks, ordered from highest to lowest"""
        user = request.user
        today = timezone.now().date()
        start_of_week = today - timedelta(days=today.weekday())  # Monday of current week

        # Subquery: get the highest stage number reached per department
        max_stage_subquery = Score.objects.filter(
            department=OuterRef("pk"),
            question__is_active=True
        ).values("department").annotate(
            max_stage=Max("question__stage_number")
        ).values("max_stage")[:1]

        # Subquery: get the timestamp of the last stage that completed the full game (i.e., 20 successful scores)
        completed_all_stages_timestamp_subquery = Score.objects.filter(
            department=OuterRef("pk"),
            has_reached_max=True,
            question__is_active=True
        ).order_by().values("department").annotate(
            completed_stages=Count("question", distinct=True),
            last_completion_ts=Max("timestamp")
        ).filter(
            completed_stages=20
        ).values("last_completion_ts")[:1]

        # Subquery: get the earliest timestamp this week for the latest stage
        min_timestamp_subquery = Score.objects.filter(
            department=OuterRef("pk"),
            question__is_active=True,
            question__stage_number=Subquery(max_stage_subquery),
            timestamp__date__gte=start_of_week
        ).values("department").annotate(
            min_ts=Min("timestamp")
        ).values("min_ts")[:1]

        # Main query: one per department, with all-time totals
        departments = Department.objects.exclude(name='Àmbit polític').annotate(
            total_score=Sum(
                "department_score__score",
                filter=Q(department_score__question__is_active=True)
            ),
            stages_passed=Count(
                "department_score__id",
                filter=Q(department_score__has_reached_max=True, department_score__question__is_active=True)
            ),
            max_stage=Subquery(max_stage_subquery),
            this_week_min_timestamp=Subquery(min_timestamp_subquery),
            timestamp=Subquery(completed_all_stages_timestamp_subquery),
        )

        results = []
        for dept in departments:
            d = {
                "department": dept.id,
                "department__name": dept.name,
                "total_score": dept.total_score or 0,
                "stages_passed": dept.stages_passed,
                "this_week_min_timestamp": dept.this_week_min_timestamp,
            }
            if dept.max_stage == 20 and dept.stages_passed == 20:  # When the 20th stage is active and the dept has answered the 20 stages correctly
                d["timestamp"] = dept.timestamp
            results.append(d)

        # Sort by: stages passed DESC, total score DESC, timestamp ASC (or now if null)
        podium = sorted(
            results,
            key=lambda x: (
                -x['stages_passed'],
                -x['total_score'],
                x['this_week_min_timestamp'] or timezone.now()
            )
        )

        return Response(PodiumSerializer(podium, many=True).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: StagePodiumSerializer(many=True),
        },
        
    )
    @action(detail=False, methods=["get"])
    def get_stage_podium(self, request, *args, **kwargs):
        user = request.user

        # Get the latest active question
        question = GameQuestion.objects.filter(is_active=True).order_by("-stage_number").first()
        if not question:
            return Response("There are no active questions", status=status.HTTP_400_BAD_REQUEST)

        latest_stage = question.stage_number
        stage_number = request.GET.get("question__stage_number", latest_stage)

        # Get the question with this stage number
        question = GameQuestion.objects.filter(stage_number=stage_number).first()

        departments = Department.objects.exclude(name='Àmbit polític')
        is_admin_or_manager = user.is_staff  # Staff users have admin/manager access
        scores = Score.objects.filter(question__stage_number=stage_number)
        score_map = {score.department.id: score for score in scores}

        data = []
        for dept in departments:
            score = score_map.get(dept.id)
            # What everyone sees
            base_row = {
                "stage_number": score.question.stage_number if score else stage_number,
                "question": score.question.id if score else question.id,
                "department": dept.name,
                "has_reached_max": score.has_reached_max if score else False,
                "score": score.score if score else 0,
            }

            # Phishing questions have no participation nor timestamp
            if question and not question.is_phishing:
                base_row.update({
                    "participation": score.percentage_num_answers_department if score else 0,
                    "timestamp": score.timestamp if score else None,
                })

            # Admins and managers see more data
            if is_admin_or_manager:
                base_row.update({
                    "num_users": dept.num_users,
                })
                if question and question.is_phishing:
                    base_row.update({
                        "percentage_right": score.accuracy if score else 0,
                        "percentage_wrong":100 - score.accuracy if score else 0,
                    })
                else:
                    base_row.update({
                        "percentage_right": score.percentage_correct_answers_department if score else 0,
                        "percentage_wrong": score.percentage_wrong_answers_department if score else 0,
                    })

            data.append(base_row)

        # Sort once after the loop
        def get_sort_key(item):
            if question.is_phishing:
                return (-item['score'],)
            return (-item['score'], item['timestamp'] or timezone.now())

        podium = sorted(data, key=get_sort_key)

        return Response(StagePodiumSerializer(podium, many=True).data, status=status.HTTP_200_OK)

    # @swagger_auto_schema(
    #     responses={
    #         status.HTTP_200_OK: DepartmentSerializer,
    #     },
    #     
    # )
    # @action(detail=False, methods=["get"])
    # def get_global_winner(self, request, *args, **kwargs):
    #     """Returns the first team to answer all the questions correctly"""
    #     last_question = GameQuestion.objects.all().order_by('-date_activated').first()
    #     winner = None
    #     if last_question:
    #         # The winner is the first department to reach 10 points in the last question
    #         winner = Score.objects.filter(is_weekly_winner=True, question=last_question).order_by('timestamp').first()
    #
    #     return Response(DepartmentSerializer(winner.department).data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: DepartmentSerializer,
        },
        
    )
    @action(detail=False, methods=["get"])
    def get_award_for_perseverance(self, request, *args, **kwargs):
        """Award for the department which has been the weekly winner most times"""
        weekly_winners = Score.objects.filter(is_weekly_winner=True).values('department').annotate(
            num_wins=Count('department'))
        weekly_winners = weekly_winners.order_by('-num_wins')
        department = None

        if weekly_winners:
            top_winner = weekly_winners[0]  # The department with most wins
            department = Department.objects.get(id=top_winner['department'])

        return Response(DepartmentSerializer(department).data, status=status.HTTP_200_OK)
