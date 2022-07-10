<template>
    <v-container fluid>
        <v-toolbar>
            <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
            <v-spacer />
            <v-btn @click="save" color="primary" :loading="loading">
                <v-icon left>mdi-pencil</v-icon>
                저장
            </v-btn>
        </v-toolbar>

        <v-form v-if="form" ref="form" v-model="valid" lazy-validation>

            <input-duplicate-check 
                ref="id"
                label="ID"
                v-model="form.wr_1"
                :rules="[rules.required({ label: 'ID' }), rules.alphaNum()]"
                :cbCheck="checkId"
                :origin="id ? form.wr_1 : ''"
                :readonly="!!id"
            />

            <v-select 
                label="컨텐츠 스킨"
                v-model="form.wr_2"
                :items="skins"
            />

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
        </v-form>
    </v-container>
</template>

<script>
import { mapState } from "vuex";
import validateRules from "../../../../../util/validateRules";
import InputDuplicateCheck from '../../../../components/inputForms/InputDuplicateCheck.vue';

export default {
    components : { InputDuplicateCheck },
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
            parentItem : null, // 부모글
            skins : [],
        };
    },
    computed : {
        ...mapState({
            user : (state) => state.user.user,
        }),
        table() {
            return this.config.brd_table;
        },
        pid() {
            if (this.$route.query.act == 'reply') {
                return this.id;
            } else {
                return 0;
            }
        },
        pageTitle() {
            let title = '';
            if (this.pid) {
                title = ' 게시물 답글 작성';
            } else {
                if (this.id) {
                    title = ' 게시물 수정';
                } else {
                    title = ' 게시물 작성';
                }
            }
            return (
                this.config.brd_subject + title
            );
        },
        rules : () => validateRules,
    },
    mounted() {
        this.init();
        this.fetchSkinList();
    },
    destroyed() {
        // 작성을 완료하지 않고 에디터에서 업로드한 이미지가 있으면 삭제를 요청함
        if (!this.isWrite && this.upImages.length) {
            this.$axios.put(`/api/board/imgCancel/${this.table}`, this.upImages);
        }
    },
    methods : {
        async checkId() {
            const data = await this.$axios.get(`/api/contents/duplicateCheck?wr_1=${this.form.wr_1}`)
            return data;
        },
        async fetchSkinList() {
            const data = await this.$axios.get('/api/contents/skinList');
            this.skins = data;
        },
        async init() {
            if (this.id) {
                const data = await this.$axios.get(`/api/board/detail/${this.table}/${this.id}`);
                if (this.pid) { // 부모글의 답글
                    this.initForm();
                    this.form.wr_category = data.wr_category;
                    this.parentItem = data;
                } else { // 수정
                    this.form = data;
                }
                this.form.wr_password = "";
            } else { // 새글
                this.initForm();
            }
        },
        initForm() {
            const form = {
                wr_reply : 0,
                wr_parent : this.pid, // TODO : 나중에 답글 작성할 때 부모글 아이들 넣음
                user_id : this.user ? this.user.user_id : 0, // 0이면 비회원 글 작성임
                wr_email : this.user ? this.user.user_email : "",
                wr_name : this.user ? this.user.user_name : "",
                wr_password : "",
                wr_category : this.$route.query.ca || this.config.brd_category[0] || "", // TODO : 링크할 때 카테고리 정보를 넘긴다
                wr_title : "",
                wr_content : "",
                wrTags : [],
                //wrImgs : [],
                //wrFiles : [],
            };
            for (let i = 1; i <= 10; i++) {
                form[`wr_${i}`] = "";
            }
            form.wr_2 = 'basic';
            this.form = form;
        },
        fileTitle(i) {
            // TODO : 수정 할 때 올렸던 파일 이름 요기서 사용할꺼에요
            if (this.form.wrFiles) {
                const wrFile = this.form.wrFiles[i - 1];
                return wrFile && !wrFile.remove ? wrFile.brd_file_name : `첨부파일 ${i}`;
            } else {
                return `첨부파일 ${i}`;   
            }
            
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
            if (!this.$refs.id.validate()) return;
            
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

            // 작성시 토큰이 있는 경우 토큰을 삽입
            if (this.$route.query.token) {
                formData.append('token', this.$route.query.token);
            }

            let cnt = 0;
            for (let i = 0; i < this.config.brd_upload_cnt; i++) {
                if (this.uploadFiles[i] != null) {
                    formData.append(`upFiles[${cnt}`, this.uploadFiles[i]);
                    cnt++;
                }
            }

            // 에디터에서 업로드한 이미지
            formData.append('upImages', JSON.stringify(this.upImages));

            let wr_id;
            if (this.id && !this.pid) {
                wr_id = await this.update(formData);
            } else {
                wr_id = await this.insert(formData);
            }

            // 글 작성이 잘 끝났으면
            if (wr_id) {
                this.isWrite = true;
                this.$router.push(`/board/${this.table}`);
            }

            this.loading = false;
        },
        async insert(formData) {
            const data = await this.$axios.post(`/api/board/write/${this.table}`, formData);
            return data.wr_id;
        },
        async update(formData) {
            const data = await this.$axios.put(`/api/board/write/${this.table}/${this.id}`, formData);
            return data.wr_id;
        },
    }
}
</script>

<style>

</style>