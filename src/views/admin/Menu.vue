<template>
    <v-container>
        <v-toolbar>
            <v-toolbar-title>메뉴관리</v-toolbar-title>
            <v-spacer></v-spacer>
            <tooltip-btn label="Add Menu" icon small fab color="secondary" @click="addMenu">
                <v-icon>mdi-plus</v-icon>
            </tooltip-btn>
            <tooltip-btn label="Save Menu" icon small fab color="primary">
                <v-icon>mdi-content-save</v-icon>
            </tooltip-btn>
            <tooltip-btn label="Reset" icon small fab color="error">
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
            <menu-form :item="curItem" class="mt-4"/>
        </my-dialog>
    </v-container>
</template>

<script>
import { mapState } from 'vuex';
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
        }
    }
}
</script>

<style>

</style>