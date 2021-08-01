<template>
  <div class="d-flex justify-center align-center" style="height: 100%;">
      <v-card max-width="400" width="100%" elevation="10" class="ma-4">
          <v-toolbar>
              <v-toolbar-title>Join to User</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
              <sign-up-form :cbCheckId="checkId"/>
          </v-card-text>
      </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SignUpForm from '../../components/auth/SignUpForm.vue';
export default {
    components: { SignUpForm },
    name: "Join",
    methods: {
        ...mapActions('user', ['duplicateCheck']),
        async checkId(id) {
            const data = this.duplicateCheck({field: 'user_id', value: id});
            return data;
        }
    }
}
</script>

<style>

</style>