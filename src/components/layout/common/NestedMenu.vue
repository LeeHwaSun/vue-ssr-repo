<template>
    <div :style="{'padding-left': depth * 2 + 'px'}">
        <div v-for="(item, i) in items" :key="`${i}${item.title}`">
            <v-list-group 
                v-if="item.subItems && item.subItems.length > 0 && isShow(item)"
                :prepend-icon="depth === 0 ? item.icon : ''"
                append-icon=""
                no-action
                :sub-group="depth > 0"
                v-model="item.active"
            >
                <template v-slot:activator>
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                    <v-btn icon v-bind="{ ...getLink(item), ...isDisabled(item) }" plain>
                        <v-icon>mdi-arrow-top-right</v-icon>
                    </v-btn>
                    <v-icon :style="activeStyle(item.active)">mdi-chevron-down</v-icon>
                </template>
                <nested-menu :items="item.subItems" :depth="depth + 1" />
            </v-list-group>

            <template v-else>
                <v-list-item v-if="isShow(item)" v-bind="{ ...getLink(item), ...isDisabled(item) }">
                    <v-list-item-icon v-if="depth === 0">
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title :style="{'padding-left' : depth == 1 ? '16px' : '0px'}" >
                        <div>{{ item.title }}</div>
                    </v-list-item-title>
                </v-list-item>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
    name: "NestedMenu",
    props: {
        items: {
            type: Array,
            required: true,
        },
        depth : {
            type: Number,
            default: 0,
        }
    },
    computed : {
        ...mapState( {
            menuHide : state => state.config.menuHide
        }),
        ...mapGetters('user',['GRANT']),
    },
    methods : {
        getLink(item) {
            if (item.newTab) {
                return {
                    href : item.to,
                    target : '_blank'
                };
            } else {
                return {
                    to: item.to
                };
            }
        },
        activeStyle(active) {
            return { transform: active ? "rotate(180deg)" : "rotate(360deg)" }
        },
        isDisabled(item) {
            const disabled = !item.to || item.grant > this.GRANT;
            return { disabled };
            
        },
        isShow(item) {
            const { disabled } = this.isDisabled(item);
            // 아이템 개별
            if (item.isHide) {
                return false;
            }
            // 전체
            if (disabled) {
                return !this.menuHide;
            } else {
                return true;
            }
        }
    }
}
</script>

<style>

</style>