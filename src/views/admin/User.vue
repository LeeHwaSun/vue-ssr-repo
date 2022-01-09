<template>
    <v-container fluid>
        <v-toolbar>
            <v-toolbar-title>회원관리</v-toolbar-title>
            <search-field :items="searchItems" :options.sync="options" />
            <v-spacer></v-spacer>
            <v-sheet width="60" class="mt-2">
                <v-select 
                    :items="pageItems"
                    v-model="options.itemsPerPage"
                    label="목록 수"
                    hide-details
                    dense
                />
            </v-sheet>
            <v-sheet width="100" class="mt-2 ml-4">
                <v-select
                    :items="typeItems"
                    v-model="options.type"
                    label="회원유형"
                    hide-details
                    @change="options.page = 1"
                    dense
                />
            </v-sheet>
        </v-toolbar>
        <v-data-table
            :headers="headers"
            :items="items"
            :options.sync="options"
            :server-items-length="totalItems"
            :loading="loading"
            hide-default-footer
        >
            <template v-slot:item.user_id="{ item }">
                <display-id :user="item" />
            </template>
            <template v-slot:item.user_name="{ item }">
                <display-name :user="item" />
            </template>
            <template v-slot:item.user_level="{ item }">
                <display-level :user="item" />
            </template>
            <template v-slot:item.user_create_at="{ item }">
                <display-time :time="item.user_create_at"/>
            </template>
            <template v-slot:item.user_update_at="{ item }">
                <display-time :time="item.user_update_at"/>
            </template>
            <template v-slot:item.user_leave_at="{ item }">
                <display-time :time="item.user_leave_at"/>
            </template>
            <template v-slot:item.cmd="{item}">
                <tooltip-btn icon label="Modify" @click="openDialog(item)">
                    <v-icon>mdi-pencil</v-icon>
                </tooltip-btn>
            </template>
        </v-data-table>
        <v-pagination
            v-model="options.page"
            :length="pageCount"
            class="mt-4"
        />

        <my-dialog 
            label="회원 수정" 
            ref="dialog" 
            width="500" 
            persistent 
            @onClose="closeDialog"
        >
            <user-update-form 
                v-if="curUser" 
                :user="curUser" 
                :isLoading="loading"
                :admMode="true"
                @onSave="saveUser"
                @onLeave="leaveUser"
                @onRestore="restoreUser"
            />
        </my-dialog>
    </v-container>
</template>

