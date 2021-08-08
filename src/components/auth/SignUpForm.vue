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
        :rules="rules.date( { label:'생년월일' }  )"
        class="mb-5"
      />
      <input-radio 
        v-model="form.user_gender"
        prepend-icon="mdi-gender-male-female"
        class="mb-5"
        :items="genderItems"
        row
        :rules="[rules.required({ label: '성별' })]"
      />
      <input-phone-number 
        label="전화번호"
        prepend-icon="mdi-phone"
        v-model="form.user_phone"
        class="mb-5"
        :rules="rules.phone()"
      />
      <input-post 
        :zipcode.sync="form.user_zip"
        :addr1.sync="form.user_addr1"
        :addr2.sync="form.user_addr2"
      />
      <v-btn type="submit" block color="primary" class="mt-5" :loading="isLoading">Join</v-btn>
  </v-form>
</template>

<script>
import InputDuplicateCheck from '../inputForms/InputDuplicateCheck.vue'
import InputPassword from '../inputForms/InputPassword.vue'
import InputDate from '../inputForms/InputDate.vue'
import InputRadio from '../inputForms/InputRadio.vue'
import InputPhoneNumber from '../inputForms/InputPhoneNumber.vue'
import InputPost from '../inputForms/InputPost.vue'
import validateRules from '../../../util/validateRules'
export default {
    components: { 
      InputDuplicateCheck, 
      InputPassword, 
      InputDate, 
      InputRadio, 
      InputPhoneNumber, 
      InputPost 
    },
    name: "SignUpForm",
    props: {
        isLoading : {
          type : Boolean,
          required : true,
        },
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
                user_id: "lhs10270",
                user_pwd: "{cx2243bw?!}",
                user_name: "이화선",
                user_birth: "1989-02-26",
                user_gender: "M",
                user_email: "op_instinct@naver.com",
                user_phone: "010-9788-1027",
                user_zip: "11738",
                user_addr1: "경기 의정부시 동일로466번길 3 (신곡동, 서해아파트)",
                user_addr2: "105동 703호",
            },
            genderItems: [
              { label: "남자", value: "M" },
              { label: "여자", value: "F" },
            ],
            confirmPw : "{cx2243bw?!}",
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
            this.$emit('onSave', this.form);
        }
    }
}
</script>

<style>

</style>