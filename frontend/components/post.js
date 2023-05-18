import { PostService } from "../services/post.js";

export const Post = Vue.component("post", {
    template:`
    <div class="container box">
        <table style="width:100%; margin:25% 15%;">
            <tr>
                <td>
                    Post Image
                </td>
                <td>
                    <input type="file" accept="image" @change="onFileSelected">
                </td>
            </tr>
            <tr>
                <td>
                    Title
                </td>
                <td>
                    <input type="text" v-model="title">
                </td>
            </tr>
            <tr>
                <td>
                    Caption
                </td>
                <td>
                    <textarea v-model="caption" class="textarea"></textarea>
                </td>
            </tr>
            <tr>
                <td>
                    
                </td>
                <td>
                    <button type="button" @click="post"> Submit </button>
                </td>
            </tr>
        </table>
    </div>`,

    data: function() {
        return {
            image: null,
            title:"",
            caption:"",
            ActiveUser: this.$store.getters.username
        }
    },

    methods: {

        onFileSelected(event) {
            this.image=event.target.files[0]
        },

        post() {
            
            const fd = new FormData();
            fd.append('image', this.image, this.image.name)
            fd.append('title', this.title)
            fd.append('caption', this.caption)
            fd.append('ActiveUser', this.ActiveUser)
            this.$router.push('/')

            PostService(fd)
            .then(()=> {
                alertify.set('notifier','position', 'bottom-center');
                alertify.notify("Post created successfully.");
            })
        }
    }
})