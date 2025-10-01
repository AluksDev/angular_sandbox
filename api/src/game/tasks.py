from celery import shared_task
from celery.utils.log import get_task_logger
from django.utils import timezone

from utils.tasks import ResilientTaskNotOnCommit

logger = get_task_logger(__name__)


@shared_task(bind=True, base=ResilientTaskNotOnCommit)
def activate_questions(self):
    """Task to activate the questions at the given datetime (date_activated)"""
    from game.models import GameQuestion

    for question in GameQuestion.objects.filter(date_activated__lte=timezone.now(), is_active=False):
        question.is_active = True  # Activate question
        question.save()
