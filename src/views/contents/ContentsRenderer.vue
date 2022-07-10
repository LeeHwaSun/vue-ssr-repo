<template>
    <component 
        :is="curSkin"
        :item="item"
    />
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import SKINS from './skins';
import upperFirst from 'lodash/upperFirst';
import ContentsError from './ContentsError.vue';
export default {
    components: { ...SKINS, ContentsError },
    name: "ContentsRenderer",
    data() {
        return {
            // item : null,
        }
    },
    computed: {
        ...mapState({
            item: state => state.board.detail
        }),
        curSkin() {
            if (this.item) {
                const prefix = upperFirst(this.item.wr_2);
                return `${prefix}Contents`;
            } else {
                return "ContentsError";
            }
        },
    },
    serverPrefetch() {
        return this.fetchData();
    },
    mounted() {
        if (!this.item) {
            this.fetchData();
        }
    },
    destroyed() {
        this.SET_DETAIL(null);
    },
    methods : {
        ...mapMutations('board', ['SET_DETAIL']),
        ...mapActions("board", ["getContentsDetail"]),
        async fetchData() {
            // console.log("FETCH", this.$route)
            const headers = {};
            if (this.$ssrContext) {
                headers.token = this.$ssrContext.token;
            }

            await this.getContentsDetail({ wr_1 : this.$route.params.wr_1, headers });
        },
    }
}
</script>

<style>

</style>