import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createStore } from "vuex";
import App from "./App.vue";
import Follow from "./views/Follow.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import NewMessage from "./views/NewMessage.vue";
import Register from "./views/Register.vue";
import Search from "./views/Search.vue";
import UserProfile from "./views/UserProfile.vue";

import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

library.add(faThumbsUp);

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/write", component: NewMessage },
    { path: "/register", component: Register },
    { path: "/search", component: Search },
    { path: "/user", component: UserProfile },
    { path: "/follows", component: Follow}
    ];
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});
const store = createStore({
    state() {
        return {
            isAuthenticated: false,
            username: ""
        }
    },
    mutations: {
        authenticate(state) {
            state.isAuthenticated=true;
        },
        setUsername(state, payload) {
            state.username=payload.username;
        }
    },
    actions: {
        async fetchAuthentication({commit}) {
            const authData = await fetch("/api/social/whoami");
            if(authData.ok) {
                const user = await authData;
                commit("authenticate");
                commit("setUsername", {"username": user.username});
            }
        }
    }
});

const app = createApp(App);
app.use(router);
app.use(store);
app.component("font-awesome-icon", FontAwesomeIcon);
store.dispatch("fetchAuthentication");
app.mount("#app");
