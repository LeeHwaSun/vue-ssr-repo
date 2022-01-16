<template>
    <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
        <v-text-field 
            v-if="!!form.user_provider" 
            v-model="form.user_provider" 
            label="SNS 제공자"
            prepend-icon="mdi-account-network"
            readonly />
        <input-duplicate-check 
            v-else
            ref="id"
            label="아이디"
            prepend-icon="mdi-account"
            v-model="form.user_id"
            readonly
            class="mb-5 mt-5"
        />
        <v-text-field
            label="이름"
            v-model="form.user_name"
            prepend-icon="mdi-card-account-details-outline"
            :rules="rules.name()"
            class="mb-5"
        />
        <template v-if="!user.user_provider && (user.user_provider != 'google' || user.user_provider != 'kakao')">
            <input-password 
                label="비밀번호"
                prepend-icon="mdi-lock"
                v-model="form.user_pwd"
                :rules="rules.password({required : false})"
                class="mb-5"
            />
            <input-password 
                label="비밀번호확인"
                prepend-icon="mdi-lock-check"
                v-model="confirmPw"
                :rules="[rules.matchValue(form.user_pwd)]"
                class="mb-5"
            />
        </template>
        <input-duplicate-check 
            ref="email"
            label="이메일"
            prepend-icon="mdi-email"
            v-model="form.user_email"
            :rules="rules.email()"
            :cbCheck="cbCheckEmail"
            :readonly="!admMode"
            :origin="user.user_email"
            class="mb-5"
        />
        <div v-if="admMode" class="pb-2">
            <input-level label="레벨" v-model="form.user_level" :icon="mdi-chevron-triple-up" /> 
            <!--<div class="pl-10 text-caption">레벨 {{ form.user_level }} : <span>{{ lvLabel }}</span></div>
            <v-slider
                v-model="form.user_level"
                :min="LV.BLOCK"
                :max="LV.SUPER"
                ticks="always"
                thumb-label
                prepend-icon="mdi-chevron-triple-up"
                hide-details
            >
            </v-slider>-->
        </div>
        <input-date 
            v-model="form.user_birth"
            label="생년월일"
            prepend-icon="mdi-calendar"
            :rules="rules.date( { label:'생년월일', required: !admMode }  )"
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
            :rules="rules.phone({ required : !admMode })"
        />
        <input-post 
            :zipcode.sync="form.user_zip"
            :addr1.sync="form.user_addr1"
            :addr2.sync="form.user_addr2"
            :required="!admMode"
        />
        <div class="d-flex align-center">
            <display-avatar :user="user" />
            <v-file-input 
                label="회원이미지"
                :prepend-icon="null"
                v-model="form.user_image"
                accept="image/jpg,image/jpeg,image/png"
                class="ml-2"
            />
            <v-checkbox
                v-model="form.deleteImage"
                label="삭제"
            />
        </div>
        
        
        <v-btn type="submit" block color="primary" class="mt-5" :loading="isLoading">Update</v-btn>
        <v-btn v-if="!this.isLeave()" block color="error" class="mt-5" :loading="isLoading" @click="$emit('onLeave')">Leave</v-btn>
        <v-btn v-else block color="error" class="mt-5" :loading="isLoading" @click="$emit('onRestore')">Restore</v-btn>
    </v-form>
</template>

<script>
import InputDuplicateCheck from '../inputForms/InputDuplicateCheck.vue';
import InputPassword from '../inputForms/InputPassword.vue';
import InputDate from '../inputForms/InputDate.vue';
import InputRadio from '../inputForms/InputRadio.vue';
import InputPhoneNumber from '../inputForms/InputPhoneNumber.vue';
import InputPost from '../inputForms/InputPost.vue';
import validateRules from '../../../util/validateRules';
import { deepCopy } from '../../../util/lib';
import DisplayAvatar from '../layout/user/DisplayAvatar.vue';
import InputLevel from '../inputForms/InputLevel.vue';
export default {
    components : { 
        InputDuplicateCheck, 
        InputPassword,
        InputDate,
        InputRadio,
        InputPhoneNumber,
        InputPost,
        DisplayAvatar,
        InputLevel,
    },
    name : "UserUpdateForm",
    props : {
        admMode : {
            type : Boolean,
            default : false,
        },
        user : {
            type : Object,
            required : true,
        },
        isLoading : {
            type : Boolean,
            required : true,
        },
        cbCheckEmail : {
            type : Function,
            default : null
        },
    },
    data() {
        return {
            valid : true,
            form : null,
            genderItems : [
                { label : "남자", value : "M" },
                { label : "여자", value : "F" },
            ],
            confirmPw : "",
            leaveDate : null,
        }
    },
    computed: {
        rules : () => validateRules,
    },
    created() {
        this.form = deepCopy(this.user);
        this.form.user_pwd = "",
        this.form.admMode = this.admMode;
        this.form.deleteImage = false;
        this.leaveDate = this.form.user_leave_at;
        delete this.form.user_create_at;
		delete this.form.user_create_ip;
		delete this.form.user_update_at;
		delete this.form.user_update_ip;
		delete this.form.user_login_at;
		delete this.form.user_login_ip;
		delete this.form.user_leave_at;
    },
    methods: {
        async save() {
            this.$refs.form.validate();
            await this.$nextTick();
            if (!this.valid) return;
            if (!this.$refs.email.validate()) return;
            const formData = new FormData();
            const keys = Object.keys(this.form);
            for (const key of keys) {
                formData.append(key, this.form[key]);
            }
            this.$emit("onSave", formData);
        },
        isLeave() {
            return this.leaveDate ? true : false;
        }
    }
}
</script>

<style>

</style>