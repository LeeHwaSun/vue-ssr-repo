<template>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="{ ...$attrs, ...attrs }" @click="$emit('click')">
                <slot></slot>
            </v-btn>
        </template>
        <span>{{ label }}</span>
    </v-tooltip>
</template>

<script>
export default {
    name : "TooltipBtn",
    props : {
        label : {
            type : String,
            required : true,
        }
    }
}
</script>

<style>

</style>