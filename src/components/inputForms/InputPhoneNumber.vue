<template>
    <v-text-field 
        :value="value"
        @keyup="onInput"
        v-bind="$attrs"
        :maxlength="max"
    />
</template>

<script>
export default {
    name: "InputPhoneNumber",
    model: {
        prop : "value",
        event : "input"
    },
    props : {
        value : String
    },
    data() {
        return {
            max : 13
        }
    },
    methods: {
        onInput(event) {
            //console.log(event.target.value);
            const val = this.autoDash(event.target.value);
            this.$emit('input', val);
        },
        autoDash(val) {
            val = val.replace(/[^\d]/g, '');
            let pattern = null;
            if (val[0] != 0) { // 지역번호 없는 번호
                if (val.length < 8) {
                    pattern = /([\d]{0,3})([\d]{0,4})/;
                } else {
                    pattern = /([\d]{0,4})([\d]{0,4})/;
                }
                this.max = 9;
            } else if (val[1] == 2) { // 02(서울)
                if (val.length < 10) {
                    pattern = /([\d]{0,2})([\d]{0,3})([\d]{0,4})/;
                } else {
                    pattern = /([\d]{0,2})([\d]{0,4})([\d]{0,4})/;
                }
                this.max = 12;
            } else { // 그 외
                if (val.length < 11) {
                    pattern = /([\d]{0,3})([\d]{0,3})([\d]{0,4})/;
                } else {
                    pattern = /([\d]{0,3})([\d]{0,4})([\d]{0,4})/;
                }
                this.max = 13;
            }

            const matches = pattern.exec(val);
            console.log(matches);
            let rVal = matches[1];
            rVal += matches[2] ? '-' + matches[2] : "";
            rVal += matches[3] ? '-' + matches[3] : "";
            console.log(rVal);
            return rVal;
        }
    }
}
</script>

<style>

</style>