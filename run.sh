#! /bin/bash

pip install -r requirements.txt
gnome-terminal -e "python3 main.py" &&
gnome-terminal -e "python3 -m http.server 8080" &&
gnome-terminal -e "celery -A main.celery worker --beat -l info" &&
gnome-terminal -e "google-chrome "127.0.0.1:8080/#/login""
