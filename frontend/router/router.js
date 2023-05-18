import { SignUp } from "../components/signup.js"
import { Login } from "../components/login.js"
import { Feed } from "../components/feed.js";
import { Profile } from "../components/profile.js";
import { Followers } from "../components/followers.js";
import { Following } from "../components/followings.js";
import { Search } from "../components/search.js";
import { Settings } from "../components/settings.js"
import { Post } from "../components/post.js";
import { ShowPost } from "../components/showpost.js";
import { ImportPosts } from "../components/importposts.js";
import { EditPost } from "../components/editpost.js";

const routes = [
    { path: '/register/user', component: SignUp, name: 'signup' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/', component: Feed, name: 'feed' },
    { path: '/:username', component: Profile, name: 'profile', props: true },
    { path: '/:username/followers', component: Followers, name: 'followers', props: true },
    { path: '/:username/following', component: Following, name: 'following', props: true },
    { path: '/:username/search', component: Search, name: 'search' },
    { path: '/:username/settings', component: Settings, name: 'settings', props: true },
    { path: '/:username/post', component: Post, name: 'post', props: true },
    { path: '/:username/import/posts', component: ImportPosts, name: 'importPosts', props: true },
    { path: '/:username/post/:post_id', component: ShowPost, name: 'showpost', props: true },
    { path: '/:username/post/:post_id/edit', component: EditPost, name: 'editpost', props: true }
]

const router = new VueRouter({
    routes
})

// router.beforeEach((to, from, next) => {
//     if (localStorage.getItem('authentication_token')) {
//       if (to.name === 'login' || to.name === 'signup') {
//         next({ name: 'feed' })
//       } 
//       else next()
//     } else {
//       if (to.name !== 'login' || to.name !== 'signup') {
//         next({ name: 'login' })
//       } 
//       else next()
//     }
// })

export { router }