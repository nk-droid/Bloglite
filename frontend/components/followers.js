import { GetFollowersService, RemoveFollowersService } from "../services/followers.js"

export const Followers = Vue.component("followers", {
    props: ['username'],

    template: `
    <div>
        <br>
        <div v-for="follower in followers" class="center" style="width:60%;">
            <div class="row">
                <div class="col-2">
                    <router-link :to="'/'+follower[2]">
                        <img :src="'data:image/png;base64,'+follower[3]" width="50px" heigth="50px" style="border-radius:50%">
                    </router-link>
                </div>
                <div class="col-7">
                    <router-link :to="'/'+follower[2]">
                        <div class="row">
                            {{follower[1]}}
                        </div>
                        <div class="row">
                            {{follower[2]}}
                        </div>
                    </router-link>
                </div>
                <div class="col-3">
                    <button type="button" @click="remove(follower[2])" v-if="username===ActiveUser">Remove</button>
                </div>
            </div>
            <hr>
        </div>
    </div>`,

    data: function(){
        return {
            followers: [],
            ActiveUser: this.$store.getters.username
        }
    },

    methods: {
        remove: function(username) {
            RemoveFollowersService(this.ActiveUser,username)
            .then(resJson=>{this.followings=resJson.following})
            .then(()=>{
                alertify.set('notifier','position', 'bottom-center');
                alertify.notify("Successfully removed "+username+"!!!");
            })
            .then(()=>this.$router.push(`/${this.ActiveUser}/followers`))
        }
    },

    beforeMount() {
        GetFollowersService(this.username).then(resJson=>{this.followers=resJson.followers})
    }
})