<template>
    <div>
        <v-card-actions>
          <v-btn block color="primary">Info</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn block color="secondary">Logout</v-btn>
        </v-card-actions>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name : "UserMenu",
    computed : {
        ...mapState({
            user : state => state.user.user,
        })
    }
}
</script>

<style>

</style>