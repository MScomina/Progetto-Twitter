<template>
    <container class="container">
        <div class="author">
            <div class="href" @click="messageRoute"></div>
            <cite class="username">
                <span class="span-username" v-text="formatUsername" @click="userRoute"></span>
            </cite>
            <cite class="info">
                <span class="span-info" v-text="nameAndSurname"></span>
            </cite>
        </div>
        <div class="break"></div>
        <div class="message">
            <p v-text="messageInfo.message"></p>
        </div>
        <div class="break"></div>
        <div class="bottom">
            <div class="time">
                <p v-text="formattedDate"></p>
            </div>
            <div class="break"></div>
            <div class="likes">
                <p class="nOfLikes" v-text="numberOfLikes"></p>
                <font-awesome-icon :icon="['fas', 'thumbs-up']" :class="{ 'liked': isLiked, 'like-clickable' : isAuthenticated }" @click.stop="like" />
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
}
.href {
    height: 6px;
    width: 6px;
    order: 1;
    border-left: 50px;
    border-radius: 2px;
    background: #FFFFFF;
    box-shadow: 0px 0px 3px #ddd;
    cursor: pointer;
}
.span-username {
    font-style: italic;
    order: 2;
    flex-grow: 1;
    cursor: pointer;
}
.span-username:hover { 
    color: #BBBBBB;
}
.span-info {
    order: 1;
    flex-grow: 3;  
}

.username {
    order: 3;
    flex-grow: 1;
}
.info {
    order: 2;
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
    font-size: 15px;
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
}

.like-clickable {
    cursor: pointer;
}

.like-clickable:hover {
    transform: scale(1.1);
}

.like-clickable:active {
    transform: scale(0.9);
}

.liked {
    color: #5F8D4E;
}
@media (max-width: 784px) {
    .author {
        height: 24px;
        font-size: 12px;
    }
    .bottom {
        height: 30px;
    }
    .time {
        font-size: 12px;
    }
}
@media (max-width: 520px) {
    .author {
        height: 20px;
        font-size: 10px;
    }
    .bottom {
        height: 25px;
    }
    .time {
        font-size: 10px;
    }
}
@media (max-width: 420px) {
    .author {
        height: 18px;
        font-size: 9px;
    }
    .bottom {
        height: 22px;
    }
    .time {
        font-size: 9px;
    }
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
        messageInfo: {
            type: Object,
            default: function() {
                return {
                    "messageId" : "00000000-0000-0000-0000-0000000000",
                    "message" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    "createdAt" : "1970-01-01T00:00:00Z",
                    "numberOfLikes" : 0,
                    "liked" : false
                }
            }
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
            if(!this.messageInfo.liked && this.liked) {
                return this.messageInfo.numberOfLikes+1;
            } else if(this.messageInfo.liked && this.liked) {
                return this.messageInfo.numberOfLikes-1;
            }
            return this.messageInfo.numberOfLikes;
        },
        isLiked() {
            return (this.messageInfo.liked !== this.liked);
        },
        formattedDate() {
            return Moment(this.messageInfo.createdAt).format("MMM DD, YYYY HH:mm:ss");
        },
        isAuthenticated() {
            return this.$store.state.isAuthenticated;
        }
    },
    methods: {
        async like() {
            if(this.likeCooldown || !this.$store.state.isAuthenticated) {
                return;
            }
            const path = "/api/social/like/" + this.messageInfo.messageId;
            const method = (this.liked !== this.messageInfo.liked) ? "DELETE" : "POST";
            const response = fetch(path, {
                    method: method
            });
            this.liked = !this.liked;
            this.likeCooldown = true;
            setTimeout(() => {
                this.likeCooldown = false;
            }, 1000);
        },
        userRoute() {
            const path = "/user/" + this.author.username;
            this.$router.push({path:path});
        },
        messageRoute() {
            const path = "/message/" + this.author.username + "/" + this.messageInfo.messageId;
            this.$router.push({path:path});
        }
    }
}
</script>
