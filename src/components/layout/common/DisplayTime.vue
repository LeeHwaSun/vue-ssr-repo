<template>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <span v-on="on" v-bind="attrs">
                {{ display }}
            </span>
        </template>
        {{ formatTime }}
    </v-tooltip>
</template>

<script>
export default {
    name : "DisplayTime",
    props : {
        time : {
            type : String,
            required : true,
        }
    },
    computed : {
        formatTime() {
            return this.$moment(this.time).format('LLL');
        },
        display() {
            const bt = this.$moment(this.time);
            const ct = this.$moment();
            const diff = ct.diff(bt, 'days');
            if (diff > 0) {
                return this.$vuetify.breakpoint.xs ? bt.format('L') : bt.format('LL');
            }
            return bt.fromNow();
        }
    }
}
</script>

<style>

</style>