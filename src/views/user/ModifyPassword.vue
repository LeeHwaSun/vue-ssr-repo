<template>
    <div class="d-flex justify-center align-center" style="height:100%">
        <v-card max-width="400" width="100%" elevation="10">
            <v-card-subtitle class="text-center">
                변경하실 비밀번호를 입력하세요.
            </v-card-subtitle>
            <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
                <v-card-text>
                    <input-password 
                        v-model="form.password"
                        label="비밀번호"
                        prepend-icon="mdi-lock"
                        :rules="rules.password()"
                    />
                    <input-password 
                        v-model="confirmPw"
                        label="비밀번호 확인"
                        prepend-icon="mdi-lock-check"
                        :rules="[rules.matchValue(form.password)]"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-btn type="submit" block color="primary" :loading="loading">Change Password</v-btn>
                </v-card-actions>
            </v-form>
            <v-card-actions>
                <v-btn to="/login" block>Login</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import validateRules from '../../../util/validateRules';
import InputPassword from '../../components/inputForms/InputPassword.vue';
export default {
    components : { InputPassword },
    name : "ModifyPassword",
    title : "비밀번호 찾기",
    data() {
        return {
            valid : true,
            form : {
                password : "",
                hash : this.$route.params.hash
            },
            confirmPw : "",
            loading : false,
        }
    },
    computed : {
        rules : () => validateRules,
    },
    methods : {
        ...mapActions('user', ['modifyPassword']),
        async save() {
            this.$refs.form.validate();
            await this.$nextTick();
            if (!this.valid) return;
            this.loading = true;
            const data = await this.modifyPassword(this.form);
            this.loading = false;
            if (data) {
                this.$toast.info('비밀번호가 변경되었습니다.');
                this.$router.push('/login');
            }
        }
    }
}
</script>

<style>

</style>