<template>
    <v-card flat v-if="item">
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>{{item.wr_title}}</v-toolbar-title>
                <v-spacer />
                {{item.wr_name}}
                <v-btn :to="`/board/${table}`">목록</v-btn>
            </v-toolbar>
        </v-card-title>
        <v-card-text>

            <ssr-renderer>
                <template>
                    <ez-tiptap :editable="false" v-model="item.wr_content" />
                </template>
                <template v-slot:server>
                    <div v-html="item.wr_content">
                    </div>
                </template>
            </ssr-renderer>
            
        </v-card-text>
        <v-card-actions class="justify-center">
            <v-btn 
                v-if="isModify == 'MODIFY'" 
                color="info" 
                :to="`/board/${table}/${item.wr_id}?act=write`"
            >
                <v-icon left>mdi-pencil</v-icon>
                수정
            </v-btn>
            <v-btn
                v-if="access.reply"
                color="secondary"
                :to="`/board/${table}/${item.wr_id}?act=reply`"
            >
                <v-icon>mdi-subdirectory-arrow-right</v-icon>
                답글쓰기
            </v-btn>
        </v-card-actions>
    </v-card>
    <!--div>
        Basic Detail
        <v-btn :to="`/board/${table}`">목록</v-btn>
        <v-btn :to="`/board/${table}?act=write`">쓰기</v-btn>
        <v-btn :to="`/board/${table}/1`">읽기</v-btn>
    </div-->
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import { LV } from '../../../../../util/level';
import SsrRenderer from '../../../../components/util/SsrRenderer.vue';
export default {
  components: { SsrRenderer },
    name : "BasicDetail",
    props : {
        config : Object,
        access : Object,
        id : [String, Number],
    },
    data() {
        return {
            item : null,
        }
    },
    computed : {
        ...mapState({
            user : state => state.user.user,
            initData : state => state.initData,
        }),
        ...mapGetters('user', ['GRANT']),
        table() {
            return this.config.brd_table;
        },
        isModify() {
            if (this.user) {
                // 게시물 작성자 또는 최고 관리자인 경우
                if (this.user.user_id == this.item.user_id || this.GRANT >= LV.SUPER) {
                    return "MODIFY";
                }
            } else if (this.item.user_id == 0) {
                // 비회원일 때
                return "NO_MEMBER";
            }
            return "";
        }
    },
    mounted() {
        this.fetchData();
    },
    syncData() {
        if (this.initData && this.initData.detail) {
            return this.setData(this.initData.detail);
        } else {
            return this.fetchData();
        }
    },
    methods : {
        ...mapMutations(['SET_INITDATA']),
        async fetchData() {
            const headers = {};
            if (this.$ssrContext) {
                headers.token = this.$ssrContext.token;
            }

            const data = await this.$axios.get(
                `/api/board/detail/${this.table}/${this.id}`, 
                { headers }
            );

            if (this.$ssrContext) {
                this.SET_INITDATA({ detail : data });
            }
            
            this.setData(data);
        },
        setData(data) {
            this.item = data;
        }
    }
}
</script>

<style>

</style>