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
            <config-form @save="test"></config-form>
        </my-dialog>
        <!-- // 설정 다이얼로그 -->
    </v-container>
</template>

<script>
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
        addConfig() {
            this.$refs.dialog.open();
        },
        test(form) {
            console.log(form);
            this.$refs.dialog.close();
        }
    }
}
</script>

<style>

</style>