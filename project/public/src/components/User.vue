<template>
    <container class="container">
        <div id="user-data" class="upper-box">
            <div class="user-info">
                <div v-text="userInfo.username"></div>
                <div v-text="userInfo.name"></div>
                <div v-text="userInfo.surname"></div>
            </div>
            <font-awesome-icon :icon="['fas', 'bell']" v-if="isAuthenticated" :class="{'follow' : isFollowing}" @click="followUser"></font-awesome-icon>
        </div>
        <div class="description"><b>Description:</b></div>
        <div id="description" v-text="user.description">
        </div>
    </container>
</template>

<style scoped>
.upper-box {
    display: flex;
    flex-direction: row;
    align-content: center;
    text-align: left;
    justify-content: center;
    margin-top: 5px;
    border-bottom: 1px solid #FFFFFF;
}
.follow {
    color: #C54047;
}
.user-info {
    flex-grow: 8;
    order: 1;
    margin-bottom: 5px;
    margin-left: 5px;
}
.fa-bell {
    flex-grow: 1;
    order: 2;
    cursor: pointer;
}

.fa-bell:hover {
    transform: scale(1.1);
}

.fa-bell:active {
    transform: scale(0.9);
}
.description {
    margin-top: 8px;
}
</style>

<script>
import Container from "./Container.vue";
export default {
    name: "user-data",
    components: {
        Container
    },
    data() {
        return {
            following: false,
            followCooldown: false
        }
    },
    props: {
        followingBefore: {
            type: Boolean,
            default: false
        },
        user: {
            type: Object,
            default: function() {
                return {
                    "username" : "Username",
                    "name" : "Nome",
                    "surname" : "Cognome",
                    "description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                }
            }
        },
    },
    computed: {
        isFollowing() {
            return (this.following !== this.followingBefore);
        },
        userInfo() {
            return {
                "username" : "Username: @" + this.user.username,
                "name" : "Name: " + this.user.name,
                "surname" : "Surname: " + this.user.surname,
            };
        },
        isAuthenticated() {
            return this.$store.state.isAuthenticated;
        }
    },
    methods: {
        async followUser() {
            if(this.followCooldown || !this.$store.state.isAuthenticated) {
                return;
            }
            const path = "/api/social/followers/" + this.user.username;
            const method = (this.following !== this.followingBefore) ? "DELETE" : "POST";
            const response = fetch(path, {
                    method: method
            });
            this.following = !this.following;
            this.followCooldown = true;
            setTimeout(() => {
                this.followCooldown = false;
            }, 1000);
        }
    }
}
</script>