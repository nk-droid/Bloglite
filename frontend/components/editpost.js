import { PostGetService, PostUpdateService } from "../services/postOptions.js"

export const EditPost = Vue.component("editpost", {
    props: ['post_id'],
    template: `
    <div class="container box">
        <div class="row w-75 center mt-5 py-5">
            <div class="col">
                <img :src="'data:image/png;base64,'+image" width="100%" heigth="100%">
            </div>
        </div>
        <br>
        <div class="row w-75 center">
            <table>
                <tr>
                    <td>
                        Title
                    </td>
                    <td>
                        <input type="text" placeholder=" Title" v-model="title">
                    </td>
                </tr>
                <tr>
                    <td>
                        Caption
                    </td>
                    <td>
                        <textarea placeholder=" Caption" v-model="caption" class="textarea"></textarea>
                    </td>
                </tr>
                <tr>
                    <td>
                        
                    </td>
                    <td>
                        <button type="button" @click="update"> Submit </button>
                    </td>
                </tr>
            </table>
        </div>
    </div>`,

    data: function() {
        return {
            image: null,
            title: null,
            caption: null,
            ActiveUser: this.$store.getters.username
        }
    },

    beforeMount() {
        PostGetService(this.ActiveUser, this.post_id).then(resJson=>{this.image=resJson.post.image,
                                                                     this.title=resJson.post.title,
                                                                     this.caption=resJson.post.caption})
    },

    methods: {
        update() {
            const data={
                title: this.title,
                caption: this.caption
            }

            PostUpdateService(this.ActiveUser, this.post_id, data)
            .then(() => `/${this.ActiveUser}`)
            .then(() => {
                alertify.set('notifier','position', 'bottom-center');
                alertify.notify("Post updated successfully.");
            })
        }
    }
})