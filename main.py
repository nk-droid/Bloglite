from backend import create_app

app, celery, mail, cache = create_app('dev')
app.app_context().push()

if __name__ == "__main__":
    app.run()