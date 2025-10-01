import logging

from celery import Task
from celery.exceptions import Retry
from celery.utils.serialization import raise_with_context
from django.db import transaction


class UnrecoverableTaskException(Exception):
    # By throwing this Exception the task will stop retrying
    pass


logger = logging.getLogger(__name__)


class ResilientTask(Task):
    acks_late = True
    autoretry_for = (Exception,)
    retry_backoff = True
    max_retries = 12

    def apply_async(self, *args, on_commit=True, **kwargs):
        if on_commit:
            transaction.on_commit(
                lambda: super(ResilientTask, self).apply_async(*args, **kwargs)
            )
        else:
            return super().apply_async(*args, **kwargs)

    def retry(self, args=None, kwargs=None, exc=None, throw=True,
              eta=None, countdown=None, max_retries=None, **options):

        if exc and isinstance(exc, UnrecoverableTaskException):
            raise_with_context(exc)

        if exc and isinstance(exc, Retry):
            raise_with_context(exc)

        super().retry(args=args, kwargs=kwargs, exc=exc, throw=throw,
                      eta=eta, countdown=countdown, max_retries=max_retries, **options)

    def on_retry(self, exc, task_id, args, kwargs, einfo):
        if exc:
            logger.error('[ResilientTask] EXCEPTION IN TASK: ' + self.name)
            logger.error('[ResilientTask] ' + exc.__class__.__name__ + '(' + str(exc) + ')')
            logger.error('[ResilientTask] args: ' + str(args))
            logger.error('[ResilientTask] kwargs: ' + str(kwargs))
            logger.error('[ResilientTask] retries: ' + str(self.request.retries))
            logger.error(einfo)
            if self.request.retries == self.max_retries - 1:
                self.send_admins_email(exc, task_id, args, kwargs, einfo)
            super().on_retry(exc, task_id, args, kwargs, einfo)

    def send_admins_email(self, exc, task_id, args, kwargs, einfo):
        from django.core.mail import mail_admins
        import socket
        """ celery 4.0 onward has no method to send emails on failed tasks
        so this event handler is intended to replace it
        """
        subject = "[CELERY@{host}] Error: Task {name}: {exc}".format(
            host=socket.gethostname(),
            name=self.name,
            exc=exc
        )
        message = """
        Task {sender.name} with id {task_id} raised exception:
        {exception!r}
        Task was called with args: {args} kwargs: {kwargs}.
        Retries up to now: {retries}
        The contents of the full traceback was:
        {einfo}
            """.format(
            sender=self,
            exception=exc,
            task_id=task_id,
            args=args,
            kwargs=kwargs,
            einfo=einfo,
            retries=self.request.retries
        )
        mail_admins(subject, message)


class ResilientTaskNotOnCommit(ResilientTask):

    def apply_async(self, *args, **kwargs):
        return super().apply_async(*args, on_commit=False, **kwargs)
