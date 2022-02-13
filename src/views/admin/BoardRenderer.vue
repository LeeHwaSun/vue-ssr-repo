<template>
    <board-list v-if="action === 'list'" />
    <board-form v-else-if="action === 'form'" :table="table" />
    <error v-else />
    <!-- 동적 비동기 컴포넌트 로드 방식 -->
    <!--component v-bind:is="viewComponent" :table="table" /-->
</template>

<script>
import BoardList from './board/BoardList.vue';
import BoardForm from './board/BoardForm.vue';
import Error from '../Error.vue';
export default {
    components : { BoardList, BoardForm, Error },
    name : "AdmBoardRenderer",
    computed : {
       match() {
           return this.$route.params.pathMatch.split('/');
       },
       action() {
           return this.match[0];
       },
       table() {
           return this.match[1] || null;
       },
       // 동적 비동기 컴포넌트 로드 방식
       /*viewComponent() {
           switch (this.action) {
               case 'list' : return "BoardList";
               case 'form' : return "BoardForm";
               default : return "Error";
           }
       }*/
    },
    mounted() {
        console.log(this.$route);
    }
}
</script>

<style>

</style>