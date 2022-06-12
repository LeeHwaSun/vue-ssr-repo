<template>
    <v-btn v-bind="$attrs" @click="$emit('click')" :small="breakPointXS">
        <v-icon :left="!breakPointXS">{{ icon }}</v-icon>
        <div v-if="!breakPointXS">{{ label }}</div>
    </v-btn>
</template>

<script>
export default {
    name : "BoardButton",
    props : {
        label : {
            type : String,
            default : ""
        },
        icon : {
            type : String,
            default : ""
        },
    },
    computed : {
        breakPointXS() {
            return this.$vuetify.breakpoint.xs;
        }
    }
}
</script>

<style>

</style>