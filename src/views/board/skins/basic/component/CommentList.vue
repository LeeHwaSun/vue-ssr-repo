<template>
    <v-card-text>
        <comment-form :wr_reply="id" :table="table" :wr_parent="0" />
    </v-card-text>
</template>

<script>
import CommentForm from './CommentForm.vue';
export default {
    components: { CommentForm },
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
    }
}
</script>

<style>

</style>