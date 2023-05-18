from datetime import datetime
from time import sleep
import time
from flask import jsonify, request, make_response, send_file
from flask_caching import Cache
from flask_restful import Api, Resource
from flask_security import auth_required, logout_user, uia_email_mapper, uia_username_mapper
import hashlib
import random
from flask_login import current_user
from celery.schedules import crontab
from backend.app.user_services import *
from backend.app.functions import export_posts
from csv import reader

api = Api()
cache=Cache()

class Signup(Resource):
    def post(self):
        data=request.get_json()
        user = get_user(data['username'])
        if user :
            return make_response(jsonify({'msg' : 'Email id already in use.'}), 403)
        
        try:
            email=data['email'].encode('utf-8')
            imgs=os.listdir(os.path.join("backend","ProfilePics","defaults",data['gender']))
            new_user=Users(name=data['name'],
                            email=email,
                            gender=data['gender'],
                            username=data['username'],
                            password=data['password'],
                            profilepic=random.choice(imgs),
                            about='',
                            active=True,
                            fs_uniquifier=hashlib.md5(email).hexdigest())

            db.session.add(new_user)
            db.session.commit()

            return make_response(jsonify({'msg' : 'Successfully signed up.'}), 201)
        except :
            return make_response(jsonify({'msg' : 'Oops some error occurred.'}), 400)
        
class User(Resource):
    @auth_required("token")
    @cache.cached(timeout=10, key_prefix='get_current_user_details')
    def get(self):
        try:
            user = get_user(current_user.id)
            return make_response(jsonify({'username': user.username,
                                          'profilepic': get_profilepic(user.profilepic)}), 200)
        except:
            return make_response(jsonify({'msg' : 'Please login first.'}), 401)
 

class Feed(Resource):
    @auth_required("token")
    @cache.cached(timeout=10, key_prefix='get_current_user_feeds')
    def get(self):
        followings=get_followings(current_user.id)
        posts=[]
        for following in followings:
            posts.extend(get_posts(following[0])[0])
        posts = sorted(posts, key=lambda d: d['diff'])
        return make_response(jsonify({'posts': posts}), 200)

class Post_(Resource):
    @auth_required("token")
    def post(self):
        data= {'image': request.files['image'],
               'title': request.form.get('title'),
               'caption': request.form.get('caption'),
               'username': request.form.get('ActiveUser')}
        user = get_user(data['username'])
        path=os.path.join("backend","posts",data['username'])
        if not os.path.exists(path):
            os.makedirs(path)
        temp = os.listdir(path)
        temp = sorted(list(map(int,[t.split(".")[0].split('post')[1] for t in temp])))
        if len(temp) == 0:
            last_num = 0
        else:
            last_num = temp[-1]
        try:
            new_post=Posts(user_id=user.id,
                        title=data['title'],
                        caption=data['caption'],
                        imageURL="post"+str(last_num+1)+".png",
                        timestamp=datetime.now(),
                        archived=0)
            data['image'].save(os.path.join(path,"post"+str(last_num+1)+".png"))
            sleep(5)
            db.session.add(new_post)
            db.session.commit()
            return make_response(jsonify({'msg' : 'Successfully posted.'}), 201)

        except:
            return make_response(jsonify({'msg' : 'Something went wrong.'}), 400)
 
class Profile(Resource):
    def get(self, username):
        user=get_user(username)
        followers=get_followers(user.id)
        followings=get_followings(user.id)
        posts,dt=get_posts(user.id)
        ArchivedPosts,_=get_posts(user.id,archived=1)
        return make_response(jsonify({'name': user.name,
                                      'username': user.username,
                                      'profilepic': get_profilepic(user.profilepic),
                                      'about': user.about,
                                      'followers': followers,
                                      'followings': followings,
                                      'posts': posts,
                                      'dt': dt,
                                      'IsFollowing': IsFollowing(current_user.id, user.id),
                                      'ArchivedPosts': ArchivedPosts}), 200)
    
