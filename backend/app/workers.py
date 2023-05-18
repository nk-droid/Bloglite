from flask import current_app as app
from celery.schedules import crontab
from backend.app.jobs import send_monthly_report
from .. import celery

TaskBase = celery.Task

class ContextTask(TaskBase):
    def __call__(self, *args, **kwargs):
        with app.app_context():
            return self.run(*args, **kwargs)
     
celery.conf.beat_schedule = {
    'daily_reminder': {
        'task': 'backend.app.jobs.send_reminder',
        'schedule': crontab(hour=11, minute=13)
    },
    'monthly_report': {
        'task': 'backend.app.jobs.send_monthly_report',
        'schedule': crontab(hour=11,minute=13)
    }
}

celery.conf.timezone = 'Asia/Kolkata'
celery.conf.enable_utc = False