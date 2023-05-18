export const Profile = Vue.component("profile", {
    props: ['username'],

    template:`
    <div>
        <br><br>
        <div class="container">
            <div class="row">
                <div class="col-1">
                </div>
                <div class="col-4">
                    <img :src="'data:image/png;base64,'+profilepic" class="img-fluid w-75 border border-danger border-3 p-1" style="border-radius: 50%;" />
                </div>
                <div class="col-7">
                    <div class="row">
                        <div class="col-3">
                            <h5>{{username}}</h5>
                        </div>
                        <div class="col-9" v-if="username===ActiveUser">
                            <router-link :to="'/'+username+'/settings'" class="btn-follow"> Edit Profile </router-link>
                        </div>
                        <div v-else class="col-9">
                            <button class="btn-follow" @click="follow(username)" v-if="IsFollowing===0">Follow</button>
                            <button class="btn-follow" @click="unfollow(username)" v-else>Unfollow</button>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-4">
                            <b>{{posts.length}}</b> Posts
                        </div>
                        <div class="col-4">
                            <router-link :to="'/'+username+'/followers'">
                                <b>{{followers.length}}</b> followers
                            </router-link>
                        </div>
                        <div class="col-4">
                            <router-link :to="'/'+username+'/following'">
                                <b>{{followings.length}}</b> following
                            </router-link>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <b>{{name}}</b>
                    </div>
                    <div class="row">
                        <p>{{about}}</p>
                    </div>
                </div>
            </div>
            <br>
            <hr>
            <div style="text-align:center;">
                <div class="row">
                    <span> 
                        <a @click="activatePosts" style="cursor:pointer;">
                            &nbsp POSTS &nbsp
                        </a>
                        <a @click="activateArchived" v-if="ActiveUser===username" style="cursor:pointer;">
                            &nbsp ARCHIVED &nbsp
                        </a>
                    </span>
                </div>
            </div>
            <br>
            <div class="row" v-if="Visibility==='posts'">
                <div class="col-4 px-0" v-for="post in posts">
                    <router-link :to="'/'+username+'/post/'+post['id']" class="card h-100">
                        <img :src="'data:image/png;base64,'+post['image']" class="img-fluid my-auto d-block">
                    </router-link>
                </div>
            </div>
            <div v-else-if="Visibility==='archived'" class="row">
                <div class="col-4" v-for="ArchivedPost in ArchivedPosts">
                    <router-link :to="'/'+username+'/post/'+ArchivedPost['id']">
                        <img :src="'data:image/png;base64,'+ArchivedPost['image']" class="img-fluid">
                    </router-link>
                </div>
            </div>
        </div>
    </div>`,

    data: function(){
        return {
            name: "",
            about: "",
            profilepic: "",
            posts: "",
            ArchivedPosts: "",
            followers: "",
            followings: "",
            IsFollowing: 0,
            dt: "",
            Visibility: "posts",
            ActiveUser: this.$store.getters.username
        }
    },

    methods: {
        activatePosts: function() {
            this.Visibility="posts"
        },

        activateArchived: function() {
            this.Visibility="archived"
        },

        follow(username) {
            fetch(`http://127.0.0.1:5000/api/follow/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem("authentication_token")
                }
            }).then(res=>res.json())
              .then(() => {
                alertify.set('notifier','position', 'top-right');
                alertify.notify("Started following "+this.name);
              })
        },

        unfollow: function(username) {
            fetch(`http://127.0.0.1:5000/api/${this.ActiveUser}/unfollow/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem("authentication_token")
                }
            }).then(res=>res.json())
            .then(() => {
                alertify.set('notifier','position', 'top-right');
                alertify.notify("Successfully unfollowed "+this.name);
            })
        }
    }, 

    beforeMount() {
        fetch(`http://127.0.0.1:5000/api/${this.username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': localStorage.getItem("authentication_token")
            }
        }).then(res=>res.json())
          .then(resJson=>{
            this.name=resJson.name
            this.username=resJson.username
            this.about=resJson.about
            this.profilepic=resJson.profilepic
            this.posts=resJson.posts
            this.followers=resJson.followers
            this.followings=resJson.followings
            this.ArchivedPosts=resJson.ArchivedPosts,
            this.IsFollowing=resJson.IsFollowing
            this.dt=resJson.dt
          })
    }
})