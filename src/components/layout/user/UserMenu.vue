<template>
    <div>
        <!-- 회원 정보 출력 -->
        <v-card-text class="text-subtitle-1">
            <b>{{user.user_name}}</b> ({{LV_LABEL(user.user_level)}})</v-card-text>
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
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import { LV, LV_LABEL } from '../../../../util/level';
export default {
    name : "UserMenu",
    data() {
        return {
            admMenus: [
                { title : "Config", icon : "mdi-cog", to : "/adm/config" },
                { title : "User", icon : "mdi-account-cog", to : "/adm/user" },
                { title : "Menu", icon : "mdi-menu", to : "/adm/menu"},
                { title : "Board", icon : "mdi-clipboard-text-multiple-outline", to : "/adm/board/list" },
                { title : "Popup", icon : "mdi-layers-triple-outline", to : "/board/popup" },
                { title : "Contents", icon : "mdi-content-paste", to : "/board/contents" },
            ]
        }
    },
    socket() {
        return {
            "user:admUpdate" :  async (newUser) => {
                let msg = "";
                if (this.user.user_level != newUser.user_level) {
                    if (newUser.user_level < LV.USER) {
                        // 로그아웃 & 메시지 처리
                        const user_name = await this.logout();
                        this.$toast.error(`${user_name}님 관리자에 의해 서비스 중지 되었습니다.`);
                        if (this.$route.name != 'Home') {
                            this.$router.push('/');
                        }
                        return;
                    } else {
                        // 권한 변경 메시지 처리
                        msg = `\n등급 ${LV_LABEL(this.user.user_level)}(${this.user.user_level}) -> ${LV_LABEL(newUser.user_level)}(${newUser.user_level})`;
                    }
                }
                msg = `${newUser.user_name}님 관리자에 의해 회원 정보가 수정되었습니다.` + msg;
                this.$toast.info(msg);
                this.SET_USER(newUser);
            }
        }
    },
    computed : {
        ...mapState({
            user : state => state.user.user,
        }),
        ...mapGetters('user', ["isAdmin", "isSuper"]),
        LV_LABEL : () => LV_LABEL,
    },
    methods: {
        ...mapMutations('user', ['SET_USER']),
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