class Search(Resource):
    def post(self):
        query=request.get_json()["query"]
        if query=="":
            return make_response(jsonify({"users": ""}), 200)
        users=Users.query.filter(Users.username.like(query+"%")).all()
        u_=[]
        for user in users:
            u_.append({'name': user.name,
                       'username': user.username,
                       'profilepic': get_profilepic(user.profilepic)})
            
        return make_response(jsonify({"users": u_}), 200)
    
class GetFollowers(Resource):
    def get(self,username):
        user=get_user(username)
        followers=get_followers(user.id)
        return make_response(jsonify({'followers': followers}), 200)

class GetFollowerings(Resource):
    def get(self,username):
        user=get_user(username)
        followings=get_followings(user.id)
        return make_response(jsonify({'followings': followings}), 200)
    
class PostActions(Resource):
    def get(self, username, id):
        user=get_user(username)
        post=Posts.query.filter(Posts.id==id).first()
        p={'id': post.id,
           'title': post.title,
           'caption': post.caption,
           'image': encode_img(os.path.join("backend","posts",user.username,post.imageURL)),
           'name': user.name,
           'username': user.username,
           'profilepic': get_profilepic(user.profilepic),
           'status': post.archived}
        return make_response(jsonify({'post': p}), 200)
    
    @auth_required("token")
    def delete(self, username, id):
        try:
            post=Posts.query.filter(Posts.id==id).first()
            post_path=os.path.join("backend","posts",username,post.imageURL)
            if os.path.exists(post_path):
                os.remove(post_path)
            db.session.delete(post)
            db.session.commit()
            return make_response(jsonify({'msg': "Successfully deleted!!!"}), 200)
        except:
            return make_response(jsonify({'msg': "Some error occurred"}), 201)

    @auth_required("token")   
    def patch(self, username, id):
        try:
            status=Posts.query.with_entities(Posts.archived).filter_by(id=id).first()[0]
            if status:
                archived=0
            else:
                archived=1
            Posts.query.filter_by(id=id).update(dict(archived=archived))
            db.session.commit()
            return make_response(jsonify({'msg': "Successfully archived."}), 200)
        except:
            return make_response(jsonify({'msg': "Some error occurred"}), 200)
        
    @auth_required("token")
    def post(self, username, id):
        data=request.get_json()
        try:
            Posts.query.filter_by(id=id).update(dict(title=data['title'], caption=data['caption']))
            db.session.commit()
            return make_response(jsonify({'msg': "Successfully updated."}), 200)
        except:
            return make_response(jsonify({'msg': "Oops some error occurred!!!"}), 201)

class AddFollower(Resource):
    @auth_required("token")   
    def get(self, username):
        temp=get_user(username)
        following = Followings.query.filter(Followings.user_id==current_user.id, Followings.followings==temp.id).first()
        if following:
            return make_response(jsonify({'msg': "Already following"}), 200)
        else:
            try:
                new_following=Followings(user_id=current_user.id,
                                    followings=temp.id,
                                    timestamp=datetime.now())
                new_follower=Followers(user_id=temp.id,
                                    followers=current_user.id,
                                    timestamp=datetime.now())
                
                db.session.add(new_following)
                db.session.add(new_follower)
                db.session.commit()

                return make_response(jsonify({'msg': "You are following "+username+" now."}), 200)
            
            except:
                return make_response(jsonify({'msg': "Some error occurred!!!"}), 200)


class Unfollow(Resource):
    @auth_required("token")   
    def get(self, username, following):
        try:
            user=get_user(username)
            following=Users.query.filter(Users.username==following).first()
            temp1=Followings.query.filter(Followings.user_id==user.id, Followings.followings==following.id).first()
            temp2=Followers.query.filter(Followers.user_id==following.id, Followers.followers==user.id).first()
            db.session.delete(temp1)
            db.session.delete(temp2)
            db.session.commit()

            return make_response(jsonify({'msg': "Successfully unfollowed."}), 200)

        except:
            return make_response(jsonify({'msg' : 'Something went wrong.'}), 400)
        
