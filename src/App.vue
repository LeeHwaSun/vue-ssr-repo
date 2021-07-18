<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" :width="drawerWidth">
      <site-navi @close="toggleDrawer"/>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark hide-on-scroll>
      <v-app-bar-nav-icon @click="toggleDrawer" />
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
import SiteNavi from './components/layout/SiteNavi.vue';
export default {
  components: { SiteHeader, SiteFooter, SiteNavi },
  name: 'App',

  data() {
    return {
      drawer : false,
    }
  },
  computed: {
    drawerWidth() {
      return this.$vuetify.breakpoint.xs ? '100%' : '360';
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    }
  }
};
</script>
