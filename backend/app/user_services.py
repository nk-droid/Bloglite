import backend.app.functions as funcs
from backend.app.database import *
from datetime import date

def get_users():
    return Users.query.all()

def get_user(username):
    return user_datastore.find_user(username=username)

def get_followers(user_id):
    followers=Followers.query.filter(Followers.user_id==user_id).all()
    if followers==None:
        return []
    f=[]
    for follower in followers:
        temp=user_datastore.find_user(id=follower.followers)
        f.append([temp.id,temp.name,temp.username,get_profilepic(temp.profilepic),follower.timestamp])
    return f

def get_followings(user_id):
    followings=Followings.query.filter(Followings.user_id==user_id).all()
    if followings==None:
        return []
    f=[]
    for following in followings:
        temp=user_datastore.find_user(id=following.followings)
        f.append([temp.id,temp.name,temp.username,get_profilepic(temp.profilepic),following.timestamp])
    return f

def IsFollowing(user_id1, user_id2):
    followings=get_followings(user_id1)
    for following in followings:
        if following[0]==user_id2:
            return 1
    return 0

def get_posts(user_id, archived=0):
    user=user_datastore.find_user(id=user_id)
    posts=Posts.query.filter(Posts.user_id==user_id,Posts.archived==archived).all()
    posts_, dt=[],[]
    for post in posts:
        dt.append(funcs.formatted_time(post.timestamp))
        posts_.append({'username': user.username,
                       'profilepic': get_profilepic(user.profilepic),
                       'id': post.id,
                       'title': post.title,
                       'caption': post.caption,
                       'image': encode_img(os.path.join("backend","posts",user.username,post.imageURL)),
                       'diff': funcs.diff(post.timestamp),
                       'timestamp': funcs.format(post.timestamp),
                       'archived': post.archived})
    return posts_, dt

def get_followings_posts(username):
    user=get_user(username)
    followings=get_followings(user.id)
    posts=[]
    for following in followings:
        posts.append(get_posts(username))
    return posts

def has_posted(user_id):
    post = Posts.query.filter(Posts.user_id==user_id, Posts.timestamp.like(str(date.today())+"%")).first()
    print(post)
    if post:
        return True
    return False