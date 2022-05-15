<template>
    <div v-if="user">CommentForm</div>
    <div v-else>
        로그인 후 댓글을 작성할 수 있습니다.
        <v-btn :to="`/login?nextUrl=${$route.fullPath}`">로그인</v-btn>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import validateRules from '../../../../../../util/validateRules';
export default {
    name: "CommentForm",
    props: {
        table : {
            type : String,
            required : true
        },
        wr_reply : {
            type : Number,
            required : true
        },
        wr_parent : {
            type : Number,
            default : 0
        }
    },
    data() {
        return {
           valid : true,
           form : null, 
        }
    },
    computed: {
        ...mapState({
            user : state => state.user.user,
        }),
        rules : () => validateRules,
    }
}
</script>

<style>

</style>