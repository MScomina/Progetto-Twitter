<template>
    <container>
        <div class="title">
            <h1 v-if="title" v-text="title"></h1>
        </div>
        <div class="text">
            <p v-for="(paragraph, index) in paragraphs" v-bind:key="index" v-text="paragraph"></p>
        </div>
    </container>
</template>

<style scoped>
.title {
    width: 100%;
    margin-top: 1px;
    text-align: center;
}

.text {
    margin-top: 8px;
    text-align: center;
}
</style>

<script>
import Container from "./Container.vue";
export default {
    components: {
        Container
    },
    name: "message",
    props: {
        title: {
            type: String,
            default: ""
        },
        paragraphs: {
            type: Array,
            default: []
        }
    }
};
</script>
