<template>
    <v-dialog v-model="dialog" max-width="400" persistent>
        <v-card>
            <v-toolbar v-if="title" color="primary" dark>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-4">
                <div>
                    <v-icon v-if="options.icon" large class="mr-4" :color="options.iconColor">
                        {{ options.icon }}
                    </v-icon>
                    {{ content }}
                </div>
                <v-form v-if="options.type === 'prompt'" v-model="valid" ref="form" lazy-validation>
                    <v-text-field v-model="text" :rules="[ v => !!v || '필수 입력입니다.',]" ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn v-if="options.type !== 'alert'" @click="cancel">취소</v-btn>
                <v-btn color="primary" @click="ok">확인</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "myNotifyComponent",
    props: ["opt"],
    data() {
        return {
            dialog: false,
            title: "",
            content: "내용",
            valid: true,
            text: "",
            promise: null,
            options: { ...this.opt },
        };
    },
    methods: {
        show(content, title, option) {
            return new Promise((resolve, reject) => {
                if (this.dialog) this.close();
                this.$nextTick(() => {
                    this.promise = { resolve, reject };
                    this.content = content;
                    this.title = title;
                    console.log(option);
                    this.options = Object.assign({}, option);
                    this.dialog = true;
                });
            });
        },
        close(result) {
            this.promise.resolve(result);
            this.dialog = false;
            this.content = "";
            this.title = "";
            this.text = "";
            this.valid = true;
            this.promise = null;
            this.options = { ...this.opt };
        },
        ok() {
            if (this.options.type === 'prompt') {
                this.$refs.form.validate();
                this.$nextTick(() => {
                    if (!this.valid) return;
                    this.promise.resolve(this.text);
                    this.close();
                });
            } else {
                this.promise.resolve(true);
                this.close();
            }
        },
        cancel() {
            this.close(false);
        }
    }
}
</script>

<style>
</style>