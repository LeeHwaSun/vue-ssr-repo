<template>
    <div>
        <!-- 관리자 메뉴 -->
        <v-list v-if="isAdmin" dense>
            <v-subheader>Admin Menu</v-subheader>
            <v-list-item
                v-for="item in admMenus"
                :key="item.title"
                dense
                :to="item.to"
            >
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <!-- // 관리자 메뉴 -->
        <v-card-actions>
          <v-btn block color="primary" @click="$emit('open')">Info</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn block @click="userLogout" color="secondary">Logout</v-btn>
        </v-card-actions>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
export default {
    name : "UserMenu",
    data() {
        return {
            admMenus: [
                { title : "Config", icon : "mdi-cog", to : "/adm/config" },
                { title : "User", icon : "mdi-account-cog", to : "/adm/user" }
            ]
        }
        
    },
    computed : {
        ...mapState({
            user : state => state.user.user,
        }),
        ...mapGetters('user', ["isAdmin", "isSuper"]),
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