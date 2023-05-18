export const Login = Vue.component("login", {
    template:`
    <div class="container login_box p-5">
        <h4 class="text-center my-4">
            Login
        </h4>
        <input style="width: 100%; margin-top: 130px;" type="email" name="email" placeholder="Email" required="" v-model="email">
        <input style="width: 100%; margin-bottom: 50px;" type="password" name="pswd" placeholder="Password" required="" v-model="password">
        <button style="width: 50%; height: 40px; margin-left: 70px;" type="button" @click="login">Login</button>
        <p class="text-center my-4">
            Don't have an account? <router-link :to="'/register/user'" style="color: #E4405F;"> Register </router-link>
        </p>
    </div>`,

    data: function(){
        return {
            email: null,
            password: null,
        }
    },

    methods: {
        login() {
            if (this.email !== null & this.password !== null) {
                this.$store.dispatch('login', { email: this.email, password: this.password })
                .then(() => this.$router.push('/'))
                .then(()=> {
                    alertify.set('notifier','position', 'bottom-center');
                    alertify.success("Logged in successfully.");
                })
            } else {
                alertify.set('notifier','position', 'bottom-center');
                alertify.message("Please provide correct credentials");
            }
            
        }
    }
})