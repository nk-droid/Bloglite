import { FeedService } from "../services/feed.js"

export const Feed = Vue.component("feed", {
    template:`
    <div>
        <div class="container overflow-auto home">
            <div v-if="posts!==null">
                <div v-for="post in posts">
                    <div class="row py-2">
                        <div class="col-1">
                            <router-link :to="'/'+post['username']">
                                <img :src="'data:image/png;base64,'+post['profilepic']" width="50px" heigth="50px" style="border-radius:50%">
                            </router-link>
                        </div>
                        <div class="col-11 py-3">
                            <router-link :to="'/'+post['username']">
                                {{post['username']}}
                            </router-link>
                        </div>
                    </div>
                    <img :src="'data:image/png;base64,'+post['image']" class="img-fluid border border-secondary">
                    <div class="py-2">
                        <i class="bi bi-heart" style="font-size:25px;"></i>
                    </div>
                    <b>{{post['username']}}</b><i class="bi bi-dot"></i> <i>{{post['title']}}</i>
                    <br>
                    {{post['caption']}}
                    <br>
                    <small>{{post['timestamp']}}</small>
                    <hr>
                </div>
            </div>
        </div>
    </div>`,

    data: function(){
        return {
            posts:null
        }
    },

    created() {
        FeedService().then(resJson=>{this.posts=resJson.posts})
    }
})