<template>
    <container class="container">
        <div id="user-data" class="upper-box">
            <div class="user-info">
                <span v-text="userInfo.username" class="username" @click="goToProfile"></span><br>
                <span v-text="userInfo.name"></span><br>
                <span v-text="userInfo.surname"></span>
            </div>
            <font-awesome-icon :icon="['fas', 'bell']" v-if="shouldShowBell" :class="{'follow' : isFollowing}" @click.stop="followUser"></font-awesome-icon>
        </div>
        <div class="description"><b>Description:</b></div>
        <div id="description" v-text="computedDescription">
        </div>
    </container>
</template>

<style scoped>
.upper-box {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-between;
    margin-top: 5px;
    border-bottom: 1px solid #FFFFFF;
}
.follow {
    color: #C54047;
}
.user-info {
    text-align: left;
    width: 94%;
    margin-bottom: 5px;
    margin-left: 5px;
}
.fa-bell {
    text-align: right;
    width: 6%;
    cursor: pointer;
}
.username {
    cursor: pointer;
}

.username:hover { 
    color: #BBBBBB;
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
        computedDescription() {
            if(this.user.description === "") {
                return "No description set!";
            }
            return this.user.description;
        },
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
        shouldShowBell() {
            return this.$store.state.isAuthenticated && (this.user.username !== this.$store.state.username);
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
        },        
        goToProfile() {
            const path = "/user/" + this.user.username;
            this.$router.push({path:path});
        }
    }
}
</script>