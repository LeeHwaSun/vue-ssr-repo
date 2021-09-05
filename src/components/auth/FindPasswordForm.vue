<template>
    <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
        <v-text-field 
            label="아이디"
            v-model.trim="form.user_id"
            :rules="rules.id()"
            class="mb-4"
        />
        <v-text-field 
            label="이메일"
            v-model.trim="form.user_email"
            :rules="rules.email()"
            class="mb-4"
        />
        <v-btn block color="primary" type="submit" :loading="isLoading">FIND PASSWORD</v-btn>
    </v-form>
</template>

<script>
import validateRules from '../../../util/validateRules';
export default {
    name : "FindPasswordForm",
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
                user_email : ""
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