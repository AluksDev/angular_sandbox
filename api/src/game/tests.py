from django.test import TestCase
from model_bakery import baker
from django.utils.timezone import now

from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status

from authentication.models import User, Department
from game import models as game_models
from main.settings.local import IDP_ACCESS_TOKEN


class GameQuestionTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='user@example.com', password='securepassword')
        self.game_question = game_models.GameQuestion.objects.create(question='¿Cuántas horas hay en un día?', is_active=True)
        self.wrong_answer = baker.make(game_models.GameAnswer, is_correct=False, question=self.game_question)
        self.correct_answer = baker.make(game_models.GameAnswer, is_correct=True, question=self.game_question)
        self.user_answer_correct = game_models.GameUserAnswer.objects.create(
            user=self.user,
            question=self.game_question,
            answer=self.correct_answer
        )
        self.user_answer_wrong = game_models.GameUserAnswer.objects.create(
            user=baker.make(User),  # Otro usuario
            question=self.game_question,
            answer=self.wrong_answer
        )

    def test_question_creation(self):
        self.assertEqual(self.game_question.question, '¿Cuántas horas hay en un día?')
        self.assertEqual(self.game_question.is_active, True)

    def test_total_num_answers(self):
        self.assertEqual(self.game_question.total_num_answers, 2)

    def test_total_num_correct_answers(self):
        self.assertEqual(self.game_question.total_num_correct_answers, 1)

    def test_total_num_wrong_answers(self):
        self.assertEqual(self.game_question.total_num_wrong_answers, 1)



class GameAnswerTestCase(TestCase):
    def setUp(self):
        self.game_question = baker.make(game_models.GameQuestion)

        self.correct_answer = baker.make(game_models.GameAnswer, question=self.game_question, is_correct=True)
        self.wrong_answer = baker.make(game_models.GameAnswer, question=self.game_question, is_correct=False)

        self.user1 = baker.make(User)
        self.user2 = baker.make(User)

        # Two users answer the question, one correctly, the other wrongly
        game_models.GameUserAnswer.objects.create(user=self.user1, question=self.game_question, answer=self.correct_answer)
        game_models.GameUserAnswer.objects.create(user=self.user2, question=self.game_question, answer=self.wrong_answer)

    def test_num_answers(self):
        self.assertEqual(self.correct_answer.num_answers, 1)
        self.assertEqual(self.wrong_answer.num_answers, 1)

    def test_percentage_answers(self):
        total_answers = self.game_question.total_num_answers  # Should be 2

        correct_percentage = (self.correct_answer.num_answers / total_answers) * 100
        wrong_percentage = (self.wrong_answer.num_answers / total_answers) * 100

        self.assertEqual(self.correct_answer.percentage_answers, correct_percentage)
        self.assertEqual(self.wrong_answer.percentage_answers, wrong_percentage)


class GameUserAnswerTestCase(TestCase):
    def setUp(self):
        self.user = baker.make(User)
        self.game_question = baker.make(game_models.GameQuestion)
        self.correct_answer = baker.make(game_models.GameAnswer, question=self.game_question, is_correct=True)
        self.user_answer = game_models.GameUserAnswer.objects.create(
            user=self.user,
            question=self.game_question,
            answer=self.correct_answer
        )

    def test_user_answer_creation(self):
        self.assertEqual(self.user_answer.user, self.user)
        self.assertEqual(self.user_answer.question, self.game_question)
        self.assertEqual(self.user_answer.answer, self.correct_answer)

    def test_is_correct_property(self):
        self.assertTrue(self.user_answer.is_correct)


