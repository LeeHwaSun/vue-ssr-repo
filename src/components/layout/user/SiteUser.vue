<template>
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
      <template v-if="user">
        <user-menu />
      </template>
      <template v-else>
        <no-user-menu />
      </template>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex';
import DisplayAvatar from '../user/DisplayAvatar.vue';
import UserMenu from '../user/UserMenu.vue';
import NoUserMenu from '../user/NoUserMenu.vue';
export default {
  components: { DisplayAvatar, UserMenu, NoUserMenu },
  name : 'SiteUser',
  data() {
    return {
      isLoading : false
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
    setDarkMode(mode) {
      this.$vuetify.theme.dark = mode;
      localStorage.setItem('darkMode', mode ? 'dark' : 'light');
    },
    getDarkMode() {
      const mode = localStorage.getItem('darkMode') === 'dark' ? true : false;
      this.$vuetify.theme.dark = mode;
    }
  }
}
</script>

<style>

</style>