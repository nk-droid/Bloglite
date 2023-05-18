import { PostGetService, PostDeleteService, PostArchiveSwitchService } from "../services/postOptions.js"

export const ShowPost = Vue.component("showpost", {
    props: ['username', 'post_id'],

    template: `
    <div class="container box">
        <br><br>
        <div class="row w-75 center">
            <div class="col-1">
                <img :src="'data:image/png;base64,'+post['profilepic']" width="50px" heigth="50px" style="border-radius:50%">
            </div>
            <div class="col-10 pt-3">
                <b>{{post['username']}}</b>
            </div>
            <div class="col-1" v-if="ActiveUser===username">
                <div class="btn-group">
                    <i class="bi bi-three-dots" data-bs-toggle="dropdown" aria-expanded="false"></i>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" style="cursor:pointer;" @click="edit(post_id)">Edit Post</a></li>
                        <li v-if="post.status===0"><a class="dropdown-item" style="cursor:pointer;" @click="archiveSwitch(post_id,'archived')">Archive Post</a></li>
                        <li v-else><a class="dropdown-item" style="cursor:pointer;" @click="archiveSwitch(post_id,'unarchived')">Unarchive Post</a></li>
                        <li><a class="dropdown-item" style="cursor:pointer;" @click="dlt(post_id)">Delete Post</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="card w-75 center mt-5">
            <div class="col">
                <img :src="'data:image/png;base64,'+post['image']" width="100%" heigth="100%">
            </div>
        </div>
        <br>
        <div class="row w-75 center py-2">
            <div class="col">
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-11 h6">
                        {{post['title']}}
                    </div>
                </div>
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-11">
                        {{post['caption']}}
                    </div>
                </div>
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-11">
                        <small>{{post['timestamp']}}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>`,

    data: function() {
        return {
            post: null,
            msg: null,
            ActiveUser: this.$store.getters.username
        }
    },

    beforeMount() {
        PostGetService(this.username, this.post_id).then(resJson=>{this.post=resJson.post})
    },

    methods: {
        dlt(post_id) {
            PostDeleteService(this.username, post_id).then(resJson=>{this.msg=resJson.msg})
            .then(()=>this.$router.push(`/${this.ActiveUser}`))
            .then(()=>{
                alertify.set('notifier','position', 'top-right');
                alertify.notify("Post deleted successfully!!!");
                this.$router.push(`/${this.ActiveUser}`) 
            })
        },

        archiveSwitch(post_id, txt) {
            PostArchiveSwitchService(this.username, post_id).then(resJson=>{this.msg=resJson.msg})
            .then(()=>{
                alertify.set('notifier','position', 'top-right');
                alertify.notify("Post "+txt+" successfully!!!");
                this.$router.push(`/${this.ActiveUser}`) 
            })
        },

        edit(post_id) {
            this.$router.push(`/${this.ActiveUser}/post/${post_id}/edit`)
        }
    }
})