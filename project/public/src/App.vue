<template>
    <div class="app" id="app">
        <component class="view" :is="currentView" />
        <navbar />
    </div>
</template>

<script>
import navbar from "./components/Navbar.vue";
import Follow from "./views/Follow.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Message from "./views/Message.vue";
import NewMessage from "./views/NewMessage.vue";
import NotFound from "./views/NotFound.vue";
import Register from "./views/Register.vue";
import Search from "./views/Search.vue";
import UserProfile from "./views/UserProfile.vue";

const routes = [
    {"path": "/login/", "view": Login, "title": "Login"},
    {"path": "/write/", "view": NewMessage, "title" : "New message"},
    {"path": "/register/", "view": Register, "title" : "Register"},
    {"path": "/search/", "view": Search, "title" : "Search"},
    {"path": "/user/", "view": UserProfile, "title" : "User"},
    {"path": "/message/", "view" : Message, "title" : "Message"},
    {"path" : "/follows/", "view" : Follow, "title" : "Follows"}
]

export default {
    data() {
        return {
            currentPath: window.location.pathname + "/"
        }
    },
    computed: {
        currentView() {
            let route;
            if(this.currentPath === "//") {
                document.title = "Homepage";
                return Home;
            }
            for(let num = 0; num<routes.length; num++) {
                const path = routes[num];
                if(this.currentPath.startsWith(path.path)) {
                    route = path["view"];
                    document.title = path.title;
                }
            }
            if(typeof route === "undefined") {
                document.title = "Not Found";
                return NotFound;
            }
            return route;
        }
    },
    components: {
        "navbar" : navbar
    },
    watch: {
        "$route"(to) {
            let check = false;
            this.currentPath = to.path + "/";
            if(this.currentPath === "//") {
                document.title = "Homepage";
                return;
            }
            for(let num = 0; num<routes.length; num++) {
                const path = routes[num];
                if(this.currentPath.startsWith(path.path)) {
                    document.title = path.title;
                    check = true;
                }
            }
            if(!check) {
                document.title = "Not Found";
            }
        }
    },
    created() {
        let check = false;
        if(this.currentPath === "//") {
            document.title = "Homepage";
            check = true;
        }
        for(let num = 0; num<routes.length; num++) {
            const path = routes[num];
            if(this.currentPath.startsWith(path.path)) {
                document.title = path.title;
                check = true;
            }
        }
        if(!check) {
            document.title = "Not Found";
        }
    }
}
</script>

<style>
body {
    background-color: #000000;
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    color: #FFFFFF;
}   
.view {
    margin-top: 70px;
}
@media (max-width: 840px) {
    body {
        font-size: 15px;
    }
    .view {
        margin-top: 52px;
    }
}
@media (max-width: 520px) {
    body {
        font-size: 12px;
    }
    .view {
        margin-top: 46px;
    }
}
@media (max-width: 420px) {
    body {
        font-size: 10px;
    }
    .view {
        margin-top: 42px;
    }
}
</style>
