import { SideBar } from "./components/sidebar.js";

import { store } from "./store/store.js"

import { router } from "./router/router.js";

let app = new Vue({
    el: "#app",
    router: router,
    store,
    
    computed: {
        ActiveUser() {
            return this.$store.getters.username
        },
        Token() {
            return this.$store.getters.token
        }
    }
})