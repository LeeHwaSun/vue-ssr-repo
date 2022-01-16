<template>
    <div>
        <div class="text-caption">{{ label }} {{ value }} : <span>{{ lvLabel }}</span></div>
        <v-slider
            :value="value"
            :min="LV.BLOCK"
            :max="LV.SUPER"
            ticks="always"
            thumb-label
            :prepend-icon="icon"
            hide-details
            @change="onChange"
        >
        </v-slider>
    </div>
</template>

<script>
import { LV, LV_LABEL } from '../../../util/level';
export default {
    name : "InputLevel",
    model : {
        prop : "value",
        event : "change",
    },
    props : {
        value : Number,
        label : {
            type : String,
            default : "레벨",
        },
        icon : {
            type : String,
            default : "",
        }
    },
    computed : {
        LV : () => LV,
        lvLabel() {
            return LV_LABEL(this.value);
        }
    },
    methods : {
        onChange(val) {
            this.$emit('change', val);
        }
    }
}
</script>

<style>

</style>