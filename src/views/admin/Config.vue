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
                @remove="removeConfig"
            >
            </config-item>
        </draggable>

        <!-- 설정 다이얼로그 -->
        <my-dialog 
            label="설정 추가" 
            ref="dialog" 
            max-width="500" 
            dark
            color="primary"
            persistent
        >
            <config-form 
                ref="configForm"
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
            this.setCurItems();
        }
    },
    methods : {
        ...mapActions([ 'configDuplicateCheck', 'configSave' ]),
        addConfig() {
            this.item = null;
            if (this.$refs.configForm) {
                this.$refs.configForm.init();
            }
            this.$refs.dialog.open();
        },
        updateConfig(item) {
            this.item = item;
            if (this.$refs.configForm) {
                this.$refs.configForm.init();
            }
            this.$refs.dialog.open();
        },
        async removeConfig(item) {
            // 진짜 지울거니?
            const confirm = await this.$myNotify.confirm(
                `<b>[${item.cfg_name}]</b> 삭제하시겠습니까?`, 
                '설정항목 삭제', 
                { icon : 'mdi-delete', iconColor : 'red' }
            );
            if (!confirm) return;
            // DB 지우고
            const data = await this.$axios.delete(`/api/config/${item.cf_key}`);
            // 목록 업데이트
            if (data) {
                this.$toast.info(`[${item.cfg_name}] 삭제 하였습니다.`);
                const idx = this.items.indexOf(item);
                this.items.splice(idx, 1);
                this.setCurItems();
            }
        },
        async save(form) {
            const data = await this.configSave(form);
            if (this.item) { // 수정
                this.$toast.info(`[${form.cfg_name}] 수정 하였습니다.`);
                const idx = this.items.indexOf(this.item);
                this.items.splice(idx, 1, data);
            } else { // 신규
                this.$toast.info(`[${form.cfg_name}] 추가 하였습니다.`);
                this.items.push(data);
            }
            this.setCurItems();
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
        },
        setCurItems() {
            this.curItems = this.items.filter((item) => {
                return item.cfg_group == this.groupName;
            });
        }
    }
}
</script>

<style>

</style>