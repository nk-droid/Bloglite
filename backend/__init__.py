from flask import Flask
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from celery import Celery
from flask_cors import CORS
from flask_security import Security
from flask_caching import Cache
from backend.app.config import config_by_name
from backend.app.database import db, user_datastore
from backend.app.api import api, cache

mail = Mail()
celery = Celery("Application Jobs")

def create_app(config_name):
    app = Flask(__name__)
    CORS(app)

    from backend.app.workers import ContextTask

    celery.conf.update(
        broker_url = "redis://127.0.0.1:6379/1",
        result_backend = "redis://127.0.0.1:6379/2"
    )
    celery.Task = ContextTask

    app.config.from_object(config_by_name[config_name])
    security=Security(app, user_datastore)
    db.init_app(app)
    cache.init_app(app)
    mail.init_app(app)
    api.init_app(app)
    with app.app_context():
        db.create_all()

    return app, celery, mail, cache