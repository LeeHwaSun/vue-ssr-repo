<template>
  <div>
    <v-progress-circular v-if="isLoading" indeterminate></v-progress-circular>
    <v-menu v-else offset-y>
      <template v-slot:activator="{on, attrs}">
        <v-btn icon v-on="on" v-bind="attrs">
          <display-avatar :user="user" />
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-switch label="Dark Theme" :input-value="darkMode" @change="setDarkMode($event)"></v-switch>
        </v-card-text>
        <user-menu v-if="user" @open="openDialog" />
        <no-user-menu v-else />
      </v-card>
    </v-menu>
    <v-dialog v-if="user" v-model="dialog" persistent max-width="500">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>User Account</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <user-update-form 
            :user="user"
            :isLoading="isLoading"
            :cbCheckEmail="checkEmail"
            @onSave="save"
            @onLeave="leave"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import DisplayAvatar from '../user/DisplayAvatar.vue';
import UserMenu from '../user/UserMenu.vue';
import NoUserMenu from '../user/NoUserMenu.vue';
import UserUpdateForm from '../../auth/UserUpdateForm.vue';
export default {
  components: { DisplayAvatar, UserMenu, NoUserMenu, UserUpdateForm },
  name : 'SiteUser',
  data() {
    return {
      isLoading : false,
      dialog : false,
    }
  },
  computed : {
    ...mapState({
      user : state => state.user.user,
    }),
    darkMode() {
      return this.$vuetify.theme.dark;
    }
  },
  mounted() {
    this.getDarkMode();
  },
  methods: {
    ...mapActions("user", ["duplicateCheck", "checkPassword", "updateUser", "logout"]),
    setDarkMode(mode) {
      this.$vuetify.theme.dark = mode;
      localStorage.setItem('darkMode', mode ? 'dark' : 'light');
    },
    getDarkMode() {
      const mode = localStorage.getItem('darkMode') === 'dark' ? true : false;
      this.$vuetify.theme.dark = mode;
    },
    async openDialog() {
      if (!this.user_user_provider) {
        const user_password = await this.$myNotify.prompt(
          "비밀번호를 입력하세요",
          "회원정보수정",
          { icon : "mdi-alert", formType: "password" }
        );

        if (user_password) {
          this.dialog = await this.checkPassword({ user_password });
        }
      } else {
        this.dialog = true;
      }
    },
    closeDialog() {
      this.dialog = false;
    },
    async save(form) {
      this.isLoading = true;
      const data = await this.updateUser(form);
      this.isLoading = false;
      if (data) {
        this.$toast.info(`${this.user.user_name}님 정보 수정하였습니다.`);
        this.closeDialog();
      }
    },
    async leave() {
      const result = await this.$myNotify.confirm('탈퇴하시겠습니까?', '회원탈퇴', {
        icon : 'mdi-alert',
      });

      if (!result) return;

      this.isLoading = true;

      const form = {
        user_id : this.user.user_id,
        user_leave_at : this.$moment().format('LT')
      }
      const data = await this.updateUser(form);
      this.isLoading = false;
      if (data) {
        this.closeDialog();
        const user_name = await this.logout();
        this.$toast.info(`${user_name}님 탈퇴하였습니다.`);
        this.$router.push('/');
      }
    },
    async checkEmail(email) {
      const data = await this.duplicateCheck({
        field: "user_email",
        value: email,
      });
      return data;
    }
  }
}
</script>

<style>

</style>