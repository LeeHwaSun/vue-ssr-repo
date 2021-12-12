<template>
  <div class="d-flex justify-center align-center" style="height: 100%;">
    <v-card max-width="400" width="100%" elevation="10" class="ma-4">
        <v-toolbar>
            <v-toolbar-title>
              <site-header />
            </v-toolbar-title>
        </v-toolbar>
        <v-tabs v-model="tabs" background-color="primary" dark>
          <v-tab v-for="item in items" :key="item" style="flex:1">
            {{ item }}
          </v-tab>
        </v-tabs>
        <v-card-text>
          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <sign-in-form @save="login" :isLoading="isLoading" />
            </v-tab-item>
            <v-tab-item>
              <find-id-form @save="findId" :isLoading="isLoading" />
            </v-tab-item>
            <v-tab-item>
              <find-password-form @save="findPassword" :isLoading="isLoading" />
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <!--v-card-text class="mt-n4">
          <v-btn @click="loginGoogle" block color="secondary">Google Login</v-btn>
        </v-card-text-->
        <!--v-card-text class="mt-n4">
          <v-btn @click="loginKakao" block color="secondary">Kakao Login</v-btn>
        </v-card-text-->
        <!--v-card-text class="mt-n4">
          <v-btn @click="loginNaver" block color="secondary">Naver Login</v-btn>
        </!--v-card-text-->
        <v-card-text class="mt-n4">
          <v-btn to="/join" block>Join to User</v-btn>
        </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import SiteHeader from '../../components/layout/common/SiteHeader.vue';
import SignInForm from '../../components/auth/SignInForm.vue';
import FindIdForm from '../../components/auth/FindIdForm.vue';
import FindPasswordForm from '../../components/auth/FindPasswordForm.vue';
export default {
  components : { 
    SiteHeader, 
    SignInForm, 
    FindIdForm, 
    FindPasswordForm },
  name: "Login",
  title: "로그인",
  data() {
    return {
      tabs : parseInt(this.$route.query.tab) || 0,
      items : ['Login', 'Find ID', 'Find Password'],
      isLoading: false,
    }
  },
  computed : {
    ...mapState({
      user : state => state.user.user,
    }),
  },
  methods: {
    ...mapActions('user', ['loginUserLocal', 'findIDLocal', 'findPasswordLocal', 'loginUserSocial']),
    async login(form) {
      this.isLoading = true;
      const data = await this.loginUserLocal(form);
      this.isLoading = false;
      if (data) {
        this.$router.push('/');
        this.$toast.info(`${this.user.user_name}님 환영합니다!!!`);
      }
    },
    async findId(form) {
      this.isLoading = true;
      const data = await this.findIDLocal(form);
      this.isLoading = false;
      if (data && data.user_id) {
        await this.$myNotify.alert(`<span style="font-size:17px;">아이디는 [ <b>${data.user_id}</b> ] 입니다.</span>`, "FIND ID");
        form.user_name = '';
        form.user_email = '';
        this.tabs = 0;
      }
    },
    async findPassword(form) {
      this.isLoading = true;
      const data = await this.findPasswordLocal(form);
      this.isLoading = false;
      if (data && data.user_name) {
        this.$toast.info(`${data.user_name}님 ${form.user_email}로 이메일을 발송하였습니다.`);
        form.user_id = '';
        form.user_email = '';
        this.tabs = 0;
      }
    },
    socialPopup(url) {
      const childWindow = window.open(
        url,
        "socialLoginPopup",
        "top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizeable=no"
      );

      if (!window.onSocialCallback) {
        window.onSocialCallback = this.socialLoginCallback;
      }
    },
    loginGoogle() {
      this.socialPopup("/api/user/loginGoogle");
    },
    loginKakao() {
      this.socialPopup("/api/user/loginKakao");
    },
    loginNaver() {
      this.socialPopup("/api/user/loginNaver");
    },
    socialLoginCallback(payload) {
      if (payload.err) {
        this.$toast.err(payload.err);
      } else {
        this.loginUserSocial(payload);
        this.$router.push('/');
        this.$toast.info(`${this.user.user_name}님 환영합니다!!!`);
      }
    },
    
  }
}
</script>

<style>

</style>