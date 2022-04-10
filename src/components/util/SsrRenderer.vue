<template>
    <div v-if="isClient">
        <slot name="default"></slot>
    </div>
    <div v-else class="d-none">
        <slot name="server"></slot>
    </div>
</template>

<script>
export default {
    name : "SsrRenderer",
    data() {
        return {
            isClient : false,
        }
    },
    mounted() {
        this.isClient = true;
    }
}
</script>

<style>

</style>