<template>
    <v-form
        @submit.prevent="save" 
        ref="form" 
        v-model="valid" 
        lazy-validation
    >
        <v-combobox
            v-model="form.cfg_group"
            :items="groupItems"
            label="그룹"
            :rules="[rules.required({ label : '그룹' })]"
        ></v-combobox>
        <div class="d-flex">
            <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                    <span v-on="on" v-bind="attrs" class="mr-2">
                        <v-checkbox 
                            v-model="form.cfg_client" 
                            color="primary" 
                            true-value="1" 
                            false-value="0"></v-checkbox>
                    </span>
                </template>
                <span>클라이언트</span>
            </v-tooltip>
            <input-duplicate-check 
                ref="cfgKey"
                label="키"
                v-model="form.cfg_key" 
                :cbCheck="keyCheck"
                :origin="originKey"
                :readonly="!!item"
                :rules="[
                    rules.required({ label : '키' }),
                    rules.alphaNum(),
                ]"
            />
        </div>
        <v-text-field 
            label="이름" 
            v-model="form.cfg_name"
            :rules="rules.name()"
        ></v-text-field>
        <v-select
            label="값 유형"
            v-model="form.cfg_type"
            :items="typeItems"
        ></v-select>
        <type-value v-model="form.cfg_val" :fieldType="form.cfg_type" />
        <v-slider
            :label="`접근레벨 (${form.cfg_level})`"
            v-model="form.cfg_level"
            :min="LV.ADMIN"
            :max="LV.SUPER"
            thumb-color="primary"
            thumb-label
        ></v-slider>
        <v-textarea 
            label="설명"
            v-model="form.cfg_comment"
        ></v-textarea>
        <v-btn type="submit" block color="primary" class="mt-5">Save</v-btn>
    </v-form>
</template>

<script>
import InputDuplicateCheck from '../../../components/inputForms/InputDuplicateCheck.vue';
import TypeValue from './TypeValue.vue';
import { LV } from '../../../../util/level';
import validateRules from '../../../../util/validateRules';
import { deepCopy, findParentVm } from '../../../../util/lib';
export default {
    components : { InputDuplicateCheck, TypeValue },
    name : "ConfigForm",
    props : {
        keyCheck : {
            type : Function,
            default : null
        },
        groupItems : {
            type : Array,
            default : [],
        },
        item : {
            type : Object,
            default : null,
        }
    },
    data() {
        return {
            valid : true,
            form : null,
            typeItems : ['String', 'Number', 'JSON', 'Secret'],
            originKey : null,
        }
    },
    computed : {
        LV : () => LV,
        rules : () => validateRules,
    },
    created() {
        this.init();
    },
    watch : {
        item() {
            this.init();
        },
    },
    methods : {
        init() {
            if (this.item) {
                this.form = deepCopy(this.item);
                this.originKey = this.item.cfg_key;
            } else {
                this.form = {
                    cfg_key : "", // 중복
                    cfg_val : "", // 타입에 따라서
                    cfg_name : "", //
                    cfg_group : "", //
                    cfg_level : "", // 접근
                    cfg_type : "String", // 저장형식
                    cfg_comment : "", // 설명
                    cfg_client : 0
                }
                this.originKey = null;
            }
            if (this.$refs.form) {
                this.$refs.form.resetValidation();
            }
        },
        async save() {
            this.$refs.form.validate();
            await this.$nextTick();
            if (!this.valid) return;
            if (!this.$refs.cfgKey.validate()) return;
            if (!this.item) {
                let i = 0;
                const parent = findParentVm(this, 'AdmConfig');
                parent.items.forEach( (item) => {
                    if (item.cfg_group == this.form.cfg_group) {
                        i++;
                    }
                });
                this.form.cfg_sort = i;
            }
            console.log(this.form);
            this.$emit('save', this.form);
        },
    }
}
</script>

<style>

</style>