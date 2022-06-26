<template>
    <div class="d-flex">
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
        >
            <template #activator="{ on, attrs }">
                <v-text-field
                    v-model="date"
                    :label="label"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
            </template>
            <v-date-picker
                v-model="date"
                @input="menu = false"
            ></v-date-picker>
        </v-menu>
        <v-select 
            :items="hourItems" 
            v-model="hour" 
            suffix="시" 
            style="max-width: 80px;"
            class="ml-4"
        ></v-select>
        <v-select 
            :items="minItems" 
            v-model="min" 
            suffix="분" 
            style="max-width: 80px;"
            class="ml-4"
        ></v-select>
    </div>
</template>

<script>
export default {
    name: "DateTimePicker",
    model: {
        value : 'value',
        event : "input"
    },
    props: {
        value : {
            type : String,
            required : true,
        },
        label : {
            type : String,
            required : true,
        }
    },
    data() {
        return {
            menu : false,
            date : "",
            hour : 0,
            min : 0
        }
    },
    computed: {
        hourItems() {
            const arr = [];
            for (let i = 0; i < 24; i++) {
                arr.push(i);
            }
            return arr;
        },
        minItems() {
            const arr = [];
            for (let i = 0; i < 60; i++) {
                arr.push(i);
            }
            return arr;
        }
    },
    watch: {
        date() {
            this.emitValue();
        },
        hour() {
            this.emitValue();
        },
        min() {
            this.emitValue();
        }
    },
    created() {
        const date = this.value ? this.$moment(this.value) : this.$moment();
        this.date = date.format('L');
        this.hour = parseInt(date.format('H'));
        this.min = parseInt(date.format('m'));
    },
    methods : {
        emitValue() {
            if (!this.date) return;
            const date = this.$moment(this.date);
            date.set('hour', this.hour);
            date.set('minute', this.min);
            this.$emit('input', date.format('LT'));
        }
    }
}
</script>

<style>

</style>