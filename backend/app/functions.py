from datetime import datetime, timedelta
import os

import pandas as pd
import matplotlib.pyplot as plt

import backend.app.user_services as us

def format(timestamp):
    timestamp=timestamp.split(".")[0]
    timestamp = datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S')
    delta = (datetime.now()-timestamp).total_seconds()
    if delta<=1:
        msg="a sec ago"
    elif delta<60:
        msg=str(int(delta//1))+" secs ago"
    delta//=60
    if delta==1:
        msg="a min ago"
    if delta>1 and delta<60:
        msg=str(int(delta//1))+" mins ago"
    delta//=60
    if delta==1:
        msg="an hour ago"
    if delta>1 and delta<24:
        msg=str(int(delta//1))+" hours ago"
    delta//=24
    if delta==1:
        msg="a day ago"
    if delta>1 and delta<30:
        msg=str(int(delta//1))+" days ago"
    delta//=30
    if delta==1:
        msg="a mon ago"
    if delta>1:
        msg=str(int(delta//1))+" mons ago"
    return msg

def diff(timestamp):
    timestamp=timestamp.split(".")[0]
    timestamp = datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S')
    delta = (datetime.now()-timestamp).total_seconds()
    return delta

def formatted_time(timestamp):
    timestamp=timestamp.split(" ")[0]
    return timestamp

def export_posts(username):

    user=us.get_user(username)
    posts,_=us.get_posts(user.id)
    posts.extend(us.get_posts(user.id, archived=1)[0])
    posts_={'title':[],
            'caption': [],
            'timestamp': [],
            'archived': []}
    for post in posts:
        posts_['title'].append(post['title'])
        posts_['caption'].append(post['caption'])
        posts_['timestamp'].append(post['timestamp'])
        posts_['archived'].append(post['archived'])
    df = pd.DataFrame.from_dict(posts_)
    df.to_csv(os.path.join("backend","assests","csv_export","posts"+username+'.csv'), index=False)
    return "Done"