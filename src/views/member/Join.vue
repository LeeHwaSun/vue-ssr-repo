<template>
  <div class="d-flex justify-center align-center" style="height: 100%;">
      <v-card max-width="400" width="100%" elevation="10" class="ma-4">
          <v-toolbar>
              <v-toolbar-title>Join to Member</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
              <sign-up-form :cbCheckId="checkId"/>
          </v-card-text>
      </v-card>
  </div>
</template>

<script>
import SignUpForm from '../../components/auth/SignUpForm.vue'
export default {
    components: { SignUpForm },
    name: "Join",
    methods: {
        async checkId(id) {
            return { cnt : 0 };
        }
    }
}
</script>

<style>

</style>