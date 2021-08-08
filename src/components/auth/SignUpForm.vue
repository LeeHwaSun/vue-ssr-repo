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
        class="mb-5 mt-5"
      />
      <v-text-field
        label="이름"
        v-model="form.user_name"
        prepend-icon="mdi-card-account-details-outline"
        :rules="rules.name()"
        class="mb-5"
      />
      <input-password 
        label="비밀번호"
        prepend-icon="mdi-lock"
        v-model="form.user_pwd"
        :rules="rules.password()"
        class="mb-5"
      />
      <input-password 
        label="비밀번호확인"
        prepend-icon="mdi-lock-check"
        v-model="confirmPw"
        :rules="[rules.matchValue(form.user_pwd)]"
        class="mb-5"
      />
      <input-duplicate-check 
        ref="email"
        label="이메일"
        prepend-icon="mdi-email"
        v-model="form.user_email"
        :rules="rules.email()"
        :cbCheck="cbCheckEmail"
        class="mb-5"
      />
      <input-date 
        v-model="form.user_birth"
        label="생년월일"
        prepend-icon="mdi-calendar"
        :rules="rules.date( { label:'생년월일'}  )"
        class="mb-5"
      />
      <v-btn type="submit" block color="primary" class="mt-5">Join</v-btn>
  </v-form>
</template>

<script>
import InputDuplicateCheck from '../inputForms/InputDuplicateCheck.vue'
import InputPassword from '../inputForms/InputPassword.vue'
import InputDate from '../inputForms/InputDate.vue'
import validateRules from '../../../util/validateRules'
export default {
    components: { InputDuplicateCheck, InputPassword, InputDate },
    name: "SignUpForm",
    props: {
        cbCheckId : {
            type: Function,
            default: null,
        },
        cbCheckEmail : {
            type: Function,
            default: null,
        }
    },
    data() {
        return {
            valid: true,
            form: {
                user_id: "test1111",
                user_pwd: "{cx2243bw?!}",
                user_name: "이화선",
                user_birth: "",
                user_gender: "",
                user_email: "op_instinct@naver.com",
                user_phone: "",
                user_zip: "",
                user_addr1: "",
                user_addr2: "",
            },
            confirmPw : "",
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
            if (!this.$refs.email.validate()) return;
            console.log(this.form);
        }
    }
}
</script>

<style>

</style>