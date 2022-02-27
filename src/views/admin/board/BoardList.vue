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
        >
            <template v-slot:item.cmd="{ item }">
                <tooltip-btn label="Modify" icon :to="`/adm/board/form/${item.brd_table}`">
                    <v-icon>mdi-pencil</v-icon>
                </tooltip-btn>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import TooltipBtn from '../../../components/layout/common/TooltipBtn.vue';
import { deepCopy } from '../../../../util/lib';
import qs from 'qs';
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
        }
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
        }
    }
}
</script>

<style>

</style>