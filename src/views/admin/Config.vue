<template>
    <v-container fluid>
        <v-toolbar>
            <v-toolbar-title>설정관리</v-toolbar-title>
            <v-spacer></v-spacer>
            <tooltip-btn fab small label="Add" @click="addConfig">
                <v-icon>mdi-plus</v-icon>
            </tooltip-btn>
        </v-toolbar>
        <!-- 설정 다이얼로그 -->
        <my-dialog label="설정 추가" ref="dialog" max-width="500" color="primary">
            <config-form @save="save" :keyCheck="keyCheck"></config-form>
        </my-dialog>
        <!-- // 설정 다이얼로그 -->
    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import TooltipBtn from '../../components/layout/common/TooltipBtn.vue';
import MyDialog from '../../components/layout/common/MyDialog.vue';
import ConfigForm from './ConfigComponent/ConfigForm.vue';
export default {
    components : { TooltipBtn, MyDialog, ConfigForm },
    name : "AdmConfig",
    title : "설정",
    data() {
        return {
            dialog : false,
        }
    },
    methods : {
        ...mapActions([ 'configDuplicateCheck', 'configSave' ]),
        addConfig() {
            this.$refs.dialog.open();
        },
        async save(form) {
            console.log(form);
            const data = await this.configSave(form);
            console.log(data);
            this.$refs.dialog.close();
        },
        async keyCheck(value) {
            console.log(value);
            const data = await this.configDuplicateCheck({ field : 'cfg_key', value });
            console.log(data);
            return { cnt : 0 };
        }
    }
}
</script>

<style>

</style>