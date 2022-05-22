<template>
    <span>
        <v-btn :loading="loading" v-bind="$attrs" @click="openDialog">
            <slot></slot>
        </v-btn>
        <my-dialog 
            width="400" 
            ref="dialog" 
            :label="`게시물 ${label}`" 
            @onClose="closeDialog" 
            persistent
        >
            <v-form 
                @submit.prevent="checkPass" 
                ref="form" 
                lazy-validation 
                v-model="valid"
            >
                <input-password 
                    label="비밀번호" 
                    v-model="password" 
                    :rules="rules.wr_password()"
                    prepend-icon="mdi-key"
                    class="mt-4"
                />
                <v-btn type="submit" block color="primary" class="mt-2">비밀번호 확인</v-btn>
            </v-form>
        </my-dialog>
    </span>
</template>
<script>
import InputPassword from '../../../../../components/inputForms/InputPassword.vue';
import MyDialog from '../../../../../components/layout/common/MyDialog.vue';
import valuidateRules from '../../../../../../util/validateRules';
export default {
    components : { MyDialog, InputPassword, },
    name: "ModifyButton",
    inheritAttrs: false,
    props: {
        table: {
            type : String,
            required : true
        },
        wr_id: {
            type : Number,
            required : true
        },
        label : {
            type : String,
            required : true
        }
    },
    data() {
        return {
            loading : false,
            password : "",
            valid : true,
        }
    },
    computed : {
        rules : () => valuidateRules,
    },
    methods : {
        openDialog() {
            this.loading = true;
            this.$refs.dialog.open();
        },
        closeDialog() {
            this.loading = false;
        },
        async checkPass() {
            this.$refs.form.validate();
            await this.$nextTick();
            if (!this.valid) return;
            const data = await this.$axios.post(
                `/api/board/check/${this.table}/${this.wr_id}`,
                { password : this.password }
            );
            if (data) {
                this.$emit("onValid", data.token);
                this.$refs.dialog.close();
            }
        },
    }
}
</script>

<style>

</style>