class Settings(Resource):
    @auth_required("token")
    @cache.cached(timeout=10, key_prefix='current_user_settings')
    def get(self,username):
        user=get_user(username)
        gender=user.gender
        return make_response(jsonify({'username': user.username,
                                      'name': user.name,
                                      'email': user.email.decode('utf-8'),
                                      'gender': gender,
                                      'about': user.about,
                                      'profilepic': get_profilepic(user.profilepic)}), 200)
    
    @auth_required("token")
    def patch(self, username):
        data= {'name': request.form.get('name'),
               'about': request.form.get('about'),
               'gender': request.form.get('gender')}
        Users.query.filter(Users.username==username).update(dict(name=data['name'], about=data['about'], gender=data['gender']))
        db.session.commit()
        return make_response(jsonify({'msg' : 'Settings updated successfully.'}), 200)

class Remove(Resource):
    @auth_required("token")   
    def get(self, username, follower):
        try:
            user=get_user(username)
            follower=Users.query.filter(Users.username==follower).first()
            temp1=Followers.query.filter(Followers.user_id==user.id, Followers.followers==follower.id).first()
            temp2=Followings.query.filter(Followings.user_id==follower.id, Followings.followings==user.id).first()
            db.session.delete(temp1)
            db.session.delete(temp2)
            db.session.commit()

            return make_response(jsonify({'msg': "Successfully removed."}), 200)

        except:
            return make_response(jsonify({'msg' : 'Something went wrong!!!'}), 201)
        
class ExportCSV(Resource):
    @auth_required("token")
    def get(self,username):
        export_posts(username)
        return send_file(os.path.join("assests","csv_export","posts"+username+'.csv'),as_attachment=True, mimetype="text/csv")
    
class ImportCSV(Resource):
    @auth_required("token")
    def get(self, username):
        return send_file(os.path.join("assests","import_posts","sample.csv"),as_attachment=True, mimetype="text/csv")

    @auth_required("token")
    def post(self, username):
        request.files['CSVfile'].save(os.path.join("backend","assests","import_posts","uploaded.csv"))
        with open(os.path.join("backend","assests","import_posts","uploaded.csv"), 'r') as f:
            csv_reader = reader(f)
            header = next(csv_reader)
            user_id=current_user.id
            path=os.path.join("backend","posts",current_user.username)
            if header!=None:
                i=0
                for row in csv_reader:
                    if not os.path.exists(path):
                        os.makedirs(path)
                    temp = os.listdir(path)
                    temp = sorted(list(map(int,[t.split(".")[0].split("post")[1] for t in temp])))
                    if len(temp) == 0:
                        last_num = 0
                    else:
                        last_num = temp[-1]
                    try:
                        new_post=Posts(user_id=user_id,
                                    title=row[0],
                                    caption=row[1],
                                    imageURL="post"+str(last_num+1)+".png",
                                    timestamp=datetime.now(),
                                    archived=0)
                        request.files["image"+str(i)].save(os.path.join(path,"post"+str(last_num+1)+".png"))
                        db.session.add(new_post)
                        db.session.commit()
                        i+=1
                        sleep(5)
                    except:
                        pass #................................
        return make_response(jsonify({'msg' : 'All posts added successfully'}), 201)
        
    
class Logout(Resource):
    @auth_required('token')
    def get(self):
        try:
            logout_user()
            return make_response(jsonify({'msg': 'Successfully logged out.'}), 200)
        except:
            return make_response(jsonify({'msg': 'Oops some error occurred!'}), 400)


api.add_resource(Signup, '/api/signup')
api.add_resource(User, '/api/user')
api.add_resource(Feed, '/api/feed')
api.add_resource(Post_, '/api/post')
api.add_resource(Profile, '/api/<username>')
api.add_resource(Search, '/api/search')
api.add_resource(GetFollowers, '/api/<username>/followers')
api.add_resource(GetFollowerings, '/api/<username>/following')
api.add_resource(PostActions, '/api/<username>/post/<int:id>')
api.add_resource(AddFollower, '/api/follow/<username>')
api.add_resource(Unfollow, '/api/<username>/unfollow/<following>')
api.add_resource(Settings, '/api/<username>/settings')
api.add_resource(Remove, '/api/<username>/remove/<follower>')
api.add_resource(ExportCSV, '/api/<username>/export/post')
api.add_resource(ImportCSV, '/api/<username>/import/posts')
api.add_resource(Logout, '/api/logout')