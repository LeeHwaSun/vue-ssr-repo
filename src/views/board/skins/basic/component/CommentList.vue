<template>
    <v-card-text>
        <comment-form 
            :wr_reply="id" 
            :table="table" 
            :parent="0" 
            @onUpdate="updateItem" 
        />
        <v-list>
            <comment-item 
                v-for="(item, i) in items" 
                :key="item.wr_id" 
                :item="item" 
                :idx="i" 
                :table="table"
                :access="access"
                @onReComment="reComment"
                @onUpdate="updateItem"
            />
        </v-list>
    </v-card-text>
</template>

<script>
import CommentForm from './CommentForm.vue';
import CommentItem from './CommentItem.vue';
export default {
    components: { CommentForm, CommentItem },
    name: "CommentList",
    props: {
        table : {
            type : String,
            required : true
        },
        id : {
            type : Number,
            required : true
        },
        access : {
            type : Object,
            required : true
        },
    },
    data() {
        return {
            loading : false,
            items : [],
            totalItems : 0,
            options : {
                itemsPerPage : 5,
                page : 1,
                sortBy : ['wr_grp', 'wr_order'],
                sortDesc : [false, true],
                stf : ['wr_reply'],
                stc : ['eq'],
                stx : [this.id],
            },
            item : null,
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            this.loading = true;
            const data = await this.$axios.get(`/api/board/list/${this.table}`, {
                params : this.options
            });

            if (data) {
                this.setData(data);
            }

            this.loading = false;
        },
        setData(data) {
            this.items = data.items;
            this.totalItems = data.totalItems;
        },
        updateItem(item) {
            console.log("updateItem", item);
            const find = this.items.find(p => p.wr_id == item.wr_id);
            if (find) { // 수정
                const idx = this.items.indexOf(find);
                this.items.splice(idx, 1, item);
            } else { // 신규
                this.items.unshift(item);
                this.totalItems++;
            }
        },
        reComment(parent, item) {
            const find = this.items.find(item => item.wr_id == parent.wr_id);
            if (find) {
                const idx = this.items.indexOf(find);
                this.items.splice(idx + 1, 0, item);
                this.totalItems++;
            }
        }
    }
}
</script>

<style>

</style>