class ScoreTestCase(TestCase):
    def setUp(self):
        # Create department
        self.department = baker.make(Department, num_users=34)
        # Create game question
        self.game_question = baker.make(game_models.GameQuestion)
        # Create answers
        self.correct_answer = baker.make(game_models.GameAnswer, question=self.game_question, is_correct=True)
        self.wrong_answer = baker.make(game_models.GameAnswer, question=self.game_question, is_correct=False)
        # Create users in the department
        self.user1 = baker.make(User, department=self.department)
        self.user2 = baker.make(User, department=self.department)
        self.user3 = baker.make(User, department=self.department)
        self.user4 = baker.make(User, department=self.department)
        # User answers
        self.user_correct_answer = game_models.GameUserAnswer.objects.create(user=self.user1, question=self.game_question, answer=self.correct_answer)
        self.user_wrong_answer = game_models.GameUserAnswer.objects.create(user=self.user2, question=self.game_question, answer=self.wrong_answer)
        # Score object
        self.score = game_models.Score.objects.get(department=self.department, question=self.game_question)


    def test_score_creation(self):
        self.assertEqual(self.score.department, self.department)
        self.assertEqual(self.score.question, self.game_question)
        self.assertIsNotNone(self.score.score)  # Should have two answers

    def test_reaching_max_score(self):
        self.score.score = 10
        self.score.save()
        self.assertTrue(self.score.has_reached_max)

    def test_num_answers_department(self):
        self.assertEqual(self.score.num_answers_department, 2)

    def test_percentage_correct_answers_department(self):
        self.assertEqual(self.score.percentage_correct_answers_department, 50.0)  # 1 correct answer out of 2

    def test_percentage_wrong_answers_department(self):
        self.assertEqual(self.score.percentage_wrong_answers_department, 50.0)  # 1 wrong answer out of 2

    def test_update_department_score(self):
        """Checks update_department_score correctly updates the department score after a user answers"""
        # New user answers correctly
        game_models.GameUserAnswer.objects.create(
            user=self.user4,
            question=self.game_question,
            answer=self.correct_answer
        )

        # Get updated score
        self.score.refresh_from_db()
        self.assertEqual(self.score.score, 4)  # The 3% of 34 (num_users department) is 1 so for each correct answer get +2 points

        # Another user answers wrong
        game_models.GameUserAnswer.objects.create(
            user=self.user3,
            question=self.game_question,
            answer=self.wrong_answer
        )

        # Get updated score
        self.score.refresh_from_db()
        self.assertEqual(self.score.score, 3)  # The 6% of 34 (num_users department) is 2 so -1 point for every 2 wrong answers




############################################################
#                        API TESTS                         #
############################################################

class ScoreViewTestCase(APITestCase):
    def setUp(self):
        # USER
        self.client = APIClient()  # Simulates the API
        self.admin_user = User.objects.create_user(email='user@example.com', password='securepassword')  # Staff user
        self.token = Token.objects.create(user=self.admin_user)
        self.client.credentials(HTTP_AUTHORIZATION=IDP_ACCESS_TOKEN)
        self.client.force_authenticate(user=self.admin_user)

        self.department = baker.make(Department, name='Ingeniería', num_users=34)
        self.game_question = baker.make(game_models.GameQuestion, is_active=True,  date_activated=now())
        self.correct_answer = baker.make(game_models.GameAnswer, question=self.game_question, is_correct=True)

        self.score = baker.make(
            game_models.Score,
            department=self.department,
            question=self.game_question,
            score=10,
            has_reached_max=True,
            is_weekly_winner=True,
            timestamp=now()
        )

    def test_list_scores(self):
        response = self.client.get(f"/services/aixonoesunjoc/score/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_retrieve_score(self):
        response = self.client.get(f"/services/aixonoesunjoc/score/{self.score.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get("id"), self.score.id)

    def test_create_score(self):
        data = {"department": self.department.id, "question": self.game_question.id, "score": 7}
        response = self.client.post(f"/services/aixonoesunjoc/score/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(game_models.Score.objects.count(), 2)

    def test_delete_score(self):
        response = self.client.delete(f"/services/aixonoesunjoc/score/{self.score.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(game_models.Score.objects.count(), 0)

    def test_get_weekly_podium(self):
        response = self.client.get(f"/services/aixonoesunjoc/score/get_weekly_podium/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        first_result = response.data[0]  # first element of list

        self.assertEqual(first_result['department'], self.department.id)
        self.assertEqual(first_result['department_name'], self.department.name)
        self.assertEqual(first_result['total_score'], self.score.score)

    # def test_get_global_winner(self):
    #     response = self.client.get(f"/services/aixonoesunjoc/score/get_global_winner/")
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(response.data['id'], self.department.id)
    #     self.assertEqual(response.data['name'], self.department.name)

    def test_get_stage_podium(self):
        response = self.client.get(f"/services/aixonoesunjoc/score/get_stage_podium/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        dept_data = next((item for item in response.data if item['department'] == self.department.name), None)
        self.assertIsNotNone(dept_data)

        self.assertEqual(dept_data['score'], self.score.score)
        self.assertEqual(dept_data['stage_number'], self.game_question.stage_number)
        self.assertEqual(dept_data['has_reached_max'], True)

    # def test_get_award_for_perseverance(self):
    #     response = self.client.get(f"/services/aixonoesunjoc/score/get_award_for_perseverance/")
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)