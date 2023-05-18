import { GetSettingsService, UpdateSettingsService } from "../services/settings.js"

export const Settings = Vue.component("settings", {

    template:`
    <div class="container box">
        <table style="width:100%; margin:20% 15%;">
            <tr>
                <td>
                    <img :src="'data:image/png;base64,'+profilepic" height="50px" weight="50px" style="border-radius: 50%;"/>
                </td>
                <td>
                    <tr>
                        <td>
                            {{ActiveUser}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b @click="changeProfilePic">Change profile picture</b>
                        </td>
                    </tr>
                </td>
            </tr>
            <tr>
                <td>
                    Name
                </td>
                <td>
                    <input type="text" v-model="name">
                </td>
            </tr>
            <tr>
                <td>
                    Username
                </td>
                <td>
                    <input type="text" v-model="ActiveUser" disabled>
                </td>
            </tr>
            <tr>
                <td>
                    About
                </td>
                <td>
                    <textarea type="text" class="textarea" v-model="about"></textarea>
                </td>
            </tr>
            <tr>
                <td>
                    Email
                </td>
                <td>
                    <input type="email" v-model="email" disabled>
                </td>
            </tr>
            <tr>
                <td>
                    Gender
                </td>
                <td>
                    <select v-model="gender">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>
                    
                </td>
                <td>
                    <button type="button" @click="updateSettings(ActiveUser)">Submit</button>
                </td>
            </tr>
        </table>
    </div>`,

    data: function() {
        return {
            name: null,
            about: null,
            email: null,
            gender: null,
            ActiveUser: this.$store.getters.username,
            profilepic: this.$store.getters.profilepic,
            avatars: null,
            profile_pic: null
        }
    },

    beforeMount() {
        GetSettingsService(this.ActiveUser)
        .then(resJson=>{
            this.name=resJson.name
            this.about=resJson.about
            this.gender=resJson.gender
            this.email=resJson.email
            this.profilepic=resJson.profilepic
            this.avatars=resJson.avatars
        })
    },

    methods: {

        changeProfilePic() {
            alertify.confirm().setHeader('<h5 class="text-center">Select a new profile picture<h5>').setContent('<input type="file">').show();
        },

        updateSettings(ActiveUser) {
            const fd = new FormData();
            fd.append('name', this.name)
            fd.append('about', this.about)
            fd.append('gender', this.gender)
            if (this.profile_pic!==null) {
                fd.append('profile_pic', this.profile_pic)
            }

            UpdateSettingsService(ActiveUser, fd)
            .then(()=>this.$router.push(`/${this.ActiveUser}`))
            .then(()=> {
                alertify.set('notifier','position', 'bottom-center');
                alertify.notify("Settings updated successfully.");
            })
        }
    }
})