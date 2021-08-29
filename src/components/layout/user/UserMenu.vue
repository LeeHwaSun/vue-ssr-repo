<template>
    <div>
        <v-card-actions>
          <v-btn block color="primary">Info</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn block @click="userLogout" color="secondary">Logout</v-btn>
        </v-card-actions>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    name : "UserMenu",
    computed : {
        ...mapState({
            user : state => state.user.user,
        })
    },
    methods: {
        ...mapActions('user', ['logout']),
        async userLogout() {
            const user_name = await this.logout();
            if (user_name) {
                this.$toast.info(`${user_name}님 로그아웃 하였습니다.`);
                if (this.$route.name != 'Home') {
                    this.$router.push('/');
                }
            }
        }
    }
}
</script>

<style>

</style>