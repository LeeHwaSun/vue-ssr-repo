<template>
    <v-chip-group>
        <v-chip v-for="tag in tags" :key="tag" label>{{ tag }}</v-chip>
    </v-chip-group>
</template>

<script>
export default {
    name : "TagView",
    props : {
        tags : {
            type : Array,
            default : [],
        }
    }
}
</script>

<style>

</style>