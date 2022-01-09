<template>
    <div>
        <display-avatar :user="user" :size="size" />
        <span class="ml-2">{{ user.user_name }}</span>
    </div>
</template>

<script>
import DisplayAvatar from './DisplayAvatar.vue';
export default {
    components : { DisplayAvatar },
    name : "DisplayName",
    props : {
        user : {
            type : Object,
            required : true,
        },
        size : {
            type : [String, Number],
            default : 24
        }
    }
}
</script>

<style>

</style>