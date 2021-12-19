<template>
    <v-dialog v-model="dialog" v-bind="$attrs">
        <v-card>
            <v-toolbar v-bind="$attrs">
                <v-toolbar-title>{{ label }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <slot></slot>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name : "MyDialog",
    props : {
        label : {
            type : String,
            required : true,
        },
    },
    data() {
        return {
            dialog : false,
        }
    },
    methods : {
        open() {
            this.dialog = true;
        },
        close() {
            this.dialog = false;
        }
    }
}
</script>

<style>

</style>