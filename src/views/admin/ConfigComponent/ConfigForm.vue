<template>
    <v-form
        @submit.prevent="save" 
        ref="form" 
        v-model="valid" 
        lazy-validation
    >
        <v-btn type="submit" block color="primary" class="mt-5">Save</v-btn>
    </v-form>
</template>

<script>

export default {
    name : "ConfigForm",
    data() {
        return {
            valida : true,
            form : {
                test : 'test'
            },
        }
    },
    methods : {
        async save() {
            this.$refs.form.validate();
            await this.$nextTick();
            if (!this.valid) return;
            this.$emit('save', this.form);
        }
    }
}
</script>

<style>

</style>