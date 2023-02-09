<template>
    <div id="Search" class="Search">
        <user/>
        <post/>
    </div>
</template>

<script>
import User from "../components/User.vue";
import Post from "../components/Post.vue";
export default {
    data() {
        return {
            data: 0
        };
    },
    components: {
        User,
        Post
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