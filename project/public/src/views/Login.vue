<template>
    <div id="Login" class="Login">
        <form-component class="form" :fields="fields" @form-submitted="handleSubmit" :buttonText="buttonText" :titleText="titleText" />
        <message class="message" v-if="showMessage" :paragraphs="[message]"/>
    </div>
</template>

<script>
import FormComponent from "../components/Form.vue";
import Message from "../components/Message.vue";
export default {
    data() {
        return {
            fields: [
                {"name" : "username", "type" : "text", "label" : "Username"},
                {"name" : "password", "type" : "password", "label" : "Password"}
            ],
            buttonText: "Log in!",
            titleText: "Login",
            showMessage: false,
            message: "",
        };
    },
    components: {
        FormComponent,
        Message
    },
    methods: {
        async handleSubmit(fieldValues) {
            this.showMessage = false;
            const formData = Object.assign({}, fieldValues);
            try {
                if(!formData.username || !formData.password) {
                    this.showMessage = true;
                    this.message = "Error: Please fill all the mandatory fields.";
                    return;
                }
                const response = await fetch("/api/auth/signin", {
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
                        try {
                            data = await response.json();
                            if(data.error === "UsernameNotFound") {
                                this.message = "Error: Could not find that username.";
                                return;
                            }
                        } catch(error) {
                            this.message = "Error: Could not find the server.";
                            return;
                        }
                    }
                    data = await response.json();
                    if(data.error==="IncorrectPasswordError") {
                        this.message = "Error: The credentials are not correct!";
                        return;
                    }
                    this.message = "Error: Unidentified error."
                    return;
                }
                data = await response.json();
                this.$store.commit("authenticate");
                this.$store.commit("setUsername", {"username": formData.username});
                this.$router.push({path:"/"});
            } catch(errorResponse) {
                console.log(errorResponse);
            }
        }
    }
}
</script>

<style scoped>
.Login {
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.form {
    order: 1;
    margin-bottom: 20px;
}
.message {
    order: 2;
}
</style>