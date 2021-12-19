<template>
    <v-container fluid>
        <v-toolbar class="mt-2">
            <v-toolbar-title>설정관리</v-toolbar-title>
            <v-spacer></v-spacer>
            <tooltip-btn fab small label="Add" color="primary" @click="addConfig">
                <v-icon>mdi-plus</v-icon>
            </tooltip-btn>
            <tooltip-btn fab small label="Restart" color="error" @click="restartServer" chlidClass="ml-2" :loading="restart">
                <v-icon>mdi-power</v-icon>
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
import { mapActions, mapState } from 'vuex';
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
            restart: false,
        }
    },
    computed :  {
        ...mapState({
            online : (state) => state.socket.online,
        }),
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
        online() {
            if (this.online) {
                this.$toast.info('서버가 재시작 되었습니다.');
                this.restart = false;
            }
        },
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
            const data = await this.$axios.delete(`/api/config/${item.cfg_key}`);
            // 목록 업데이트
            if (data) {
                if (item.cfg_client) {
                    this.$socket.emit('config:remove', item.cfg_key);
                }

                this.$toast.info(`[${item.cfg_name}] 삭제 하였습니다.`);
                const idx = this.items.indexOf(item);
                this.items.splice(idx, 1);
                this.setCurItems();
            }
        },
        async save(form) {
            const data = await this.configSave(form);
            if (data.cfg_client) {
                this.$socket.emit('config:update', { 
                    key : data.cfg_key, 
                    value : data.cfg_val 
                });
            } else if (this.item && this.item.cfg_client) {
                this.$socket.emit('config:remove', data.cfg_key);
            }

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
            const payload = [];
            this.curItems.forEach( (item) => {
                item.cfg_sort = i++;
                payload.push({ 
                    cfg_key : item.cfg_key, 
                    cfg_sort : item.cfg_sort 
                });
            });
            this.$axios.put('/api/config', payload);
        },
        setCurItems() {
            this.curItems = this.items.filter((item) => item.cfg_group == this.groupName)
                                      .sort((a, b) => a.cfg_sort - b.cfg_sort);
        },
        async restartServer() {
            const result = await this.$myNotify.confirm(
                "서버 재시작 요청을 하시겠습니까?",
                "서버 재시작",
                { icon : "mdi-power", iconColor : "red" }
            );

            if (!result) return;

            this.restart = true;
            const data = await this.$axios.get('/api/config/restart');
            if (data) {
                setTimeout( () => {
                    if (this.restart) {
                        this.$toast.error('서버 재시작이 실패했습니다.\n잠시 후 다시 시도 하세요.');
                        this.restart = false;
                    }
                }, 10000);
            } else {
                this.restart = false;
            }
            
        }
    }
}
</script>

<style>

</style>