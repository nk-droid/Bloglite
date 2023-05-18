export const Following = Vue.component("following", {
    props: ['username'],

    template: `
    <div>
        <br>
        <div v-for="following in followings" class="center" style="width:60%;"">
            <div class="row">
                <div class="col-2">
                    <router-link :to="'/'+following[2]">
                        <img :src="'data:image/png;base64,'+following[3]" width="50px" heigth="50px" style="border-radius:50%">
                    </router-link>
                </div>
                <div class="col-7">
                    <router-link :to="'/'+following[2]">
                        <div class="row">
                            {{following[1]}}
                        </div>
                        <div class="row">
                            {{following[2]}}
                        </div>
                    </router-link>
                </div>
                <div class="col-3">
                    <button type="button" @click="unfollow(following[2])" v-if="username===ActiveUser">Following</button>
                </div>
            </div>
            <hr>
        </div>
    </div>`,

    data: function(){
        return {
            followings: [],
            ActiveUser: this.$store.getters.username
        }
    },

    methods: {
        unfollow: function(username) {
            fetch(`http://127.0.0.1:5000/api/${this.ActiveUser}/unfollow/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem("authentication_token")
                }
            }).then(res=>res.json())
            .then(resJson=>{
                this.followings=resJson.followings
                alertify.set('notifier','position', 'bottom-center');
                alertify.notify("Successfully unfollowed "+username+"!!!");
            })
            .then(()=>this.$router.push(`/${this.ActiveUser}/following`))
        }
    },

    beforeMount() {
        fetch(`http://127.0.0.1:5000/api/${this.username}/following`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res=>res.json())
          .then(resJson=>{
            this.followings=resJson.followings
          })
    }
})