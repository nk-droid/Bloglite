# Bloglite

Bloglite is a web application that allows users to create and share posts with other users. It's built using Vue.js and Flask and has many features to offer to its users. Some of its features are creating new posts, editing/deleting/archiving previously created posts, importing new posts using a CSV file, exporting all posts in a CSV file, following/unfollowing other users, mailing monthly progress report and sending reminders to users who don't have created any post in the last 24 hours.

### Tech Stack used while building Bloglite

**Applications**

- VS Code for coding
- DB Browser for viewing the database
- Postman fro APIs testing
- Swagger for API documentation
- And a few more...

**Programming Languages and Frameworks**

- Python 3.10
- Vue.js
- Flask
- Bootstrap

**Databases**

- SQLite as the main DB
- Redis as a in-memory database for caching 

**Backend Dependencies**

- Flask
- Flask_sqlalchemy
- Flask-Security-Too
- Flask_restful
- Celery
- Redis
- PDFkit
- Pandas

### Steps to setup and run the application

After cloning this repo, follow these steps to run the application:

- In the parent directory of the application, open four terminals using WSL.
- In the first terminal, run ```pip install -r requirements.txt``` or ```pip3 install -r requirements.txt``` to install all backend dependencies.
- After the dependencies get installed, run ```redis-server``` in the same terminal to start the Redis server.
- In the second terminal, run ```celery -A main.celery worker --beat -l info``` to start celery with celery-beat.
- In the third terminal, run ```python main.py``` or ```python3 main.py``` to start the backend server.
- In the fourth terminal, run ```python -m http.server 8080``` or ```python3 -m http.server 8080``` to start a python server for the frontend.
- Finally, navigate to ```http://127.0.0.1:8080/#/login``` to open the login page.
