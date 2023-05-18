from flask_security import SQLAlchemyUserDatastore, UserMixin
from flask_sqlalchemy import SQLAlchemy
import base64
import os

db=SQLAlchemy()

def encode_img(path):
    with open(path, mode='rb') as file:
        img = file.read()
    return base64.b64encode(img).decode('utf-8')

def get_profilepic(image, encode=True):
    if "female" in image:
        profilepic=os.path.join("backend","ProfilePics","defaults","female",image)
    elif "male" in image:
        profilepic=os.path.join("backend","ProfilePics","defaults","male",image)
    else:
        profilepic=os.path.join("backend","ProfilePics",image)
    if encode:
        return encode_img(profilepic)
    return profilepic

class Users(db.Model, UserMixin):
    __tablename__="users"
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String, nullable=False)
    username=db.Column(db.String, nullable=False, unique=True)
    email=db.Column(db.String(10),unique=True,nullable=False)
    gender=db.Column(db.String,nullable=False)
    password=db.Column(db.String,nullable=False)
    profilepic=db.Column(db.String,nullable=False)
    about=db.Column(db.String(255))
    active=db.Column(db.Boolean)
    fs_uniquifier=db.Column(db.String(255),nullable=False,unique=True)

    def get_security_payload(self):
        result=super().get_security_payload()
        result['username']=self.username
        result['profile_pic']=get_profilepic(self.profilepic)
        return result
    
class Posts(db.Model):
    __tablename__="posts"
    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    title=db.Column(db.String(50),nullable=False)
    caption=db.Column(db.String,nullable=False)
    imageURL=db.Column(db.String,nullable=False)
    timestamp=db.Column(db.String,nullable=False)
    archived=db.Column(db.Integer,nullable=False)

class Followers(db.Model):
    __tablename__="followers"
    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    followers=db.Column(db.Integer)
    timestamp=db.Column(db.String,nullable=False)

class Followings(db.Model):
    __tablename__="followings"
    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    followings=db.Column(db.Integer)
    timestamp=db.Column(db.String,nullable=False)

user_datastore=SQLAlchemyUserDatastore(db, Users, None)