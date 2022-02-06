<template>
    <draggable 
        v-bind="dragOptions"
        tag="div"
        :list="items"
        class="menu-drag-container"
        handle=".handle"
    >
        <div 
            v-for="(item, i) in items" 
            :key="`${i}${item.title}`" 
            class="menu-drag-group"
        >
            <v-expand-transition>
                <div v-show="show">
                    <div class="menu-drag-zone">
                        <v-sheet class="menu-drag-item d-flex pa-4 pt-6" outlined rounded elevation="2">
                            <!-- 하위 메뉴 단계 -->
                            <div class="icon">
                                <v-icon>mdi-subdirectory-arrow-right</v-icon>
                            </div>
                            <!-- 드래그 핸들러 -->
                            <div class="handle">
                                <v-icon>mdi-drag</v-icon>
                            </div>
                            <!-- 하위 메뉴가 없으면 비활성 -->
                            <v-btn 
                                icon
                                :disabled="item.subItems.length == 0" 
                                small
                                @click="toggleSub(item)"
                            >
                                <v-icon>mdi-chevron-down</v-icon>
                            </v-btn>
                            <!-- 컨텐츠 내용 -->
                            <v-icon v-if="item.isHide" color="gray">mdi-eye-off</v-icon>
                            <v-icon v-else color="primary">mdi-eye</v-icon>
                            <v-text-field 
                                label="메뉴명" 
                                v-model="item.title"
                                hide-details
                                dense
                                :prepend-icon="item.icon"
                                readonly
                                class="ml-2"
                            />
                            <display-level :level="item.grant" :size="32" />
                            <v-text-field 
                                label="link"
                                v-model="item.to"
                                hide-details
                                dense
                                class="ml-2"
                                readonly 
                            />
                            <tooltip-btn label="Modify" icon small color="primary" childClass="ml-2" @click="modifyItem(item)">
                                <v-icon>mdi-pencil</v-icon>
                            </tooltip-btn>
                            <tooltip-btn label="Remove" icon small color="error" childClass="ml-2" @click="removeItem(item)">
                                <v-icon>mdi-trash-can</v-icon>
                            </tooltip-btn>
                        </v-sheet>
                    </div>
                    <!-- 중첩 메뉴 -->
                    <nested-drag-menu 
                        :items="item.subItems" 
                        class="menu-drag-subitem" 
                        :show="item.show" 
                    />
                </div>
            </v-expand-transition>
        </div>
    </draggable>
</template>

<script>
import DisplayLevel from '../../../components/layout/user/DisplayLevel.vue';
import TooltipBtn from '../../../components/layout/common/TooltipBtn.vue';
import draggable from 'vuedraggable';
import { findParentVm } from '../../../../util/lib';
export default {
    components : { draggable, DisplayLevel, TooltipBtn },
    name : "NestedDragMenu",
    props : {
        items : {
            type : Array,
            required : true,
        },
        show : {
            type : Boolean,
            default : true,
        }
    },
    computed : {
        dragOptions() {
            return {
                animation: 0,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            }
        }
    },
    created() {
        for (const item of this.items) {
            this.$set(item, 'show', false);
        }
    },
    methods : {
        toggleSub(item) {
            item.show = !item.show;
        },
        removeItem(item) {
            const idx = this.items.indexOf(item);
            this.items.splice(idx, 1);
        },
        modifyItem(item) {
            const admMenu = findParentVm(this, 'AdmMenu');
            admMenu.modifyMenu(item, this.items);
        }
    }
}
</script>

<style>
.menu-drag-container .menu-drag-item { position: relative; }
.menu-drag-container .menu-drag-item .icon { display: none; }
.menu-drag-container .menu-drag-subitem { position: relative; margin-left: 2rem; }
.menu-drag-container .menu-drag-subitem .menu-drag-item .icon { display: block; position: absolute; left: -1.75rem; top: 1rem; }
.menu-drag-container .ghost { cursor: grab; }
.menu-drag-container .menu-drag-zone { padding-bottom : 1rem; }
</style>