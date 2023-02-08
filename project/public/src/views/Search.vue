<template>
    <div id="Search" class="Search">
        <post/>
        <post/>
        <post/>
    </div>
</template>

<script>
import Post from "../components/Post.vue";
export default {
    data() {
        return {
            data: 0
        };
    },
    components: {
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