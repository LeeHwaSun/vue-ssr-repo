<template>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-avatar 
                v-on="on" 
                v-bind="attrs" 
                :size="size" 
                :color="LV_COLOR(user.user_level)"
            >
                <span style="color: #121212">{{ user.user_level }}</span>
            </v-avatar>
        </template>
        <span>{{ LV_LABEL(user.user_level) }}</span>
    </v-tooltip>
</template>

<script>
import { LV_COLOR, LV_LABEL } from '../../../../util/level';
export default {
    name : "DisplayLevel",
    props : {
        user : {
            type : Object,
            required : true,
        },
        size : {
            type : [String, Number],
            default : 24,
        }
    },
    computed : {
        LV_COLOR : () => LV_COLOR,
        LV_LABEL : () => LV_LABEL,
    }
}
</script>

<style>

</style>