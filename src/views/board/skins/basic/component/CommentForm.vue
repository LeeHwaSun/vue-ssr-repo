<template>
    <div v-if="user">
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-textarea
                ref="textarea"
                outlined
                v-model.trim="form.wr_content" 
                :label="label" 
                :rules="[rules.required({ label })]"
                rows="2"
                auto-grow
                @keyup.ctrl.enter="save"
                @blur="resetValid"
            >
                <template v-slot:append-outer>
                    <v-btn v-if="item || wr_parent" icon @click="$emit('onClose')">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-btn icon @click="save">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </template>
            </v-textarea>
        </v-form>
    </div>
    <div v-else>
        로그인 후 댓글을 작성할 수 있습니다.
        <v-btn :to="`/login?nextUrl=${$route.fullPath}`">로그인</v-btn>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { deepCopy } from '../../../../../../util/lib';
import validateRules from '../../../../../../util/validateRules';
export default {
    name: "CommentForm",
    props: {
        table : {
            type : String,
            required : true
        },
        wr_reply : {
            type : Number,
            required : true
        },
        wr_parent : {
            type : Number,
            default : 0
        },
        item : {
            type : Object,
            default : null
        }
    },
    data() {
        return {
           valid : true,
           form : null, 
        }
    },
    computed: {
        ...mapState({
            user : state => state.user.user,
        }),
        rules : () => validateRules,
        label() {
            if (this.item) {
                return "댓글 수정";
            } else {
                return this.wr_parent == 0 ? "댓글 작성" : "답글 달기";
            }
        }
    },
    created() {
        this.initForm();
    },
    methods: {
        initForm() {
            if (this.user) {
                if (this.item) { // 수정
                    this.form = deepCopy(this.item);
                } else { // 신규
                    const form = {
                        wr_reply : this.wr_reply,
                        wr_parent : this.wr_parent,
                        user_id : this.user.user_id,
                        wr_email : this.user.user_email,
                        wr_name : this.user.user_name,
                        wr_content : "",
                    };
                    this.form = form;
                }
            }
        },
        async save() {
            this.$refs.form.validate();
            await this.$nextTick();
            if (!this.valid) return;
            let data;
            if (this.item) { // 수정
                data = await this.$axios.put(`/api/board/write/${this.table}/${this.item.wr_id}`, this.form);
            } else { // 신규 && 대댓글
                data = await this.$axios.post(`/api/board/write/${this.table}`, this.form);
            }
            if (data) {
                if (!this.item) this.$refs.textarea.blur();
                this.$emit('onUpdate', data);
                this.initForm();
                this.$refs.form.resetValidation();
                this.$emit('onClose');
            }
        },
        resetValid() {
            this.$refs.form.resetValidation();
        }
    }
}
</script>

<style>

</style>