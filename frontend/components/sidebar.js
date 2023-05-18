import { ExportService } from "../services/export.js"

export const SideBar = Vue.component('sidebar', {
    template: `
    <div>
        <br>
        <div class="row" style="margin-left: 7%;">
            <router-link :to="'/'">
                <span style="color: #E4405F;">
                    <img src="../frontend/assests/logo.svg" height="50px"> &nbsp
                    <span class="align-bottom h5">
                        Bloglite
                    </span>
                </span>
            </router-link>
        </div>
        <br><br>
        <div class="row" style="margin-left: 7%;">
            <span class="nav-options">
                <router-link :to="'/'">
                    <i class="bi bi-house-door-fill" style="font-size:25px;"></i>
                    &nbsp&nbsp
                    Home
                </router-link>
            </span>
        </div>
        <br>
        <div class="row" style="margin-left: 7%;">
            <span class="nav-options">
                <router-link :to="'/'+ActiveUser+'/search'">
                    <i class="bi bi-search" style="font-size:25px;"></i>
                    &nbsp&nbsp
                    Search
                </router-link>
            </span>
        </div>
        <br>
        <div class="row" style="margin-left: 7%;">
            <span class="nav-options">
                <router-link :to="'/'+ActiveUser+'/post'">
                    <i class="bi bi-patch-plus" style="font-size:25px;"></i>
                    &nbsp&nbsp
                    Create
                </router-link>
            </span>
        </div>
        <br>
        <div class="row" style="margin-left: 7%;">
            <span class="nav-options" style="cursor:pointer;" @click="exportCSV(ActiveUser)">
                <i class="bi bi-file-earmark-arrow-up" style="font-size:25px;"></i>
                &nbsp&nbsp
                Export
            </span>
        </div>
        <br>
        <div class="row" style="margin-left: 7%;">
            <span class="nav-options" style="cursor:pointer;">
                <router-link :to="'/'+ActiveUser+'/import/posts'">
                    <i class="bi bi-file-earmark-arrow-down" style="font-size:25px;"></i>
                    &nbsp&nbsp
                    Import
                </router-link>
            </span>
        </div>
        <br>
        <div class="row" style="margin-left: 7%;">
            <span class="nav-options">
                <router-link :to="'/'+ActiveUser">
                    <img :src="'data:image/png;base64,'+ProfilePic" height="32px" weight="32px" style="border-radius: 50%;" />
                    &nbsp&nbsp
                    Profile
                </router-link>
            </span>
        </div>
        <br>

        <div class="btn-group dropup" style="margin-left: 1%; position: absolute; bottom: 3vh;">
            <button type="button" class="btn btn-secondary" data-bs-toggle="dropdown" aria-expanded="false">
                More
            </button>
            <ul class="dropdown-menu">
                <li><router-link :to="'/'+ActiveUser+'/settings'" class="dropdown-item">Settings</router-link></li>
                <li><a class="dropdown-item" style="cursor:pointer;" @click="logout">Logout</a></li>
            </ul>
        </div>
    </div>    
    `,

    data: function() {
        return {
            msg: ""
        }
    },

    computed: {
        ActiveUser() {
            return this.$store.getters.username
        },
        Token() {
            return this.$store.getters.token
        },
        ProfilePic() {
            return this.$store.getters.profilepic
        }
    },

    methods: {
        logout() {
            this.$store.dispatch('logout')
            .then(() => this.$router.push('/login'))
            .then(() => {
                alertify.set('notifier','position', 'bottom-center');
                alertify.success('Successfully logged out!!!');
            })
        },

        exportCSV(username) {
            ExportService(username).then(data => {
                const arr = new Uint8Array(data)
                const blob = new Blob([arr], {type: 'text/csv;charset=utf-8'})

                var fileURL = window.URL.createObjectURL(blob)
                var fileLink = document.createElement("a")

                fileLink.href = fileURL
                fileLink.setAttribute(
                    "download",
                    "posts.csv"
                )
                document.body.appendChild(fileLink)

                fileLink.click()
            }).then(()=>{
                alertify.set('notifier','position', 'top-right');
                alertify.notify('CSV downloaded successfully!!!');
            })
        }
    }
})