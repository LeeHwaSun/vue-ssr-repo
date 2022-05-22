<template>
    <div>
        <v-divider />
        <v-list-item>
            <div>
                <v-icon v-if="item.wr_dep > 0" :style="{
                    'padding-left' : `${(item.wr_dep - 1) * 32 + 8}px`}">
                    mdi-subdirectory-arrow-right    
                </v-icon>
            </div>
            <v-list-item-content>
                <v-subheader>
                    <v-avatar size="28" color="primary">{{ item.wr_name[0] }}</v-avatar>
                    <div class="ml-2">
                        {{ item.wr_name }} | 
                        <i>{{ item.wr_email }}</i>
                    </div>
                    <v-spacer />
                    <v-icon small class="mr-2">mdi-clock-outline</v-icon>
                    <display-time :time="item.wr_create_at" />
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
                <div v-else class="text-pre">{{ item.wr_content }}</div>
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
import { mapGetters, mapState } from 'vuex';
import { LV } from '../../../../../../util/level';
export default {
    components: { DisplayTime, BoardButton, CommentForm },
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
        }
    }
}
</script>

<style>

</style>