<template>
    <div id="Write" class="Write">
        <form-component :fields="fields" :buttonText="'Publish'" :titleText="'Message: '" @form-submitted="publishMessage" :isWritingMessage="true" />
        <message v-if="error" :paragraphs="[errorMessage]" />
    </div>
</template>

<script>
import FormComponent from "../components/Form.vue";
import Message from "../components/Message.vue";
export default {
    name: "write",
    components: {
        FormComponent,
        Message
    },
    data() {
        return {
            fields: [
                {"name" : "message", "type" : "text", "label" : "Write a message you want to publish...", "isParagraph" : true}
            ],
            message: "",
            error: false,
            errorMessage: "You can't post an empty message!"
        }
    },
    methods: {
        async publishMessage(fieldValues) {
            const formData = Object.assign({}, fieldValues);
            try {
                if(!formData.message) {
                    this.error = true;
                    this.errorMessage = "Error: You can't post an empty message!";
                    return;
                }
                const response = await fetch("/api/social/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify(formData)
                });
                let data;
                if(!response.ok) {
                    this.error = true;
                    if(response.status===404) {
                        this.errorMessage = "Error: Could not find the server.";
                        return;
                    }
                    this.errorMessage = "Unidentified error."
                    return;
                }
                data = await response.json();
                const path = "/message/" + data.author.username + "/" + data.messageId;
                this.$router.push({path:path});
            } catch(err) {
                console.log(err);
            }
        }
    }
}
</script>

<style scoped>
.Write {
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>