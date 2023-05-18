import getters from "./getters.js";
import actions from "./actions.js";
import mutations from "./mutations.js";

export const store = new Vuex.Store({
    state: {
        username: localStorage.getItem('ActiveUser'),
        token: localStorage.getItem('authentication_token'),
        profilepic: localStorage.getItem('ProfilePic')
    },

    getters,
    actions,
    mutations
})