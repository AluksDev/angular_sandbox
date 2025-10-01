from django.core.exceptions import ValidationError
from rest_framework import serializers

from authentication.serializers import DepartmentSerializer
from utils.serializer_utils import DynamicModelSerializer
from .models import GameUserAnswer, GameQuestion, GameAnswer, Score


class GameAnswerSerializer(DynamicModelSerializer):
    """
    GameAnswer serializer.
    """

    class Meta:
        model = GameAnswer
        fields = (
            "id",
            "question",
            "answer",
            "is_correct",
            "num_answers",
            "percentage_answers",
        )
        read_only_fields = (
            "id",
            "num_answers",
            "percentage_answers",
        )


class LiteGameAnswerSerializer(DynamicModelSerializer):
    class Meta:
        model = GameAnswer
        fields = (
            "id",
            "question",
            "answer",
        )
        read_only_fields = (
            "id",
        )


class GameQuestionSerializer(DynamicModelSerializer):
    """
    GameQuestion serializer.
    """
    image = serializers.ImageField(required=False)
    image_url = serializers.SerializerMethodField(read_only=True)
    question_answers_data = serializers.SerializerMethodField(required=False, read_only=True)
    can_be_deleted = serializers.SerializerMethodField(read_only=True)

    def get_can_be_deleted(self, obj):
        return not GameUserAnswer.objects.filter(question=obj).exists()

    class Meta:
        model = GameQuestion
        fields = (
            "id",
            "title",
            "question",
            "is_active",
            "is_phishing",
            "explanation",
            "date_activated",
            "total_num_answers",
            "total_num_correct_answers",
            "stage_number",
            "image",
            "image_url",
            "question_answers_data",
            "can_be_deleted",
        )
        read_only_fields = (
            "id",
            "total_num_answers",
            "total_num_correct_answers",
            "total_num_wrong_answers",
            "question_answers_data",
            "image_url",
            "can_be_deleted",
        )

    def get_question_answers_data(self, question):
        return LiteGameAnswerSerializer(question.answers.all(), many=True).data

    def get_image_url(self, question):
        from django.conf import settings
        if question.image:
            return settings.DOMAIN_NAME + question.image.url
        return None


class StageSerializer(DynamicModelSerializer):
    question = serializers.IntegerField(source="id", read_only=True)

    class Meta:
        model = GameQuestion
        fields = (
            'question',
            'stage_number',
        )
        read_only_fields = (
            'question',
            'stage_number',
        )


class GameUserAnswerSerializer(DynamicModelSerializer):
    """
    GameUserAnswer serializer.
    """

    class Meta:
        model = GameUserAnswer
        fields = (
            "id",
            "user",
            "question",
            "answer",
            "is_correct",
        )
        read_only_fields = (
            "id",
            "is_correct",
        )


class ScoreSerializer(DynamicModelSerializer):
    """
    Score serializer.
    """
    department_name = serializers.SerializerMethodField(read_only=True)
    stage_number = serializers.SerializerMethodField(read_only=True)
    inaccuracy = serializers.SerializerMethodField(read_only=True)

    def validate_accuracy(self, accuracy):
        if accuracy < 0 or accuracy > 100:
            raise serializers.ValidationError('Accuracy must be between 0 and 100')
        return accuracy

    class Meta:
        model = Score
        fields = (
            "id",
            "score",
            "question",
            "department",
            "department_name",
            "timestamp",
            "num_answers_department",
            "num_wrong_answers_department",
            "num_correct_answers_department",
            "percentage_num_answers_department",
            "percentage_wrong_answers_department",
            "percentage_correct_answers_department",
            "is_weekly_winner",
            "has_reached_max",
            "stage_number",
            "accuracy",
            "inaccuracy",
        )
        read_only_fields = (
            "id",
            "num_answers_department",
            "num_wrong_answers_department",
            "num_correct_answers_department",
            "percentage_num_answers_department",
            "percentage_wrong_answers_department",
            "percentage_correct_answers_department",
            "stage_number",
            "inaccuracy",
        )

    def get_stage_number(self, instance):
        return instance.question.stage_number

    def get_department_name(self, instance):
        return instance.department.name

    def get_inaccuracy(self, instance):
        return 100 - instance.accuracy if instance.accuracy else 0


class PodiumSerializer(serializers.Serializer):
    department = serializers.IntegerField(read_only=True)
    department_name = serializers.CharField(source='department__name', read_only=True)
    total_score = serializers.IntegerField(read_only=True)
    stages_passed = serializers.IntegerField(read_only=True)
    num_wrong_answers = serializers.IntegerField(read_only=True, required=False)
    num_correct_answers = serializers.IntegerField(read_only=True, required=False)
    timestamp = serializers.DateTimeField(read_only=True, required=False)


class StageMapSerializer(serializers.Serializer):
    stage_number = serializers.IntegerField(read_only=True)
    question = GameQuestionSerializer(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_answered = serializers.BooleanField(read_only=True)
    department_is_correct = serializers.BooleanField(read_only=True)
    user_is_correct = serializers.BooleanField(read_only=True)
    answer = GameUserAnswerSerializer(read_only=True)


class StagePodiumSerializer(serializers.Serializer):
    stage_number = serializers.IntegerField(read_only=True)
    question = serializers.IntegerField(read_only=True)
    department = serializers.CharField(read_only=True)
    participation = serializers.IntegerField(read_only=True)
    score = serializers.IntegerField(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)
    num_users = serializers.IntegerField(read_only=True, required=False)
    percentage_right = serializers.IntegerField(read_only=True, required=False)
    percentage_wrong = serializers.IntegerField(read_only=True, required=False)
    has_reached_max = serializers.BooleanField(read_only=True)


class GameImageUploadSerializer(DynamicModelSerializer):
    class Meta:
        model = GameQuestion
        fields = ('image',)
