<template>
    <div id="Search" class="Search">
        <message :title="title"/>
        <div v-if="!hasResults">
            <message :paragraphs="[noResultsMessage]"/>
        </div>
        <div v-else>
            <div v-for="result in results" :key="result.username">
                <user class="user" :user="result" :followingBefore="result.isFollowing" />
            </div>
        </div>
    </div>
</template>

<script>
import Message from "../components/Message.vue";
import User from "../components/User.vue";
export default {
    data() {
        return {
            searchString: "",
            results: [],
            title: "Results: ",
            noResultsMessage: "No results matched your query!"
        };
    },
    components: {
        Message,
        User
    },
    computed: {
        hasResults() {
            return (this.results.length !== 0);
        }
    },
    created() {
        if((typeof this.searchString === "undefined" || this.searchString === "") && !(typeof this.$route.params.query === "undefined")) {
            this.searchString = this.$route.params.query;
            this.searchString = this.searchString.replace(/[^-_.a-zA-Z0-9]/g, '');
            if(this.searchString !== this.$route.params.query) {
                const path = "/search/" + this.searchString;
                this.$router.push({path:path});
            }
        }
        this.$watch(() => this.$route,
            (toParams, previousParams) => {
                this.searchString = this.$route.params.query;
                this.searchString = this.searchString.replace(/[^-_.a-zA-Z0-9]/g, '');
                if(this.searchString !== this.$route.params.query) {
                    const path = "/search/" + this.searchString;
                    this.$router.push({path:path});
                }
        });
    },
    methods: {
        async search() {
            if(this.searchString === "") {
                this.results = [];
                return;
            }
            const response = await fetch("/api/social/search?q="+this.searchString);
            if(response.ok) {
                const data = await response.json();
                this.results = data.users;
            } else {
                this.results = [];
            }
        },        
        formatUser(result) {
            const { isFollowing, ...user } = result;
            return user;
        }
    },
    watch: {
        "searchString" : {
            immediate: true,
            handler(value) {
                this.search();
            }
        }
    }
}
</script>

<style scoped>
.Search {
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>