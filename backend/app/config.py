import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'previuos_random_key')
    DEBUG = False
    CORS_HEADERS = 'Content-Type'
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    SECURITY_USERNAME_ENABLE = True
    WTF_CSRF_ENABLED = False
    SECURITY_PASSWORD_SALT = "sjkaxkaxklsa"

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = '21f1003758@ds.study.iitm.ac.in'
    MAIL_PASSWORD = 'pdkfqqlguamwszad'
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    CELERY_RESULT_BACKEND = "redis://127.0.0.1:6379/1"
    CELERY_BROKER_URL = "redis://127.0.0.1:6379/2"

    CACHE_TYPE = 'simple'

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'database.sqlite')
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'database.sqlite')
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'database.sqlite')

config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)

key = Config.SECRET_KEY