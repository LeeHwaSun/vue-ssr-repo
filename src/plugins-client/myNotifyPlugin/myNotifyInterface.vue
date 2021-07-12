<template>
    <div>
        <my-notify-component ref="notify" :opt="options" />
    </div>
</template>

<script>
import myNotifyComponent from "./myNotifyComponent.vue";
export default {
    name: "myNofityInterface",
    components: { myNotifyComponent },
    methods: {
        alert(content, title = "", option = {}) {
            return this.$refs.notify.show(content, title, {
                ...this.options,
                ...option,
                type: "alert",
            });
        },
        confirm(content, title = "", option = {}) {
            return this.$refs.notify.show(content, title, {
                ...this.options,
                ...option,
                type: "confirm",
            });
        },
        prompt(content, title = "", option = {}) {
            return this.$refs.notify.show(content, title, {
                ...this.options,
                ...option,
                type: "prompt",
            });
        },
    },
};
</script>

<style>
</style>