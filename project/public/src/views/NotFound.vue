<template>
    <div id="NotFound" class="NotFound">
        <message :title="title" :paragraphs="paragraphs" />
    </div>
</template>

<script>
import Message from "../components/Message.vue";
export default {
    data() {
        return {
            title: "Sorry!",
            paragraphs: [
                "We couldn't find the page you were looking for.",
                "If you believe this to be an error, contact Michele Scomina."
            ]
        };
    },
    name: "NotFound",
    components: {
        Message
    }
}
</script>

<style scoped>
.NotFound {
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>