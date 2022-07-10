<template>
    <v-container fluid>
        <v-toolbar>
            <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
            <v-sheet v-if="config.brd_use_category == 1" width="150" class="ml-4" color="transparent">
                <category-select :options.sync="options" />
            </v-sheet>
            <search-field :items="searchItems" :options.sync="options" class="ml-4"/>
            <v-spacer />
            <v-sheet width="60" class="mt-2 mr-2" color="transparent">
                <v-select 
                    :items="pageItems"
                    v-model="options.itemsPerPage"
                    label="목록 수"
                    hide-details
                    dense
                />
            </v-sheet>
            <v-btn :to="`/board/${table}?act=write`" color="primary">
                <v-icon left>mdi-pencil</v-icon>
                새글 작성
            </v-btn>
        </v-toolbar>
        <v-data-table
            :headers="headers"
            :items="items"
            :options.sync="options"
            :server-items-length="totalItems"
            :loading="loading"
            hide-default-footer
            class="fixedTable"
        >
            <template #item.no="{ index }">
                {{ getNo(index) }}
            </template>
            <template #item.wr_title="{ item }">
                <v-btn 
                    :to="`/contents/${ item.wr_1 }`" 
                    block 
                    plain 
                    class="justify-start pa-0"
                >
                    {{ item.wr_title }}
                </v-btn>
            </template>
            <template #item.cmd="{ item }">
                <tooltip-btn 
                    label="Modify" 
                    icon 
                    color="primary" 
                    :to="`/board/${table}/${item.wr_id}?act=write`"
                >
                    <v-icon>mdi-pencil</v-icon>
                </tooltip-btn>
                <tooltip-btn 
                    v-if="isSuper"
                    label="Delete" 
                    icon 
                    color="red" 
                    :loading="deleteLoading"
                    @click="deleteItem(item)"
                >
                    <v-icon>mdi-delete</v-icon>
                </tooltip-btn>
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
import qs from 'qs';
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import { deepCopy } from '../../../../../util/lib';
import SearchField from '../../../../components/layout/common/SearchField.vue';
import CategorySelect from './component/CategorySelect.vue';
import DisplayTime from './component/DisplayTime.vue';
import TooltipBtn from '../../../../components/layout/common/TooltipBtn.vue';
export default {
    components : { SearchField, CategorySelect, DisplayTime, TooltipBtn },
    name : "BasicList",
    props : {
        config : Object,
        access : Object,
    },
    title() {
        return this.pageTitle;
    },
    data() {
        return {
            loading : false,
            options : {},
            pageReady : false,
            pageRouting : false,
            pageItems : [2, 5, 10, 20, 50, 100],
            deleteLoading: false,
        }
    },
    computed : {
        ...mapState({
            items : state => state.board.list,
            totalItems : state => state.board.totalItems,
        }),
        ...mapGetters('user', ['isSuper']),
        searchItems() {
            const arr = this.headers.filter((item) => item.searchable);
            arr.push({
                text : "내용",
                value : "wr_content"
            });
            return arr;
        },
        table() {
            return this.config.brd_table;
        },
        pageTitle() {
            return this.config.brd_subject + " 게시판";
        },
        headers() {
            const headers = [
                { 
                    text : "No", 
                    value : "no", 
                    align : "center", 
                    sortable : false, 
                    searchable : false,
                    width : "90"
                },
                {
                    text : "ID", 
                    value : "wr_1", 
                    align : "start", 
                    sortable : true, 
                    searchable : true,
                    width: "160"
                },
                {
                    text : "제목", 
                    value : "wr_title", 
                    align : "start", 
                    sortable : false, 
                    searchable : true,
                    cellClass : "text-truncate",
                },
                {
                    text : "스킨", 
                    value : "wr_2", 
                    align : "center", 
                    sortable : true, 
                    searchable : true,
                    width: "160",
                },
                {
                    text : "CMD", 
                    value : "cmd", 
                    align : "center", 
                    sortable : false, 
                    searchable : false,
                    width : "160" 
                }
            ];
            return headers;
        },
        pageCount() {
            return Math.ceil(this.totalItems / this.options.itemsPerPage);
        }
    },
    watch : {
        options: {
            handler() {
                this.fetchData();
            },
            deep : true,
        },
        table() {
            this.fetchData();
        }
    },
    serverPrefetch() {
        return this.fetchData();
    },
    created() {
        this.options = this.initOptions();
    },
    mounted() {
        window.addEventListener('popstate', this.routeChange);
    },
    destroyed() {
        window.removeEventListener('popstate', this.routeChange);
        this.SET_LIST({items: [], totalItems: 0});
    },
    methods : {
        ...mapMutations('board', ['SET_LIST']),
        ...mapActions('board', ['getBoardList']),
        initOptions() {
            const { query } = this.$route;
            const options = {
                page : Number(query.page) || 1,
                itemsPerPage : Number(query.itemsPerPage) || 10,
                stf : [query.stf || "", "wr_category"],
                stx : [query.stx || "", ""],
                stc : [query.stc || "", "eq"],
            }
            return options;
        },
        pushState() {
            if (!this.pageRouting) {
                const opt = {
                    page : this.options.page,
                    itemsPerPage : this.options.itemPerPage,
                    stf : this.options.stf[0] || undefined,
                    stx : this.options.stx[0] || undefined,
                    stc : this.options.stc[0] || undefined,
                    ca : this.options.stf[1] || undefined,
                };
                const query = qs.stringify(opt);
                if (this.pageReady) {
                    history.pushState(null, null, `${this.$route.path}?${query}`);
                } else {
                    history.replaceState(null, null, `${this.$route.path}?${query}`);
                }
            }
        },
        getPayload() {
            const payload = deepCopy(this.options);
            // 본글인 목록 검색
            payload.stf.push("wr_reply");
            payload.stc.push("eq");
            payload.stx.push("0");

            // TODO : 카테고리 별로 검색

            return payload;
        },
        routeChange() {
            this.pageRouting = true;
            this.options = this.initOptions();  
        },
        async fetchData() {
            const payload = this.getPayload();
            const query = qs.stringify(payload);
            const headers = {};
            if (this.$ssrContext) {
                headers.token = this.$ssrContext.token;
            }

            await this.getBoardList({ vm : this, query, headers });
        },
        getNo(index) {
            const { page, itemsPerPage } = this.options;
            const { totalItems } = this;
            return totalItems - ( (page - 1) * itemsPerPage ) - index;
        },
        async deleteItem(item) {
            this.deleteLoading = true;
            const confirm = await this.$myNotify.confirm(
                `${item.wr_title}을(를) 삭제하시겠습니까?`, 
                '컨텐츠 삭제', 
                { icon : 'mdi-alert' }
            );
            if (confirm) {
                const data = await this.$axios.delete(`/api/board/${this.table}/${item.wr_id}`);

                if (data) {
                    this.$toast.info(`${item.wr_title} 컨텐츠가 삭제되었습니다.`);
                    this.fetchData();
                }
            }
            this.deleteLoading = false;
        },
    }
}
</script>

<style>

</style>