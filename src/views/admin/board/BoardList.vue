<template>
    <v-container fluid>
        <v-toolbar class="mt-2">
            <v-toolbar-title>게시판 관리</v-toolbar-title>
            <v-spacer></v-spacer>
            <tooltip-btn label="게시판 추가" icon to="/adm/board/form">
                <v-icon>mdi-plus</v-icon>
            </tooltip-btn>
        </v-toolbar>
    </v-container>
</template>

<script>
import TooltipBtn from '../../../components/layout/common/TooltipBtn.vue';
export default {
    components : { TooltipBtn, },
    name : "AdmBoardList",
    title : "게시판 관리",
}
</script>

<style>

</style>