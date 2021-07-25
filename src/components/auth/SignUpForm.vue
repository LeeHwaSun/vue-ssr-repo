<template>
  <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
      <input-duplicate-check 
        ref="id"
        label="아이디"
        prepend-icon="mdi-account"
        v-model="form.user_id"
        :counter="30"
        :rules="rules.id()"
        :cbCheck="cbCheckId"
      />
      <v-btn type="submit" block color="primary" class="mt-5">Join</v-btn>
  </v-form>
</template>

<script>
import InputDuplicateCheck from '../inputForms/InputDuplicateCheck.vue'
import validateRules from '../../../util/validateRules'
export default {
    components: { InputDuplicateCheck },
    name: "SignUpForm",
    props: {
        cbCheckId : {
            type: Function,
            default: null,
        }
    },
    data() {
        return {
            valid: true,
            form: {
                user_id: "",
                user_pwd: "",
                user_name: "",
                user_birth: "",
                user_gender: "",
                user_email: "",
                user_phoneL: "",
                user_zip: "",
                user_addr1: "",
                user_addr2: "",
            }
        }
    },
    computed: {
        rules : () => validateRules,
    },
    methods: {
        async save() {
            this.$refs.form.validate();
            await this.$nextTick();
            if (!this.valid) return;
            if (!this.$refs.id.validate()) return;
        }
    }
}
</script>

<style>

</style>