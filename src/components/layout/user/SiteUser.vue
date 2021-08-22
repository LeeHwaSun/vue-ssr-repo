<template>
  <v-progress-circular v-if="isLoading" indeterminate></v-progress-circular>
  <v-menu v-else offset-y>
    <template v-slot:activator="{on, attrs}">
      <v-btn icon v-on="on" v-bind="attrs">
        <v-avatar color="accent" size="32">
          <template v-if="user">
            <v-img v-if="user.user_img" :src="`/upload/userProfile/${user.user_id}.jpg?w=32&h=32`"></v-img>
            <div v-else>{{ user.user_name[0] }}</div>
          </template>
          <v-icon v-else>mdi-account</v-icon>
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <v-switch label="Dark Theme" :input-value="darkMode" @change="setDarkMode($event)"></v-switch>
      </v-card-text>
      <template v-if="user">
        <v-card-actions>
          <v-btn block color="primary">Info</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn block color="secondary">Logout</v-btn>
        </v-card-actions>
      </template>
      <template v-else>
        <v-card-actions>
          <v-btn block to="/login" color="primary">Login</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn block to="/join" color="secondary">Join</v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex';
export default {
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