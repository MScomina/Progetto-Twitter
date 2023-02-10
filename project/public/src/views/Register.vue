<template>
    <div id="Register" class="Register">
        <form-component class="form" :fields="fields" @form-submitted="handleSubmit" :buttonText="buttonText" :titleText="titleText" />
        <message class="message" v-if="showMessage" :paragraphs="[message]"/>
        <message class="message" :paragraphs="serverMessage"/>
    </div>
</template>

<script>
import FormComponent from "../components/Form.vue";
import Message from "../components/Message.vue";
import Post from "../components/Post.vue";
export default {
    data() {
        return {
            fields: [
                {"name" : "username", "type" : "text", "label" : "Username (5-20 characters)"},
                {"name" : "name", "type" : "text", "label" : "Name (2-20 characters)"},
                {"name" : "surname", "type" : "text", "label" : "Surname (2-20 characters)"},
                {"name" : "description", "type" : "text", "label" : "Write a short description about yourself... (max 300 characters, optional)", "isParagraph" : true},
                {"name" : "password", "type" : "password", "label" : "Password"}
            ],
            buttonText: "Register!",
            titleText: "Register a new user:",
            showMessage: false,
            message: "",
            serverMessage: ["Please note that the name and the surname may only have letters and spaces as inputs."," Also, the username must be unique and may only be composed by letters, numbers and the following characters: \"- _ .\""]

        };
    },
    components: {
        FormComponent,
        Message,
        Post
    },
    methods: {
        async handleSubmit(fieldValues) {
            this.showMessage = false;
            const formData = Object.assign({}, fieldValues);
            try {
                if(!formData.username || !formData.name || !formData.surname || !formData.password) {
                    this.showMessage = true;
                    this.message = "Error: Please fill all the mandatory fields.";
                    return;
                }
                if(!formData.description) {
                    formData.description = "";
                }
                const response = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify(formData)
                });
                let data;
                this.showMessage = true;
                if(!response.ok) {
                    if(response.status===404) {
                        this.message = "Error: Could not find the server.";
                        return;
                    }
                    data = await response.json();
                    if(data.error==="ValidationError") {
                        this.message = "Error: Please make sure your fields respect the given format.";
                        return;
                    }
                    if(data.error==="UsernameAlreadyTaken") {
                        this.message = "Error: This username has already been taken!";
                        return;
                    }
                    if(data.error==="InternalServerError") {
                        this.message = "Error: Internal server error."
                        return;
                    }
                    this.message = "Error: Unidentified error."
                    return;
                }
                data = await response.json();
                this.message = data.message;
            } catch(errorResponse) {
                console.log(errorResponse);
            }
        }
    }
}
</script>

<style scoped>
.Register {
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.form {
    order: 1;
}
.message {
    order: 2;
}
</style>