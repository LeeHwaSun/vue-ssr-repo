<template>
    <div>
        Basic List
        <v-btn :to="`/board/${table}`">목록</v-btn>
        <v-btn :to="`/board/${table}?act=write`">쓰기</v-btn>
        <v-btn :to="`/board/${table}/1`">읽기</v-btn>
    </div>
</template>

<script>
export default {
    name : "BasicList",
    props : {
        config : Object,
        access : Object,
    },
    computed : {
        table() {
            return this.config.brd_table;
        }
    }
}
</script>

<style>

</style>