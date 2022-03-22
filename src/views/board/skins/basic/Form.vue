<template>
    <v-container>
        <v-toolbar>
            <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
            <v-spacer />
            <v-btn @click="save" color="primary" :loading="loading">
                <v-icon left>mdi-pencil</v-icon>
                저장
            </v-btn>
        </v-toolbar>

        <v-form v-if="form" ref="form" v-model="valid" lazy-validation>
            <v-select
                v-if="config.brd_use_category"
                label="카테고리"
                v-model="form.wr_category"
                :items="config.brd_category"
                :rules="[rules.required({ label: '카테고리' })]"
            ></v-select>
            <template v-if="!user">
                <v-text-field
                    label="이름"
                    v-model="form.wr_name"
                    :readonly="!!form.wr_id"
                    :rules="rules.name()"
                />
                <v-text-field
                    label="이메일"
                    v-model="form.wr_email"
                    :rules="rules.email()"
                />
                <input-password
                    label="비밀번호"
                    v-model="form.wr_password"
                    :rules="rules.password()"
                />
                <input-password
                    label="비밀번호 확인"
                    v-model="confimPw"
                    :rules="[rules.matchValue(form.wr_password)]"
                />
            </template>

            <v-text-field
                label="제목"
                v-model="form.wr_title"
                counter="120"
                :rules="[rules.required({ label: '제목' })]"
            />

            <ez-tiptap
                :editable="true"
                v-model="form.wr_content"
                @uploadImage="uploadImage"
            />

            <v-combobox
                label="검색태그"
                v-model="form.wrTags"
                :items="tags"
                multiple
                chips
                deletable-chips
                hide-selected
            />

            <div v-for="(item, i) in config.wr_fields" :key="i">
                <v-text-field
                    v-if="item.title"
                    :label="item.title"
                    v-model="form[`wr_${i + 1}`]"
                    :rules="item.required ? [rules.required({ label: item.title })] : []"
                />
            </div>

            <div v-for="i in config.brd_upload_cnt" class="d-flex">
                <v-file-input
                    :label="fileTitle(i)"
                    v-model="uploadFiles[i - 1]"
                    show-size
                />
            </div>
        </v-form>
    </v-container>
</template>

<script>
import { mapState } from "vuex";
import validateRules from "../../../../../util/validateRules";
import InputPassword from "../../../../components/inputForms/InputPassword.vue";

export default {
    components : { InputPassword },
    name : "BasicForm",
    title() {
        return this.pageTitle;
    },
    props : {
        config : Object,
        access : Object,
        id: [String, Number],
    },
    data() {
        return {
            form : null,
            valid : true,
            confirmPw : "",
            uploadFiles : Array(this.config.brd_upload_cnt).fill(null),
            tags : [], // TODO : 서버에서 태그 목록을 가져온다.
            loading : false,
            upImages : [],
            isWrite : false, // 작성을 했는지 여부
        };
    },
    computed : {
        ...mapState({
            user : (state) => state.user.user,
        }),
        table() {
            return this.config.brd_table;
        },
        pageTitle() {
            return (
                this.config.brd_subject + (this.id ? " 게시물 수정" : " 게시물 작성")
            );
        },
        rules : () => validateRules,
    },
    mounted() {
        this.init();
    },
    destroyed() {
        // 작성을 완료하지 않고 에디터에서 업로드한 이미지가 있으면 삭제를 요청함
        if (!this.isWrite && this.upImages.length) {
            this.$axios.put(`/api/board/imgCancel/${this.table}`, this.upImages);
        }
    },
    methods : {
        async init() {
            if (this.id) {

            } else {
                this.initForm();
            }
        },
        initForm() {
            const form = {
                wr_reply : 0,
                wr_parent : 0, // TODO : 나중에 답글 작성할 때 부모글 아이들 넣음
                user_id : this.user ? this.user.user_id : 0, // 0이면 비회원 글 작성임
                wr_email : this.user ? this.user.user_email : "",
                wr_name : this.user ? this.user.user_name : "",
                wr_password : "",
                wr_category : this.$route.query.ca || this.config.brd_category[0], // TODO : 링크할 때 카테고리 정보를 넘긴다
                wr_title : "",
                wr_content : "",
                wrTags : [],
            };
            for (let i = 1; i <= 10; i++) {
                form[`wr_${i}`] = "";
            }
            this.form = form;
        },
        fileTitle(i) {
            // TODO : 수정 할 때 올렸던 파일 이름 요기서 사용할꺼에요
            return `첨부파일 ${i}`;
        },
        async uploadImage({ file, desc, callback }) {
            const formData = new FormData();
            formData.append("upFile", file);
            formData.append("brd_file_desc", desc);
            const data = await this.$axios.post(`/api/board/imageUpload/${this.table}`, formData);
            this.upImages.push(data);
            callback(`/upload/${this.table}/${data.brd_file_src}`);
        },
        async save() {
            this.$refs.form.validate();
            await this.$nextTick();
            if (!this.valid) return;
            this.loading = true;

            const formData = new FormData();
            const keys = Object.keys(this.form);

            for (const key of keys) {
                if (typeof this.form[key] === "object") {
                    formData.append(key, JSON.stringify(this.form[key]));
                } else {
                    formData.append(key, this.form[key]);
                }
            }

            let cnt = 0;
            for (let i = 0; i < this.config.brd_upload_cnt; i++) {
                if (this.uploadFiles[i] != null) {
                    formData.append(`upFiles[${cnt}`, this.uploadFiles[i]);
                    cnt++;
                }
            }

            let wr_id;
            if (this.id) {
                wr_id = await this.update(formData);
            } else {
                wr_id = await this.insert(formData);
            }

            // 글 작성이 잘 끝났으면
            if (wr_id) {
                this.isWrite = true;
            }

            this.loading = false;
        },
        async insert(formData) {},
        async update(formData) {},
    }
}
</script>

<style>

</style>