<script>
import qs from 'qs';
import SearchField from '../../components/layout/common/SearchField.vue';
import TooltipBtn from '../../components/layout/common/TooltipBtn.vue';
import MyDialog from '../../components/layout/common/MyDialog.vue';
import UserUpdateForm from '../../components/auth/UserUpdateForm.vue';
import { deepCopy } from '../../../util/lib';
import DisplayId from '../../components/layout/user/DisplayId.vue';
import DisplayName from '../../components/layout/user/DisplayName.vue';
import DisplayLevel from '../../components/layout/user/DisplayLevel.vue';
import DisplayTime from '../../components/layout/user/DisplayTime.vue';
import axios from 'axios';
export default {
    components : { 
        SearchField, 
        TooltipBtn, 
        MyDialog, 
        UserUpdateForm, 
        DisplayId, 
        DisplayName,
        DisplayLevel,
        DisplayTime,
    },
    name : "AdmUser",
    title : "회원관리",
    data() {
        return {
            headersOrigin : [
                {
                    text : "아이디",
                    value : "user_id",
                    align : "start",
                    searchable : true,
                },
                {
                    text : "이름",
                    value : "user_name",
                    align : "start",
                    searchable : true,
                },
                {
                    text : "이메일",
                    value : "user_email",
                    align : "start",
                    searchable : true,
                },
                {
                    text : "연락처",
                    value : "user_phone",
                    align : "start",
                    searchable : true,
                },
                {
                    text : "레벨",
                    value : "user_level",
                    align : "start",
                    searchable : true,
                },
                {
                    text : "가입일",
                    value : "user_create_at",
                    align : "start",
                },
                {
                    text : "수정일",
                    value : "user_update_at",
                    align : "start",
                },
                {
                    text : "탈퇴일",
                    value : "user_leave_at",
                    align : "start",
                },
                {
                    text : "CMD",
                    value : "cmd",
                    sortable : false,
                }
            ],
            items : [],
            options : {},
            totalItems : 0,
            loading : false,
            pageReady : false,
            pageRouting : false,
            axiosSource : null,
            curUser : null,
            typeItems : [
                { text : "전체", value : "all" },
                { text : "회원", value : "user" },
                { text : "탈퇴회원", value : "leave" },
            ],
            pageItems : [2, 5, 10, 20, 50, 100],
        }
    },
    computed : {
        searchItems() {
            return this.headers.filter((item) => item.searchable);
        },
        headers() {
            if (this.options.type == 'user') {
                return this.headersOrigin.filter( (item) => item.value != 'user_leave_at' );
            } else if (this.options.type == 'leave') {
                return this.headersOrigin.filter( (item) => item.value != 'user_update_at' );
            } else {
                return this.headersOrigin.filter( (item) => item.value != '' );
            }
        },
        pageCount() {
            return Math.ceil(this.totalItems / this.options.itemsPerPage);
        }
    },
    watch : {
        options : {
            handler () {
                this.fetchData();
            },
            deep : true,
        },
    },
    created() {
        this.options = this.initOptions();
    },
    mounted() {
        window.addEventListener('popstate', this.routeChange);
    },
    destroyed() {
        window.removeEventListener('popstate', this.routeChange);
    },
    methods : {
        initOptions() {
            const { query } = this.$route;
            const options = {
                page : Number(query.page) || 1,
                itemsPerPage : Number(query.itemsPerPage) || 10,
                sortBy : [query.sortBy || "user_create_at"],
                sortDesc : [query.sortDesc ? query.sortDesc == "true" : false],
                stf : [query.stf || ""],
                stx : [query.stx || ""],
                stc : [query.stc || ""],
                type : query.type || "all"
            }
            return options;
        },
        routeChange() {
            this.pageRouting = true;
            this.options = this.initOptions();  
        },
        async fetchData() {
            console.log("fetchData call...");
            if (this.axiosSource) {
                this.axiosSource.cancel("fetchData 취소");
            }
            this.loading = true;
            const payload = deepCopy(this.options);
            // 회원 / 탈퇴회원
            if (payload.type == 'user') {
                payload.stf.push('user_leave_at');
                payload.stx.push('n');
                payload.stc.push('null');
            } else if (this.options.type == 'leave') {
                payload.stf.push('user_leave_at');
                payload.stx.push('n');
                payload.stc.push('not');
            }
            delete payload.type;

            const query = qs.stringify(payload);
            this.axiosSource = axios.CancelToken.source();
            try {
                const data = await this.$axios.get(`/api/user?${query}`, {
                    cancelToken : this.axiosSource.token,
                });
                this.pushState();
                this.loading = false;
                this.pageReady = true;
                this.pageRouting = false;
                if (data) {
                    this.items = data.items;
                    this.totalItems = data.totalItems;
                }
            } catch (e) {
                console.log("request cancel >", e.message);
            }
        },
        pushState() {
            console.log("pageRouting", this.pageRouting);
            if (!this.pageRouting) {
                const opt = {
                    page : this.options.page,
                    itemsPerPage : this.options.itemPerPage,
                    sortBy : this.options.sortBy[0],
                    sortDesc : this.options.sortDesc[0],
                    stf : this.options.stf[0] || undefined,
                    stx : this.options.stx[0] || undefined,
                    stc : this.options.stc[0] || undefined,
                    type : this.options.type,
                };
                const query = qs.stringify(opt);
                if (this.pageReady) {
                    history.pushState(null, null, `${this.$route.path}?${query}`);
                } else {
                    history.replaceState(null, null, `${this.$route.path}?${query}`);
                }
            }
        },
        openDialog(user) {
            this.curUser = user;
            this.$refs.dialog.open();
        },
        closeDialog() {
            this.curUser = null;
        },
        async saveUser(form) {
            // axios 요청
            this.loading = true;
            const data = await this.$axios.patch(`/api/user`, form);
            this.loading = false;
            if (data) {
                console.log(data);
                const idx = this.items.indexOf(this.curUser);
                this.items.splice(idx, 1, data);
                this.$toast.info(`${data.user_name} 정보 수정 하였습니다.`);
                this.$refs.dialog.close();
            }
        },
        async leaveUser() {
            const result = await this.$myNotify.confirm(`${this.curUser.user_name} 회원 탈퇴 처리하시겠습니까?`, '회원탈퇴 처리', {
                icon : 'mdi-alert',
            });

            if (!result) return;

            this.loading = true;

            const form = {
                user_id : this.curUser.user_id,
                user_leave_at : this.$moment().format('LT')
            }
            const data = await this.$axios.patch(`/api/user`, form);
            if (data) {
                this.$toast.info(`${this.curUser.user_name}님 탈퇴 처리 하였습니다.`);
                this.$refs.dialog.close();
                this.pageRouting = true;
                this.fetchData();
            }
        },
        async restoreUser() {
            const result = await this.$myNotify.confirm(`${this.curUser.user_name} 회원 복원 처리하시겠습니까?`, '회원탈퇴 처리', {
                icon : 'mdi-alert',
            });

            if (!result) return;

            this.loading = true;

            const form = {
                user_id : this.curUser.user_id,
                user_leave_at : null
            }
            const data = await this.$axios.patch(`/api/user`, form);
            if (data) {
                this.$toast.info(`${this.curUser.user_name}님 복원 처리 하였습니다.`);
                this.$refs.dialog.close();
                this.pageRouting = true;
                this.fetchData();
            }
        }
    }
}
</script>

<style>

</style>