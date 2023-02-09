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
import { faBell } from "@fortawesome/free-solid-svg-icons";

library.add(faThumbsUp);
library.add(faBell);

const routes = [
    { path: "/", component: Home, meta: { requiresAuth: false } },
    { path: "/login", component: Login, meta: { requiresAuth: false } },
    { path: "/write", component: NewMessage, meta: { requiresAuth: true } },
    { path: "/register", component: Register, meta: { requiresAuth: false } },
    { path: "/search", component: Search, meta: { requiresAuth: false } },
    { path: "/user", component: UserProfile, meta: { requiresAuth: false } },
    { path: "/follows", component: Follow, meta: { requiresAuth: true } }
    ];
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
                const user = await authData.json();
                commit("authenticate");
                commit("setUsername", {"username": user.username});
            }
        }
    }
});
store.dispatch("fetchAuthentication");
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});
//I literally couldn't find any way of preventing "router.beforeEach" before initializing the state. Vue doesn't allow Promises in the main.js file.
//I had to manually set a timeout of 250 ms to ensure the authentication of the user beforehand. It is slightly noticeable, but at least that guarantees a correct redirect in 99% of cases.
setTimeout(() => {
    //https://stackoverflow.com/questions/52653337/vuejs-redirect-from-login-register-to-home-if-already-loggedin-redirect-from
    router.beforeEach((to, from, next) => {
        if (to.matched.some(record => record.meta.requiresAuth)) {
          if (!store.state.isAuthenticated) {
            next({ path: "/login" });
          } else {
            next();
          }
        } else {
          next();
        }
    });
    const app = createApp(App);
    app.use(router);
    app.use(store);
    app.component("font-awesome-icon", FontAwesomeIcon);
    app.mount("#app");
}, 250);
