<template>
    <container>
        <form @submit.prevent="submitForm" class="form">
            <h1 v-text="titleText"></h1>
            <div v-for="field in fields" :key="field.name">
                <textarea v-if="field.isParagraph" :type="field.type" :placeholder="field.label" v-model="fieldValues[field.name]"></textarea>
                <input v-else :type="field.type" :placeholder="field.label" v-model="fieldValues[field.name]"/>
            </div>
            <button class="btn" type="submit" v-text="buttonText"></button>
        </form>
    </container>
</template>

<style scoped>
input {
    border: 1px solid #EEEEEE;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 20px;
    background-color: #EEEEEE;
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    order: 1;
}

.form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #000000;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    margin: 5px;
    border: 1px solid #FFFFFF;
    border-radius: 20px;
    order: 2;
    cursor: pointer;
}
.btn:hover {
    background-color: #555555;
    box-shadow: 0px 0px 10px #444444;
    transform: scale(1.05);
}

.btn:active {
    transition: transform 0.15s;
    transform: scale(0.9);
}

textarea {
    width: 250px;
    height: 100px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    resize: none;
}
</style>

<script>
import Container from "./Container.vue";
export default {
    components: {
        Container
    },
    data() {
        return {
            fieldValues: {},
            cooldown: false
        }
    },
    methods: {
        submitForm() {
            if(this.cooldown) {
                return;
            }
            this.$emit("form-submitted", this.fieldValues);
            this.cooldown=true;
            setTimeout(() => {
                this.cooldown = false;
            }, 1000);
        }
    },
    name: "custom-form",
    props: {
        buttonText: {
            type: String,
            default: "Submit"
        },
        titleText: {
            type: String,
            default: "Title"
        },
        fields: Array
    }
};
</script>
