<template>
    <v-select
        v-if="config.brd_use_category == 1"
        label="카테고리"
        v-model="categoryItem"
        :items="items"
        @change="categoryChange"
        hide-details
        dense
    ></v-select>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name : "CategorySelect",
    props : {
        options : {
            type : Object,
            required : true,
        },
    },
    data() {
        return {
            categoryItem : "전체",
        }
    },
    computed : {
        ...mapState({
            config : state => state.board.config,
        }),
        items() {
            if (this.config.brd_use_category) {
                return ["전체", ...this.config.brd_category];
            }
            return [];
        }
    },
    methods : {
        categoryChange() {
            const category = this.categoryItem == "전체" ? "" : this.categoryItem;
            const options = {
                ...this.options,
                page : 1
            };
            options.stx.splice(1, 1, category);
            this.$emit("update:options", options);
        },
    },
}
</script>

<style>

</style>