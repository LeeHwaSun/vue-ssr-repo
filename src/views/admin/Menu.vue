<template>
    <v-container>
        <v-toolbar>
            <v-toolbar-title>메뉴관리</v-toolbar-title>
            <v-spacer></v-spacer>
            <tooltip-btn label="Add Menu" icon small fab color="secondary" @click="addMenu">
                <v-icon>mdi-plus</v-icon>
            </tooltip-btn>
            <tooltip-btn label="Save Menu" icon small fab color="primary" @click="updateMenu">
                <v-icon>mdi-content-save</v-icon>
            </tooltip-btn>
            <tooltip-btn label="Reset" icon small fab color="error" @click="refresh">
                <v-icon>mdi-refresh</v-icon>
            </tooltip-btn>
        </v-toolbar>
        <nested-drag-menu class="mt-4" :items="items" />
        <my-dialog 
            ref="dialog" 
            width="500" 
            label="메뉴" 
            persistent
        >
            <menu-form :item="curItem" class="mt-4" @save="save"/>
        </my-dialog>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { deepCopy } from '../../../util/lib';
import TooltipBtn from '../../components/layout/common/TooltipBtn.vue';
import NestedDragMenu from './MenuComponents/NestedDragMenu.vue';
import MyDialog from '../../components/layout/common/MyDialog.vue';
import MenuForm from './MenuComponents/MenuForm.vue';
export default {
    components : { TooltipBtn, NestedDragMenu, MyDialog, MenuForm, },
    name : "AdmMenu",
    data() {
        return {
            items : [],
            curItem : null,
            parent : null,
        };
    },
    computed : {
        ...mapState({
            menu : (state) => state.config.menu,
        })
    },
    mounted() {
        this.init();
    },
    methods : {
        ...mapActions([ 'configSave', ]),
        init() {
            const items = deepCopy(this.menu);
            for (const item of items) {
                this.$set(item, 'show', false);
            }
            this.items = items;
        },
        addMenu() {
            this.curItem = null;
            this.$refs.dialog.open();
        },
        modifyMenu(item, parent) {
            this.curItem = item;
            this.parent = parent;
            this.$refs.dialog.open();
        },
        save(form) {
            if (this.curItem) {
                const idx = this.parent.indexOf(this.curItem);
                this.parent.splice(idx, 1, form);
            } else {
                form.show = false;
                this.items.push(form);
            }
            this.$refs.dialog.close();
        },
        async refresh() {
            const result = await this.$myNotify.confirm(
                "변경될 메뉴를 초기화 하시겠습니까?",
                "메뉴 초기화",
                { icon : 'mdi-refresh', iconColor : 'red' }
            )
            if (!result) return;
            this.init();
        },
        async updateMenu() {
            const result = await this.$myNotify.confirm(
                "메뉴를 저장 하시겠습니까?",
                "메뉴 저장",
                { icon : 'mdi-content-save-outline', iconColor : 'blue' }
            )
            if (!result) return;
            
            const data = await this.configSave({
                cfg_client : 1,
                cfg_comment : "메뉴는 메뉴관리자에서 수정하세요.",
                cfg_group : "기본환경",
                cfg_name : "메뉴",
                cfg_level : 6,
                cfg_type : "JSON",
                cfg_key : 'menu',
                cfg_val : JSON.stringify(this.items)
            });
            if (data) {
                this.$toast.info("메뉴를 업데이트 하였습니다.");
                this.$socket.emit("config:update", {
                    key : data.cfg_key,
                    value : data.cfg_val,
                })
            }
        }
    }
}
</script>

<style>

</style>