<template>
    <v-container fluid>
        <v-toolbar class="mt-2">
            <v-toolbar-title>게시판 관리</v-toolbar-title>
            <v-spacer></v-spacer>
            <tooltip-btn label="게시판 추가" icon to="/adm/board/form">
                <v-icon>mdi-plus</v-icon>
            </tooltip-btn>
        </v-toolbar>
        <v-data-table
            :headers="headers"
            :items="items"
            :options.sync="options"
            :server-items-length="totalItems"
            :loading="loading"
            class="elevation-1"
            hide-default-footer
        >
            <template v-slot:item.brd_subject="{ item }">
                <v-btn text :to="`/board/${item.brd_table}`" class="ma-0 pa-0 justify-start">{{ item.brd_subject }}</v-btn>
            </template>
            <template v-slot:item.cmd="{ item }">
                <v-btn icon :to="`/adm/board/form/${item.brd_table}`" color="primary">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn 
                    v-if="isSuper" 
                    icon 
                    @click="removeBoard(item)" 
                    :loading="btnLoading"
                    color="error"
                >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>
        <v-pagination
            v-model="options.page"
            :length="pageCount"
            class="mt-4"
        />
    </v-container>
</template>

<script>
import TooltipBtn from '../../../components/layout/common/TooltipBtn.vue';
import { deepCopy } from '../../../../util/lib';
import qs from 'qs';
import { mapGetters } from 'vuex';
export default {
    components : { TooltipBtn, },
    name : "AdmBoardList",
    title : "게시판 관리",
    data() {
        return {
            headers : [
                {text : "테이블", value : "brd_table", sortable : true},
                {text : "이름", value : "brd_subject", sortable : true},
                {text : "스킨", value : "brd_skin", sortable : true},
                {text : "목록", value : "brd_list_level", sortable : false},
                {text : "읽기", value : "brd_read_level", sortable : false},
                {text : "쓰기", value : "brd_write_level", sortable : false},
                {text : "덧글", value : "brd_comment_level", sortable : false},
                {text : "CMD", value : "cmd", sortable : false},
            ],
            items : [],
            options : {},
            totalItems : 0,
            loading: false,
            btnLoading: false,
            pageItems : [2, 5, 10]
        }
    },
    computed : {
        ...mapGetters('user', ['isSuper']),
        pageCount() {
            return Math.ceil(this.totalItems / this.options.itemsPerPage);
        }
    },
    created() {
        this.options = this.initOptions();
    },
    watch : {
        options: {
            handler() {
                this.getDataFromApi();
            },
            deep : true,
        }
    },
    methods : {
        initOptions() {
            const { query } = this.$route;
            const options = {
                page : Number(query.page) || 1,
                itemsPerPage : Number(query.itemsPerPage) || 10
            };
            return options;
        },
        async getDataFromApi() {
            this.loading = true;

            const payload = deepCopy(this.options);
            const query = qs.stringify(payload);
            const data = await this.$axios.get(`/api/admin/board?${query}`);
            if (data) {
                this.items = data.items;
                this.totalItems = data.totalItems;
            }
            this.loading = false;
        },
        async removeBoard(item) {
            const confirm = await this.$myNotify.confirm(
                `[ ${item.brd_subject} ] 게시판을 삭제 하시겠습니까?`, 
                '게시판 삭제', 
                { icon : 'mdi-alert' }
            );
            if (!confirm) return;
            
            // TODO : 서버에 요청
            this.btnLoading = true;
            const data = await this.$axios.delete(`/api/admin/board/${item.brd_table}`);
            this.btnLoading = false;
            if (data) {
                this.$toast.info(`${item.brd_subject} 게시판 삭제 완료.(파일 : ${data.fileCnt}, 태그 : ${data.tagCnt}, 좋아요 : ${data.goodCnt})`);
                this.getDataFromApi();
            }
        }
    }
}
</script>

<style>

</style>