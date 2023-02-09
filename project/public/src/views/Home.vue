<template>
    <div id="Home" class="Home">
        <!-- Homepage (not authenticated) -->
        <message :title="titleUnauth" :paragraphs="paragraphsUnauth" v-if="!isAuthenticated" />
        <!-- Homepage (authenticated, presents the feed from the followed users) -->
        <div v-else>
            <div v-if="!feedsExist">
                <message :title="titleNoFeed" :paragraphs="[paragraphsNoFeed]"/>
            </div>
            <div v-else>
                <message :title="titleFeed" class="feed"/>
                <div v-for="feed in feeds" :key="feed.messageId">
                    <post :messageId="feed.messageId" :author="feed.author" :message="feed.message" :date="feed.createdAt" :nOfLikes="feed.numberOfLikes" :likedBefore="feed.liked"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.Home {
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.feed {
    margin-bottom: 10px;
}
</style>

<script>
import Message from "../components/Message.vue";
import Post from "../components/Post.vue";
export default { 
    name: "Home",
    components: {
        Message,
        Post
    },
    data() {
        return {
            titleUnauth: "Welcome!",
            paragraphsUnauth: [
                "This is a social network web page created by Michele Scomina for the course \"Programmazione Web\".",
                "You are currently in the home page.",
                "This page has been built using the Vue.js framework.",
                "You are not authenticated as of right now!"
            ],
            feeds: [],
            titleNoFeed: "No feeds!",
            titleFeed: "Feeds:",
            paragraphsNoFeed: "You currently do not have any feeds! Start following someone to start getting feeds in your homepage!"
        };
    },
    computed : {
        isAuthenticated() {
            return this.$store.state.isAuthenticated;
        },
        feedsExist() {
            return !(this.feeds.length===0);
        }
    },
    methods: {
        async retrieveFeed() {
            const response = await fetch("/api/social/feed");
            if(response.ok) {
                const data = await response.json();
                this.feeds = data.messages;
            }
        }
    },
    watch: {
        "$store.state.isAuthenticated" : {
            immediate: true,
            handler(value) {
                if(value) {
                    this.retrieveFeed();
                }
            }
        }
    }
}
</script>