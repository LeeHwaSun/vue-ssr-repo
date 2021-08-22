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
              <sign-in-form @save="login" :isLoading="isLoading"/>
            </v-tab-item>
            <v-tab-item>{{ tabs }} Find ID</v-tab-item>
            <v-tab-item>{{ tabs }} Find Password</v-tab-item>
          </v-tabs-items>
        </v-card-text>
        <v-card-text class="mt-n4">
          <v-btn to="/join" block>Join to User</v-btn>
        </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SiteHeader from '../../components/layout/common/SiteHeader.vue';
import SignInForm from '../../components/auth/SignInForm.vue';
export default {
  components : { SiteHeader, SignInForm },
  name: "Login",
  title: "로그인",
  data() {
    return {
      tabs : 0,
      items : ['Login', 'Find ID', 'Find Password'],
      isLoading: false,
    }
  },
  methods: {
    ...mapActions('user', ['loginUserLocal']),
    async login(form) {
      this.isLoading = true;
      const data = await this.loginUserLocal(form);
      this.isLoading = false;
      console.log('loginUserLocal data ', data);
      this.$router.push('/');
    }
  }
}
</script>

<style>

</style>