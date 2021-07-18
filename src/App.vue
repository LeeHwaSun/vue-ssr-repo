<template>
  <v-app>
    <v-app-bar app color="primary" dark hide-on-scroll>
      <site-header></site-header>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
    <site-footer />
    <vue-progress-bar></vue-progress-bar>
  </v-app>
</template>

<script>
import SiteHeader from './components/layout/SiteHeader.vue';
import SiteFooter from './components/layout/SiteFooter.vue';
export default {
  components: { SiteHeader, SiteFooter },
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
