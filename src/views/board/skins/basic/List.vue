<template>
    <v-container>
        <v-toolbar>
            <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
            <v-spacer />
            <v-btn :to="`/board/${table}?act=write`" color="primary">
                <v-icon left>mdi-pencil</v-icon>
                새글 작성
            </v-btn>
        </v-toolbar>
        <!-- v-data-table -->
    </v-container>
</template>

<script>
export default {
    name : "BasicList",
    props : {
        config : Object,
        access : Object,
    },
    title() {
        return this.pageTitle;
    },
    computed : {
        table() {
            return this.config.brd_table;
        },
        pageTitle() {
            return this.config.brd_subject + " 게시판";
        }
    }
}
</script>

<style>

</style>