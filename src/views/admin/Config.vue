<template>
    <v-container fluid>
        <v-toolbar class="mt-2">
            <v-toolbar-title>설정관리</v-toolbar-title>
            <v-spacer></v-spacer>
            <tooltip-btn fab small label="Add" @click="addConfig">
                <v-icon>mdi-plus</v-icon>
            </tooltip-btn>
        </v-toolbar>
        <v-row class="mt-2">
            <v-col>
                <v-tabs v-model="group" background-color="primary" dark>
                    <v-tab v-for="item in groupItems" :key="item.cfg_key">
                        {{ item }}
                    </v-tab>
                </v-tabs>
            </v-col>
        </v-row>

        <draggable tag="ul" :list="curItems" class="list-group mt-5" handle=".handle" @end="sortEnd">
            <config-item
                class="list-group-item"
                v-for="item in curItems"
                :key="item.cfg_key"
                :item="item"
                @update="updateConfig"
            >
            </config-item>
        </draggable>

        <!-- 설정 다이얼로그 -->
        <my-dialog 
            label="설정 추가" 
            ref="dialog" 
            max-width="500" 
            color="primary"
        >
            <config-form 
                @save="save" 
                :keyCheck="keyCheck" 
                :groupItems="groupItems"
                :item="item"
                class="mt-5"
            ></config-form>
        </my-dialog>
        <!-- // 설정 다이얼로그 -->
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import TooltipBtn from '../../components/layout/common/TooltipBtn.vue';
import MyDialog from '../../components/layout/common/MyDialog.vue';
import ConfigForm from './ConfigComponent/ConfigForm.vue';
import ConfigItem from './ConfigComponent/ConfigItem.vue';
import draggable from "vuedraggable";
export default {
    components : { TooltipBtn, MyDialog, ConfigForm, ConfigItem, draggable },
    name : "AdmConfig",
    title : "설정",
    data() {
        return {
            items : [],
            group : -1,
            curItems : [],
            item : null,
        }
    },
    computed :  {
        groupItems() {
            const sets = new Set();
            this.items.forEach( (item) => {
                sets.add(item.cfg_group);
            });
            return [...sets];
        },
        groupName() {
            return this.groupItems[this.group] || '';
        },
    },
    mounted() {
        this.fetchData();
    },
    watch : {
        group() {
            this.curItems =  this.items.filter((item) => {
                return item.cfg_group == this.groupName;
            });
        }
    },
    methods : {
        ...mapActions([ 'configDuplicateCheck', 'configSave' ]),
        addConfig() {
            this.item = null;
            this.$refs.dialog.open();
        },
        updateConfig(item) {
            this.item = item;
            this.$refs.dialog.open();
        },
        async save(form) {
            const data = await this.configSave(form);
            this.$refs.dialog.close();
        },
        async keyCheck(value) {
            const data = await this.configDuplicateCheck({ field : 'cfg_key', value });
            return data;
        },
        async fetchData() {
            this.items = await this.$axios.get('/api/config?all=true');
        },
        sortEnd() {
            // curItems 있는 정보로 cfg_sort 전체 업데이트
            let i = 0;
            const arr = [];
            this.curItems.forEach( (item) => {
                item.cfg_sort = i++;
            });
            this.$axios.put('/api/config', this.curItems);
        }
    }
}
</script>

<style>

</style>