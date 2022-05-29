<template>
    <div>
        <v-divider />
        <v-list-item class="align-start">
            <div style="position:relative; top:22px; left:-4px;">
                <v-icon v-if="item.wr_dep > 0" :style="{
                    'padding-left' : `${(item.wr_dep - 1) * 32 + 8}px`,
                }">
                    mdi-subdirectory-arrow-right    
                </v-icon>
            </div>
            <v-list-item-content>
                <v-subheader class="pl-0">
                    <v-avatar size="28" color="primary" class="white--text">{{ item.wr_name[0] }}</v-avatar>
                    <div class="ml-2 font-weight-bold">
                        {{ item.wr_name }} | 
                        <i>{{ item.wr_email }}</i>
                    </div>
                    <v-spacer />
                    <v-icon small class="mr-2">mdi-clock-outline</v-icon>
                    <display-time :time="item.wr_create_at" />
                    <display-good 
                        :item="item"
                        :table="table"
                        :label="{ good : '좋아요', bad : '싫어요' }"
                        :icon="{ good : 'mdi-thumb-up', bad : 'mdi-thumb-down' }"
                        good-only
                        class="ml-4"
                        :btnProps="{ plain: true }"
                    />
                </v-subheader>
                <comment-form
                    v-if="isModify"
                    :item="item"
                    :table="table"
                    :wr_reply="item.wr_reply"
                    :wr_parent="item.wr_parent"
                    @onClose="isModify = false"
                    @onUpdate="modifyComment"
                />
                <div v-else class="text-pre" :style="{
                    'font-size' : '1.25em',
                    'line-height' : '1.5em',
                }">{{ item.wr_content }}</div>
                <div class="d-flex">
                    <board-button 
                        v-if="access.comment && !!user"
                        label="답글쓰기" 
                        icon="mdi-pencil-outline" 
                        plain 
                        color="primary" 
                        @click="isComment = true"
                    />
                    <v-spacer />
                    <board-button 
                        v-if="modifyGrant" 
                        label="수정" 
                        icon="mdi-pencil-outline" 
                        plain 
                        color="secondary" 
                        @click="isModify = !isModify"
                    />
                    <board-button 
                        v-if="modifyGrant" 
                        label="삭제" 
                        icon="mdi-delete-outline" 
                        plain 
                        color="red"
                        @click="removeComment"
                    />
                </div>
                <comment-form 
                    v-if="isComment" 
                    :wr_parent="item.wr_id" 
                    :wr_reply="item.wr_reply" 
                    :table="table"
                    @onClose="isComment = false"
                    @onUpdate="reComment"
                />
            </v-list-item-content>
        </v-list-item>
    </div>
</template>

<script>
import DisplayTime from './DisplayTime.vue';
import BoardButton from './BoardButton.vue';
import CommentForm from './CommentForm.vue';
import DisplayGood from './DisplayGood.vue';
import { mapGetters, mapState } from 'vuex';
import { LV } from '../../../../../../util/level';
export default {
    components: { DisplayTime, BoardButton, CommentForm, DisplayGood },
    name: "CommentItem",
    props: {
        item: {
            type: Object,
            required: true
        },
        table: {
            type: String,
            required: true
        },
        idx: {
            type: Number,
            required: true
        },
        access : {
            type : Object,
            required : true
        }
    },
    data() {
        return {
            isComment : false,
            isModify : false,
        }
    },
    computed: {
        ...mapState('user', ['user']),
        ...mapGetters('user', ['GRANT']),
        modifyGrant() {
            if (this.user) {
                if (this.user.user_id == this.item.user_id || this.GRANT >= LV.SUPER) {
                    return true;
                }
            }
            return false;
        }
    },
    methods: {
        reComment(child) {
            this.$emit('onReComment', this.item, child);
        },
        modifyComment(item) {
            this.$emit('onUpdate', item);
        },
        async removeComment() {
            const confirm = await this.$myNotify.confirm(
                '댓글을 삭제하시겠습니까?', 
                '댓글 삭제', 
                { icon : 'mdi-alert' }
            );
            if (!confirm) return;
            const data = await this.$axios.delete(`/api/board/${this.table}/${this.item.wr_id}`);
            if (data) {
                this.$toast.info(`${data}개의 댓글을 삭제 하였습니다.`);
                this.$emit('onRemove', this.item, data);
            };
        }
    }
}
</script>

<style>

</style>