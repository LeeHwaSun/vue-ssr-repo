<template>
  <v-btn text plain class="text-none title-header px-0" to="/">{{ title }}</v-btn>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: "SiteHeader",
  computed: {
    ...mapState({
      title : state => state.config.title
    })
  }
}
</script>

<style>

</style>