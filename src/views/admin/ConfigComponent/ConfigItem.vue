<template>
    <li>
        <v-icon class="handle">mdi-drag</v-icon>
        {{ item.cfg_name }} - {{ item.cfg_key }}
        <v-btn @click="$emit('update', item)">수정</v-btn>
    </li>
</template>

<script>
export default {
    name : "ConfigItem",
    props : {
        item : {
            type : Object,
            required : true,
        }
    }
}
</script>

<style>

</style>