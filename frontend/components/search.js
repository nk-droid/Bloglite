import { SearchService } from "../services/search.js"

export const Search = Vue.component("search", {
    template:`
    <div>
        <input type="text" placeholder=" Search" @input="search" id="searchBox" class="center">
        <div v-if="users!==''" v-for="user in users" class="center" style="width:60%;">
            <router-link :to="'/'+user.username" v-if="user.username!==ActiveUser">
                <div class="row">
                    <div class="col-2">
                        <img :src="'data:image/png;base64,'+user.profilepic" width="50px" heigth="50px" style="border-radius:50%">
                    </div>
                    <div class="col-10">
                        <div class="row">
                            {{user.name}}
                        </div>
                        <div class="row">
                            {{user.username}}
                        </div>
                    </div>
                </div>
                <hr>
            </router-link>
        </div>
    </div>`,

    data: function() {
        return {
            users: "",
            ActiveUser: this.$store.getters.username
        }
    },

    methods: {
        search() {
            const query=document.getElementById("searchBox").value
            const data={
                query: query
            }
            SearchService(data).then(resJson=>{this.users=resJson.users})
        }
    }
})