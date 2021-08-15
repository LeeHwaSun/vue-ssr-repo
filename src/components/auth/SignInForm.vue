<template>
    <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
        <v-text-field 
            label="아이디"
            v-model="form.user_id"
            :rules="rules.id()"
            class="mb-4"
        />
        <input-password
            label="비밀번호"
            v-model="form.user_pwd"
            :rules="rules.password()"
            class="mb-4"
        />

        <v-btn block color="primary" type="submit" :loading="isLoading">LOGIN</v-btn>
    </v-form>
</template>

<script>
import validateRules from '../../../util/validateRules';
import InputPassword from '../../components/inputForms/InputPassword.vue';
export default {
    components: { InputPassword },
    name: "SignInForm",
    props: {
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            valid : true,
            form : {
                user_id : "",
                user_pwd : ""
            }
        }
    },
    computed: {
        rules: () => validateRules
    },
    methods: {
        async save() {
            this.$refs.form.validate();
            await this.$nextTick();
            if (!this.valid) return;
            this.$emit('save', this.form);
        }
    }
}
</script>

<style>

</style>