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
                <v-icon left>mdi-plus</v-icon>
                Add New Popup
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
                    block 
                    plain 
                    class="justify-start pa-0"
                    @click="popupView(item)"
                >
                    {{ item.wr_title }}
                </v-btn>
            </template>
            <template #item.wr_2="{ item }">
                {{ $moment(item.wr_2).format('YYYY-MM-DD HH:mm') }}
            </template>
            <template #item.wr_3="{ item }">
                {{ $moment(item.wr_3).format('YYYY-MM-DD HH:mm') }}
            </template>
            <template #item.wr_1="{ item }">{{ item.wr_1 }}일</template>
            <template #item.wr_4="{ item }">
                <div class="d-flex justify-center">
                    <v-checkbox 
                        v-model="item.wr_4" 
                        true-value="1" 
                        false-value="0" 
                        readonly 
                    />
                </div>
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
        <popup-view 
            v-if="curItem" 
            :item="curItem" 
            :table="table" 
            @onClose="popupClose"
        />
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
import DisplayTime from './component/DisplayTime.vue';
import TooltipBtn from '../../../../components/layout/common/TooltipBtn.vue';
import PopupView from './component/PopupView.vue';
export default {
    components : { SearchField, DisplayTime, TooltipBtn, PopupView },
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
            deleteLoading : false,
            curItem : null
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
            return arr;
        },
        table() {
            return this.config.brd_table;
        },
        pageTitle() {
            return this.config.brd_subject + " 관리자";
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
                    text : "팝업 제목", 
                    value : "wr_title", 
                    align : "center", 
                    sortable : false, 
                    searchable : true,
                    cellClass : "text-truncate"
                },
                {
                    text : "시작일시", 
                    value : "wr_2", 
                    align : "center", 
                    sortable : false, 
                    searchable : true,
                    width : "142" 
                },
                {
                    text : "종료일시", 
                    value : "wr_3", 
                    align : "center", 
                    sortable : false, 
                    searchable : true,
                    width : "142" 
                },
                {
                    text : "시간", 
                    value : "wr_1", 
                    align : "center", 
                    sortable : false, 
                    searchable : false,
                    width : "120" 
                },
                {
                    text : "top", 
                    value : "wr_6", 
                    align : "center", 
                    sortable : false, 
                    searchable : false,
                    width : "60" 
                },
                {
                    text : "left", 
                    value : "wr_7", 
                    align : "center", 
                    sortable : false, 
                    searchable : false,
                    width : "60" 
                },
                {
                    text : "width", 
                    value : "wr_8", 
                    align : "center", 
                    sortable : false, 
                    searchable : false,
                    width : "60" 
                },
                {
                    text : "height", 
                    value : "wr_9", 
                    align : "center", 
                    sortable : false, 
                    searchable : false,
                    width : "60" 
                },
                {
                    text : "사용여부", 
                    value : "wr_4", 
                    align : "center", 
                    sortable : false, 
                    searchable : false,
                    width : "100" 
                },
                {
                    text : "CMD", 
                    value : "cmd", 
                    align : "center", 
                    sortable : false, 
                    searchable : false,
                    width : "120" 
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
                '팝업 삭제', 
                { icon : 'mdi-alert' }
            );
            if (confirm) {
                const data = await this.$axios.delete(`/api/board/${this.table}/${item.wr_id}`);

                if (data) {
                    this.$toast.info(`${item.wr_title} 팝업이 삭제되었습니다.`);
                    this.fetchData();
                }
            }
            this.deleteLoading = false;
        },
        popupView(item) {
            this.curItem = item;
        },
        popupClose() {
            this.curItem = null;
        }
    }
}
</script>

<style>

</style>