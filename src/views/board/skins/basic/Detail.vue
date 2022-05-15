<template>
    <v-container fluid>
        <v-card flat v-if="item">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>{{ item.wr_title }}</v-toolbar-title>
                    <v-spacer />
                    <v-subheader class="text-no-wrap">
                        <v-icon class="mx-2" small>mdi-account</v-icon>
                        {{ item.wr_name }}
                        <v-icon class="mx-2" small>mdi-clock-outline</v-icon>
                        <i><display-time :time="item.wr_create_at" /></i>
                        <v-icon class="mx-2" small>mdi-eye</v-icon>
                        {{ item.wr_view }}
                    </v-subheader>
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
            <v-card-text>
                <!-- 태그 목록 -->
                <tag-view :tags="item.wrTags" />
            </v-card-text>
            <v-card-text>
                <display-good 
                    :table="table" 
                    :item="item" 
                    class="d-flex justify-center"
                    :icon="{ good : 'mdi-thumb-up', bad : 'mdi-thumb-down' }"
                    :label="{ good : 'LIKE', bad : 'UNLIKE' }"
                />
            </v-card-text>
            <v-card-text>
                <file-download :table="table" :item="item" :access="access" />
            </v-card-text>
            <v-card-actions>
                <v-col cols="4" class="text-no-wrap">
                    <!-- 수정 -->
                    <board-button 
                        v-if="isModify == 'MODIFY'" 
                        color="info" 
                        :to="`/board/${table}/${item.wr_id}?act=write`"
                        label="수정"
                        icon="mdi-pencil"
                    />
                    <!-- TODO : 비회원 게시물 수정 버튼 -->
                    <modify-button 
                        v-if="isModify == 'NO_MEMBER'" 
                        color="info"
                        :table="table"
                        :wr_id="item.wr_id"
                        label="수정"
                        @onValid="modifyItem"
                    >
                        <v-icon left>mdi-pencil</v-icon>
                        수정
                    </modify-button>
                    <!-- // 수정 -->
                    <!-- 삭제 -->
                    <board-button
                        v-if="isModify == 'MODIFY'"
                        color="error"
                        class="ml-2"
                        @click="deleteItem"
                        label="삭제"
                        icon="mdi-delete"
                        :loading="deleteLoading"
                    />
                    <!-- TODO : 비회원 게시물 삭제 버튼 -->
                    <!-- // 삭제 -->
                </v-col>
                <v-col cols="4" class="text-center text-no-wrap">
                    <board-button 
                        :to="`/board/${table}`" 
                        color="accent" 
                        label="목록" 
                        icon="mdi-menu" 
                    />
                </v-col>
                <v-col cols="4" class="text-right text-no-wrap">
                    <board-button
                        v-if="access.reply"
                        color="secondary"
                        :to="`/board/${table}/${item.wr_id}?act=reply`"
                        label="답글쓰기"
                        icon="mdi-subdirectory-arrow-right"
                    />
                    <board-button
                        v-if="access.write"
                        color="primary"
                        class="ml-2"
                        :to="`/board/${table}?act=write`"
                        label="글쓰기"
                        icon="mdi-pencil"
                    />
                </v-col>
            </v-card-actions>
            <comment-list :id="item.wr_id" :table="table" :access="access" />
        </v-card>
    </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { LV } from '../../../../../util/level';
import SsrRenderer from '../../../../components/util/SsrRenderer.vue';
import DisplayTime from './component/DisplayTime.vue';
import TagView from './component/TagView.vue';
import FileDownload from './component/FileDownload.vue';
import BoardButton from './component/BoardButton.vue';
import DisplayGood from './component/DisplayGood.vue';
import ModifyButton from './component/ModifyButton.vue';
import CommentList from './component/CommentList.vue';
export default {
  components: { 
      SsrRenderer, 
      DisplayTime, 
      TagView, 
      FileDownload, 
      BoardButton, 
      DisplayGood,
      ModifyButton,
      CommentList,
    },
    name : "BasicDetail",
    props : {
        config : Object,
        access : Object,
        id : [String, Number],
    },
    data() {
        return {
            deleteLoading : false,
        }
    },
    computed : {
        ...mapState({
            user : state => state.user.user,
            item : state => state.board.detail,
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
    watch : {
        id() {
            this.fetchData();
        }
    },
    serverPrefetch() {
        return this.fetchData();
    },
    mounted() {
        if (!this.item) {
            this.fetchData();
        }
        console.log(this.$vuetify);
    },
    destroyed() {
        this.SET_DETAIL(null);
    },
    methods : {
        ...mapMutations('board', ['SET_DETAIL']),
        ...mapActions('board', ['getBoardDetail']),
        async fetchData() {
            const headers = {};
            if (this.$ssrContext) {
                headers.token = this.$ssrContext.token;
            }

            await this.getBoardDetail({ table : this.table, id : this.id, headers });
        },
        async deleteItem(token) {
            this.deleteLoading = true;
            const confirm = await this.$myNotify.confirm(
                '게시물을 삭제하시겠습니까?', 
                '게시물 삭제', 
                { icon : 'mdi-alert' }
            );
            if (confirm) {
                const data = await this.$axios.delete(`/api/board/${this.table}/${this.item.wr_id}?token=${token}`);
            }
            this.deleteLoading = false;
        },
        modifyItem(token) {
            // /board/${table}/${item.wr_id}?act=write
            this.$router.push(
                `/board/${this.table}/${this.item.wr_id}?act=write&token=${token}`
            );
        }
    }
}
</script>

<style>

</style>