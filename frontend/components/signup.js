import { SignUpService } from "../services/signup.js"

export const SignUp = Vue.component("signup", {
    template:`
    <div class="container signup_box p-5">
        <h4 class="text-center">
            Sign Up
        </h4>
        <input style="width: 100%; margin-top: 70px;" type="text" name="name" placeholder="Name" required="" v-model="name">
        <input style="width: 100%;" type="email" name="email" placeholder="Email" required="" v-model="email">
        <input style="width: 100%;" type="text" name="username" placeholder="Username" required="" v-model="username">
        <input style="width: 100%;" type="password" name="pswd" placeholder="Password" required="" v-model="password">
        <select style="width: 100%; margin-bottom: 50px;" v-model="gender">
            <option value="" disabled selected>Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>
        <button style="width: 50%; height: 40px; margin-left: 70px;" type="button" @click="signup">Sign Up</button>
        <p class="text-center my-4">
            Already have an account? <router-link :to="'/'+'login'" style="color: #E4405F;"> Login </router-link>
        </p>
    </div>`,

    data: function(){
        return {
            name: "",
            email: "",
            username: "",
            gender: "",
            password: "",
        }
    },

    methods: {
        signup: function(){
            const data={
                name: this.name,
                username: this.username,
                email: this.email,
                password: this.password,
                gender: this.gender
            }

            SignUpService(data)
            .then(()=> {
                alertify.set('notifier','position', 'bottom-center');
                alertify.success("Successfully signed up.");
            })
            .then(()=>this.$router.push('/login'))
        }
    }
})