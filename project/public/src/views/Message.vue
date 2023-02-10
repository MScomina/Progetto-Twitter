<template>
    <div id="MessageGUI" class="MessageGUI">
        <div v-if="noUsernameFound">
            <message :title="'Error: '" :paragraphs="[noUsernameMessage]" />
        </div>
        <div v-else>
            <div v-if="noMessageFound">
                <message :title="'Error: '" :paragraphs="[messageNotFoundMessage]" />
            </div>
            <div v-else>
                <message :title="title" />
                <post :author="message.author" :messageInfo="{...message, author: undefined}"/>
            </div>
        </div>
    </div>
</template>

<script>
import Message from "../components/Message.vue";
import Post from "../components/Post.vue";
export default {
    name: "message-gui",
    components: {
        Message,
        Post
    },
    data() {
        return {
            usernameUrl: "",
            messageIdUrl: "",
            title: "Message: ",
            noUsernameFound: false,
            noMessageFound: false,
            message: {}
        }
    },
    computed: {
        noUsernameMessage() {
            if(typeof this.usernameUrl !== "undefined" && this.usernameUrl !== "") {
                return "Couldn't find a user with the username " + this.usernameUrl + ".";
            }
            return "You didn't enter a proper username!";
        },
        messageNotFoundMessage() {
            if(typeof this.messageIdUrl !== "undefined" && this.messageIdUrl !== "") {
                return "Couldn't find the message " + this.messageIdUrl + " with the username " + this.usernameUrl + ".";
            }
            return "You didn't enter a proper message!";
        }
    },
    created() {
        if(((typeof this.usernameUrl === "undefined" || this.usernameUrl === "") && !(typeof this.$route.params.user === "undefined")) ||
        ((typeof this.messageIdUrl === "undefined" || this.messageIdUrl === "") && !(typeof this.$route.params.messageId === "undefined"))) {
            this.usernameUrl = this.$route.params.user;
            this.usernameUrl = this.usernameUrl.replace(/[^-_.a-zA-Z0-9]/g, '');
            this.messageIdUrl = this.$route.params.messageId;
            this.messageIdUrl = this.messageIdUrl.replace(/[^-_.a-zA-Z0-9]/g, '');
            if(this.usernameUrl !== this.$route.params.username || this.messageIdUrl !== this.$route.params.messageId) {
                const path = "/message/" + this.usernameUrl + "/" + this.messageIdUrl;
                this.$router.push({path:path});
            }
        }
        this.$watch(() => this.$route,
            (toParams, previousParams) => {
                this.usernameUrl = this.$route.params.user;
                this.usernameUrl = this.usernameUrl.replace(/[^-_.a-zA-Z0-9]/g, '');
                this.messageIdUrl = this.$route.params.messageId;
                this.messageIdUrl = this.messageIdUrl.replace(/[^-_.a-zA-Z0-9]/g, '');
                if(this.usernameUrl !== this.$route.params.username || this.messageIdUrl !== this.$route.params.messageId) {
                    const path = "/message/" + this.usernameUrl + "/" + this.messageIdUrl;
                    this.$router.push({path:path});
                }
        });
    },
    methods: {
        async retrieveMessage() {
            if(this.usernameUrl === "") {
                this.noUsernameFound = true;
                this.message = {};
                return;
            }
            if(this.messageIdUrl === "") {
                this.noMessageFound = true;
                this.message = {};
                return;
            }
            const response = await fetch("/api/social/messages/"+this.usernameUrl+"/"+this.messageIdUrl); 
            const data = await response.json();
            if(response.ok) {
                this.noMessageFound = false;
                this.noUsernameFound = false;
                this.message = data;
            } else {
                if(response.status === 404) {
                    if(typeof data.error === "undefined") {
                        this.noMessageFound = true;
                        return;
                    }
                    if(data.error === "MessageNotFound") {
                        this.noMessageFound = true;
                    }
                    if(data.error === "UsernameNotFound") {
                        this.noUsernameFound = true;
                    }
                }
            }
        }
    },
    watch: {
        "usernameUrl" : {
            immediate: false,
            handler(value) {
                this.retrieveMessage();
            }
        },
        "messageIdUrl" : {
            immediate: false,
            handler(value) {
                this.retrieveMessage();
            }
        }
    }
}
</script>

<style scoped>
.MessageGUI {
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>