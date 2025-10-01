import os

from celery import Celery
from celery.schedules import crontab
from decouple import config
from django.conf import settings

if not settings.configured:
    # set the default Django settings module for the 'celery' program.
    os.environ.setdefault(
        'DJANGO_SETTINGS_MODULE', config('DJANGO_SETTINGS_MODULE', 'main.settings.local')
    )  # pragma: no cover

app = Celery("sandbox")
app.config_from_object("django.conf:settings", namespace="CELERY")


@app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    from game.tasks import activate_questions

    # Task to activate questions
    sender.add_periodic_task(
        schedule=crontab(minute='*/5'),
        sig=activate_questions,
        name='Activate Questions'
    )
