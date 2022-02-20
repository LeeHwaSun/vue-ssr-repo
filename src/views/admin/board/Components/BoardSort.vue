<template>
    <div>
        <v-subheader>정렬 규칙 설정</v-subheader>
        <draggable
            tag="div"
            :list="items"
            class="menu-drag-container"
            handle=".handle"
            v-bind="dragOptions"
        >
            <transition-group type="transition" :name="`flip-list`">
                <div v-for="(item, idx) in items" :key="item.by" class="item-group">
                    <div>
                        <v-sheet 
                            class="item d-flex pa-4 pt-6"
                            outlined
                            rounded
                            elevation="2"
                        >
                            <div class="handle">
                                <v-icon>mdi-drag</v-icon>
                            </div>
                            <v-text-field
                                :label="`정렬규칙 ${idx + 1}`"
                                readonly
                                v-model="item.by"
                                dense
                                hide-details
                                class="ml-4"
                            />
                            <v-select 
                                label="sort"
                                :items="descItems"
                                v-model="item.desc"
                                dense
                                hide-details
                                class="ml-2"
                            />
                            <tooltip-btn label="규칙 제거" icon @click="removeItem(idx)">
                                <v-icon>mdi-close</v-icon>
                            </tooltip-btn>
                        </v-sheet>
                    </div>
                </div>
            </transition-group>
        </draggable>
        <v-form ref="form" v-model="valid" class="d-flex mt-4 px-2" lazy-validation @submit.prevent="addItem">
            <v-autocomplete 
                label="정렬 규칙"
                :items="wrItems"
                dense
                v-model="form.by"
                prepend-icon="mdi-sort"
                :rules="[rules.required({ label : '정렬규칙' })]"
            />
            <v-select 
                label="sort"
                :items="descItems"
                v-model="form.desc"
                dense
                class="ml-2"
            />
            <tooltip-btn label="정렬 규칙 추가" icon type="submit">
                <v-icon>mdi-plus</v-icon>
            </tooltip-btn>
        </v-form>
        <v-divider class="my-4"></v-divider>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
import TooltipBtn from '../../../../components/layout/common/TooltipBtn.vue';
import validateRules from '../../../../../util/validateRules';
export default {
    components : { draggable, TooltipBtn, },
    name : "BoardSort",
    props : {
        items : {
            type : Array,
            required : true,
        }
    },
    data() {
        return {
            valid : true,
            form : {
                by : "",
                desc : 0
            },
            descItems : [
                { text : "내림차순(DESC)", value : 0 },
                { text : "오름차순(ASC)", value : 1 },
            ]
        }
    },
    computed : {
        dragOptions() {
            return {
                animation : 200,
                group : "description",
                disabled : false,
                ghostClass : "ghost"
            };
        },
        wrItems() {
            const arr = [
                "wr_id",
                "wr_reply",
                "wr_grp",
                "wr_order",
                "wr_dep",
                "wr_parent",
                "user_id",
                "wr_email",
                "wr_name",
                "wr_password",
                "wr_category",
                "wr_title",
                "wr_content",
                "wr_view",
                "wr_ip",
                "wr_create_at",
                "wr_update_at",
                "wr_1",
                "wr_2",
                "wr_3",
                "wr_4",
                "wr_5",
                "wr_6",
                "wr_7",
                "wr_8",
                "wr_9",
                "wr_10",
            ];
            const selected = [];
            for (const item of this.items) {
                selected.push(item.by);
            }
            return arr.filter(item => selected.indexOf(item) < 0);
        },
        rules : () => validateRules,
    },
    mounted() {
        this.initForm();
    },
    methods : {
        initForm() {
            this.form = { by : "", desc : 0 };
        },
        async addItem() {
            this.$refs.form.validate();
            await this.$nextTick();
            if (!this.valid) return;
            this.items.push(this.form);
            this.initForm();
            this.$refs.form.resetValidation();
        },
        removeItem(idx) {
            this.items.splice(idx, 1);
        }
    }
}
</script>

<style>

</style>