from django.core.validators import MinValueValidator
from django.db import models
from model_utils.models import TimeStampedModel
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone


class GameQuestion(TimeStampedModel):
    title = models.CharField(
        max_length=255,
        verbose_name="Title",
        null=True
    )
    question = models.TextField(
        verbose_name='Question'
    )
    is_active = models.BooleanField(
        default=False,
        verbose_name='Active'
    )
    explanation = models.TextField(
        verbose_name='Explanation',
        blank=True,
        null=True,
        help_text='Explanation that appears after the question has been answered.'
    )
    date_activated = models.DateTimeField(
        verbose_name='Date activated',
        null=True,
        help_text='Date this question will be activated.'
    )
    stage_number = models.IntegerField(
        verbose_name='Stage number',
        help_text='The stage number this question will appear in.',
        null=True,
    )
    image = models.ImageField(
        verbose_name='Image',
        upload_to='uploads/',
        null=True,
    )
    is_phishing = models.BooleanField(
        verbose_name='Is phishing?',
        default=False,
        help_text='If this question is a phishing question (has no answers and the scoring method varies'
    )

    @property
    def total_num_answers(self):
        return self.user_answers.count()

    @property
    def total_num_correct_answers(self):
        return self.user_answers.filter(answer__is_correct=True).count()

    @property
    def total_num_wrong_answers(self):
        return self.total_num_answers - self.total_num_correct_answers


class GameAnswer(TimeStampedModel):
    question = models.ForeignKey(
        GameQuestion,
        on_delete=models.CASCADE,
        related_name='answers',
        verbose_name='Question'
    )
    answer = models.TextField(
        verbose_name='Answer'
    )
    is_correct = models.BooleanField(
        default=False,
        help_text='Is the correct answer?',
        verbose_name='Correct?'
    )

    @property
    def num_answers(self):
        """Number of people that have answered this answer"""
        return self.user_answers.count()

    @property
    def percentage_answers(self):
        """Percentage of people that have answered this answer"""
        if self.question.total_num_answers == 0:
            return 0
        return self.num_answers / self.question.total_num_answers * 100


class GameUserAnswer(TimeStampedModel):
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='user_answers',
        verbose_name='User'
    )
    question = models.ForeignKey(
        GameQuestion,
        on_delete=models.CASCADE,
        related_name='user_answers',
        verbose_name='Question'
    )
    answer = models.ForeignKey(
        GameAnswer,
        on_delete=models.CASCADE,
        related_name='user_answers',
        verbose_name='Answer'
    )

    class Meta:
        unique_together = ('user', 'question')  # Avoid repeating answer

    @property
    def is_correct(self):
        return self.answer.is_correct

    def save(self, *args, **kwargs):
        # Check if the answer is correct
        super().save(*args, **kwargs)
        self.update_department_score()

    def update_department_score(self):
        """Updates the department score for this question"""
        if self.user.department:
            department = self.user.department
            score_obj, created = Score.objects.get_or_create(department=department, question=self.question)

            if not score_obj.has_reached_max:
                # Each group of 3% users adds +2 points to the score
                new_score = (round(score_obj.num_correct_answers_department / department.three_percent) * 2 -
                             round(score_obj.num_wrong_answers_department / department.six_percent))
                score_obj.score = min(10, max(new_score, 0))  # Avoid getting over 10
                score_obj.save()


class Score(TimeStampedModel):
    """Model to store the player's Scores"""
    question = models.ForeignKey(
        GameQuestion,
        on_delete=models.CASCADE,
        related_name='department_score',
        verbose_name='Question'
    )
    score = models.IntegerField(
        verbose_name='Score',
        default=0,
        # Maximum 10 points
        validators=[
            MaxValueValidator(10)
        ],
    )
    department = models.ForeignKey(
        'authentication.Department',
        on_delete=models.CASCADE,
        related_name='department_score',
        verbose_name='Department'
    )
    timestamp = models.DateTimeField(
        help_text='Timestamp when the score reached 10',
        null=True
    )
    has_reached_max = models.BooleanField(
        default=False,
        verbose_name='Reached max',
        help_text='Reached max when score reached 10'
    )
    is_weekly_winner = models.BooleanField(
        default=False,
        verbose_name='Weekly winner?',
        help_text='Weekly winner when score reached 10'
    )
    accuracy = models.FloatField(
        verbose_name='Accuracy',
        help_text='Accuracy for phishing questions',
        default=0
    )

    def save(self, *args, **kwargs):
        if not self.has_reached_max and self.score >= 10:
            # Update the values
            self.has_reached_max = True  # Avoid overwriting the timestamp
            self.timestamp = timezone.now()
            # If there is no other department that has reached the 10 pts first set as the weekly winner
            if not Score.objects.filter(question=self.question, timestamp__lte=self.timestamp).exists():
                self.is_weekly_winner = True
        super().save(*args, **kwargs)

    @property
    def num_answers_department(self):
        """Number of answers from the department"""
        return GameUserAnswer.objects.filter(user__department=self.department, question=self.question).count()

    @property
    def percentage_num_answers_department(self):
        """Percentage of answers from the department"""
        return (self.num_answers_department / self.department.num_users) * 100

    @property
    def num_correct_answers_department(self):
        """Number of correct answers from the department"""
        return GameUserAnswer.objects.filter(user__department=self.department, question=self.question,
                                             answer__is_correct=True).count()

    @property
    def percentage_correct_answers_department(self):
        """Returns the percentage of correct answers"""
        if self.num_answers_department == 0:
            return 0
        return round(self.num_correct_answers_department / self.num_answers_department * 100)

    @property
    def num_wrong_answers_department(self):
        """Number of wrong answers from the department"""
        return self.num_answers_department - self.num_correct_answers_department

    @property
    def percentage_wrong_answers_department(self):
        """Returns the percentage of wrong answers from the department"""
        if self.num_answers_department == 0:
            return 0
        return round((self.num_wrong_answers_department / self.num_answers_department) * 100)