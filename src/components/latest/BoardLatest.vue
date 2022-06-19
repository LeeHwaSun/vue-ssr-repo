<template>
    <component 
        :is="skinName" 
        :table="table" 
        :subject="subject" 
        :items="items" 
        :loading="loading" 
    />
</template>

<script>
import SKINS from './skins';
import upperFirst from 'lodash/upperFirst';
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
    components: { ...SKINS },
    name: "BoardLatest",
    props: {
        table : {
            type : String,
            required : true,
        },
        skin : {
            type : String,
            default : 'basic',
        },
        limit : {
            type : Number,
            default : 5,
        }
    },
    data() {
        return {
            loading : false,
        }
    },
    computed: {
        ...mapState({
            latest : (state) => state.board.latest,
        }),
        items() {
            if (this.latest[this.table]) {
                return this.latest[this.table].items;
            }
            return [];
        },
        subject() {
            if (this.latest[this.table]) {
                return this.latest[this.table].subject;
            }
            return "";
        },
        skinName() {
            return upperFirst(this.skin) + "Latest";
        }
    },
    serverPrefetch() {
        return this.fetchData();
    },
    mounted() {
        if (!this.latest[this.table]) {
            this.fetchData();
        }
    },
    destroyed() {
        this.SET_LATEST({table : this.table, payload : null});
    },
    methods: {
        ...mapMutations('board', ['SET_LATEST']),
        ...mapActions('board', ['getLatest']),
        async fetchData() {
            const { table, limit } = this;
            this.loading = true;
            await this.getLatest({ table, limit });
            console.log(this.subject, this.items);
            this.loading = false;
        }
    }
}
</script>

<style>

</style>