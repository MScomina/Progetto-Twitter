<template>
    <div id="UserProfile" class="UserProfile">
        <div v-if="noUsernameFound">
            <message :title="'Error: '" :paragraphs="[noUsernameMessage]" />
        </div>
        <div v-else>
            <message :title="titles[0]" />
            <user :user="user" :followingBefore="user.isFollowing" />
            <message :title="titles[1]" />
            <div v-if="!hasMessages">
                <message :paragraphs="[noWrittenPosts]" />
            </div>
            <div v-else>
                <div v-for="message in messages" :key="message.messageId">
                    <post :author="user" :messageId="message.messageId" :message="message.message" :date="message.createdAt" :nOfLikes="message.numberOfLikes" :likedBefore="message.liked"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Message from "../components/Message.vue";
import Post from "../components/Post.vue";
import User from "../components/User.vue";
export default {
    name: "user-profile",
    components: {
        Message,
        Post,
        User
    },
    data() {
        return {
            usernameUrl: "",
            user: {},
            messages: [],
            titles: ["User: ", "Messages: "],
            noUsernameFound: false
        }
    },
    computed: {
        noUsernameMessage() {
            if(typeof this.usernameUrl !== "undefined" && this.usernameUrl !== "") {
                return "Couldn't find a user with the username " + this.usernameUrl + ".";
            }
            return "You didn't enter a proper username!";
        },
        noWrittenPosts() {
            return "The user @" + this.usernameUrl + " never wrote any messages!";
        },
        hasMessages() {
            return (this.messages.length !== 0);
        }
    },
    created() {
        if((typeof this.usernameUrl === "undefined" || this.usernameUrl === "") && !(typeof this.$route.params.username === "undefined")) {
            this.usernameUrl = this.$route.params.username;
            this.usernameUrl = this.usernameUrl.replace(/[^-_.a-zA-Z0-9]/g, '');
            if(this.usernameUrl !== this.$route.params.username) {
                const path = "/user/" + this.usernameUrl;
                this.$router.push({path:path});
            }
        }
        this.$watch(() => this.$route,
            (toParams, previousParams) => {
                this.usernameUrl = this.$route.params.username;
                this.usernameUrl = this.usernameUrl.replace(/[^-_.a-zA-Z0-9]/g, '');
                if(this.usernameUrl !== this.$route.params.username) {
                    const path = "/user/" + this.usernameUrl;
                    this.$router.push({path:path});
                }
        });
    },
    methods: {
        async retrieveDataAndMessages() {
            await this.retrieveUser();
            await this.retrieveMessages();
        },
        async retrieveUser() {
            if(this.usernameUrl === "") {
                this.noUsernameFound = true;
                this.user = {};
                return;
            }
            const response = await fetch("/api/social/users/"+this.usernameUrl);
            if(response.ok) {
                this.noUsernameFound = false;
                const data = await response.json();
                this.user = data;
            } else {
                this.noUsernameFound = true;
            }
        },
        async retrieveMessages() {
            if(this.usernameUrl === "") {
                this.messages = [];
                return;
            }
            const response = await fetch("/api/social/messages/"+this.usernameUrl);
            if(response.ok) {
                const data = await response.json();
                this.messages = data.messages;
            } else {
                this.messages = [];
            }
        }
    },
    watch: {
        "usernameUrl" : {
            immediate: false,
            handler(value) {
                this.retrieveDataAndMessages();
            }
        }
    }
}
</script>

<style scoped>
.UserProfile {
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>