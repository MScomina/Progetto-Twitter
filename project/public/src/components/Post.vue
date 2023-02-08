<template>
    <container class="container">
        <div class="author">
            <cite class="username">
                <span class="span-username" v-text="formatUsername" @click="userRoute"></span>
            </cite>
            <cite class="info">
                <span class="span-info" v-text="nameAndSurname"></span>
            </cite>
        </div>
        <div class="break"></div>
        <div class="message">
            <p v-text="message"></p>
        </div>
        <div class="break"></div>
        <div class="bottom">
            <div class="time">
                <p v-text="formattedDate"></p>
            </div>
            <div class="break"></div>
            <div class="likes">
                <p class="nOfLikes" v-text="numberOfLikes"></p>
                <font-awesome-icon :icon="['fas', 'thumbs-up']" :class="{ 'liked': isLiked }" @click="like" />
            </div>
        </div>
    </container>
</template>

<style scoped>
.container {
    margin-bottom: 10px;
}
.break {
    flex-basis: 100%;
    height: 0;
    width: 0;
}

.author {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    height: 28px;
    align-content: center;
    text-align: center;
    justify-content: center;
    border-bottom: 1px solid #FFFFFF;
}
.message {
    text-align: justify;
    font-size: 16px;
}
.span-username {
    font-style: italic;
    order: 2;
    flex-grow: 1;
    font-size: 12px;    
    cursor: pointer;
}
.span-username:hover { 
    color: #BBBBBB;
}
.span-info {
    order: 1;
    flex-grow: 3;   
    cursor: pointer;
}

.span-info:hover {
    color: #BBBBBB;
}

cite.username {
    order: 2;
    flex-grow: 1;
}
cite.info {
    order: 1;
    flex-grow: 3;
}

.bottom {
    display: flex;
    flex-direction: row;
    justify-content: right;
    border-top: 1px solid #FFFFFF;
    height: 40px;
}

.time {
    align-self: left;
    align-content: left;
    justify-content: left;
    flex-grow: 3;
    font-size: 15   px;
    width: 350px;
}

.likes {
    align-self: right;
    align-content: right;
    justify-content: right;
    flex-grow: 1;
    width: 100px;   
}

.nOfLikes {
    display: inline-block;
    margin-right: 4px;
  }

.fa-thumbs-up {
    display: inline-block;
    cursor: pointer;
}

.fa-thumbs-up:hover {
    text-shadow: 0px 0px 3px #5F8D4E;
    transform: scale(1.1);
}

.fa-thumbs-up:active {
    transform: scale(0.9);
}

.liked {
    color: #5F8D4E;
}
</style>

<script>
import Moment from "moment";
import Container from "./Container.vue";

export default {
    name: "post",
    components: {
        Container
    },
    data() {
        return {
            liked: false,
            likeCooldown: false
        };
    },
    props: {
        messageId : {
            type: String,
            default: "00000000-0000-0000-0000-0000000000"
        },
        author: {
            type: Object,
            default: function() {
                return {
                    "username" : "Username",
                    "name" : "Nome",
                    "surname" : "Cognome"
                }
            }
        },
        message: {
            type: String,
            default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        date: {
            type: String,
            default: "1970-01-01T00:00:00Z"
        },
        nOfLikes : {
            type: Number,
            default: 0
        },
        likedBefore: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        nameAndSurname() {
            return this.author.name + " " + this.author.surname;
        },
        formatUsername() {
            return "@" + this.author.username;
        },        
        numberOfLikes() {
            if(!this.likedBefore && this.liked) {
                return this.nOfLikes+1;
            } else if(this.likedBefore && this.liked) {
                return this.nOfLikes-1;
            }
            return this.nOfLikes;
        },
        isLiked() {
            return ((this.likedBefore && !this.liked) || (!this.likedBefore && this.liked));
        },
        formattedDate() {
            return Moment(this.date).format("MMM DD, YYYY HH:mm:ss");
        }
    },
    methods: {
        async like() {
            if(this.cooldown || !this.$store.state.isAuthenticated) {
                return;
            }
            const path = "/api/social/like/" + this.messageId;
            const method = (this.liked !== this.likedBefore) ? "DELETE" : "POST";
            const response = fetch(path, {
                    method: method
            });
            this.liked = !this.liked;
            this.cooldown = true;
            setTimeout(() => {
                this.cooldown = false;
            }, 1000);
        },
        userRoute() {
            const path = "/user/" + this.author.username;
            this.$router.push({path:path});
        }
    }
}
</script>
