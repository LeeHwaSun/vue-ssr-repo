<template>
    <div v-if="fieldType == 'String'">
        <v-text-field label="Value" :value="value" @input="onInput" />
    </div>
    <div v-else-if="fieldType == 'Number'">
        <v-text-field label="Value" type="number" :value="value" @input="onInput" />
    </div>
    <div v-else-if="fieldType == 'JSON'">
        <v-textarea label="Value" :value="value" @input="onInput"></v-textarea>
    </div>
    <div v-else-if="fieldType == 'Secret'">
        <input-password label="Secret Value" :value="value" @input="onInput"/>
    </div>
    <div v-else>
        <div>타입을 먼저 선택해 주세요.</div>
    </div>
</template>

<script>
import InputPassword from '../../../components/inputForms/InputPassword.vue';
export default {
    components : { InputPassword }, 
    name : "TypeValue",
    model : {
        prop : 'value',
        event : 'input'
    },
    props : {
        value : {
            type : String
        },
        fieldType : {
            type : String,
            default : 'String'
        }
    },
    methods : {
        onInput(val) {
            this.$emit("input", val);
        }
    }
}
</script>

<style>

</style>