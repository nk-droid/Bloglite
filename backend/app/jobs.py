from json import dumps
from time import sleep
from httplib2 import Http
from flask import render_template, current_app as app
import pdfkit
from backend.app.functions import formatted_time
from backend.app.user_services import *
from backend.app.workers import *
from flask_mail import Message
from datetime import datetime, timedelta
from .. import mail, celery

@celery.task
def generate_pdf_report(user, month, year):

    ym=(datetime.today() - timedelta(days=1)).strftime("%Y-%m")

    posts_ = Posts.query.with_entities(Posts.title,Posts.timestamp).filter(Posts.user_id==user.id, Posts.timestamp.like(ym+"%")).all()
    posts=[]
    for p in posts_:
        posts.append({"title": p[0],
                      "timestamp": formatted_time(p[1])})
    followers_ = Followers.query.with_entities(Followers.followers, Followers.timestamp).filter(Followers.user_id==user.id, Followers.timestamp.like(ym+"%")).all()
    followers=[]
    for f in followers_:
        followers.append({"username": user_datastore.find_user(id=f[0]).username,
                          "timestamp": formatted_time(f[1])})
    followings_ = Followings.query.with_entities(Followings.followings, Followings.timestamp).filter(Followings.user_id==user.id, Followings.timestamp.like(ym+"%")).all()
    followings=[]
    for f in followings_:
        followings.append({"username": user_datastore.find_user(id=f[0]).username,
                           "timestamp": formatted_time(f[1])})
        
    static=os.path.join(os.getcwd(),"backend","static")

    print(get_profilepic(user.profilepic, encode=False))
    html = render_template(
            "pdf_report.html",
            profilepic=get_profilepic(user.profilepic),
            month=month,
            year=year,
            name=user.name,
            username=user.username,
            email=user.email.decode(),
            posts=posts,
            followers=followers,
            followings=followings,
            static=static
        )
    pdfkit.from_string(html, os.path.join("backend","assests","pdf_reports","PDF_REPORT"+"_"+user.username.upper()+"_"+month.upper()+"_"+year+".pdf"),options={"enable-local-file-access": ""})
    return posts, followers, followings

@celery.task
def send_reminder():
    users=get_users()
    for user in users:
        if not has_posted(user.id):
            url = 'https://chat.googleapis.com/v1/spaces/AAAAF7SaHDs/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=0pc5sX9WNfgnbfhD4l59PXk1iR2wb5bGCDnImWO00hY%3D'
            bot_message = {
                'text': "Hey {name}, it seems that you forget to make a post today. Please share what's on your mind with your followers now.".format(name=user.name)}
            message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
            http_obj = Http()
            response = http_obj.request(
                uri=url,
                method='POST',
                headers=message_headers,
                body=dumps(bot_message),
            )

@celery.task
def send_monthly_report():
    yesterday = datetime.today() - timedelta(days=1)
    previous_month = yesterday.strftime("%B")
    year = yesterday.strftime("%Y")
    users=get_users()
    for user in users:
        posts,followers,followings=generate_pdf_report(user, previous_month, year)
        msg = Message('Monthly Report - {}'.format(previous_month+", "+year), sender = app.config['MAIL_USERNAME'], recipients = ['nidhish.22k@gmail.com'])
        msg.html = render_template("monthly_report_mail.html", name=user.name, posts=posts, followers=followers, followings=followings, month=previous_month, year=year)
        sleep(10)
        with app.open_resource(os.path.join("assests","pdf_reports","PDF_REPORT"+"_"+user.username.upper()+"_"+previous_month.upper()+"_"+year+".pdf")) as fp:  
            msg.attach("MONTHLY_REPORT_"+previous_month.upper()+"_"+year+".pdf","application/pdf",fp.read())  
        mail.send(msg)
        
        print("Monthly report sent successfully to {}.".format(user.name))

