<template>
    <div id="Follow" class="Follow">
        <div v-if="isAuthenticated">
            <message :title="title"/>
            <div v-if="!isFollowing">
                <message :paragraphs="[noFollowingMessage]"/>
            </div>
            <div v-else>
                <div v-for="follow in following" :key="follow.username">
                    <user :user="follow" :followingBefore="true"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.Follow {
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>

<script>
import Message from "../components/Message.vue";
import User from "../components/User.vue";
export default {
    name: "Follow",
    components: {
        Message,
        User
    },
    data() {
        return {
            title: "Following: ",
            noFollowingMessage: "You aren't following anyone at the moment!",
            following: []
        };
    },
    computed: {
        isAuthenticated() {
            return this.$store.state.isAuthenticated;
        },
        isFollowing() {
            return this.following.length !== 0;
        }
    },
    methods: {
        async retrieveFollows() {
            const response = await fetch("/api/social/followers/"+this.$store.state.username);
            if(response.ok) {
                const data = await response.json();
                this.following = data.following;
            }
        }
    },
    watch: {
        "$store.state.isAuthenticated" : {
            immediate: true,
            handler(value) {
                if(value) {
                    this.retrieveFollows();
                }
            }
        }
    },
}
</script>