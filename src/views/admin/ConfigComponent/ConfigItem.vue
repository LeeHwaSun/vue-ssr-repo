<template>
    <li v-if="user">
        <v-icon class="handle">mdi-drag</v-icon>
        <div>
            <div>
                <div>
                    <b>{{ item.cfg_name }}</b>
                </div>
                <div><pre class="comment" v-html="item.cfg_comment"></pre></div>
                <div>
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-avatar v-on="on" v-bind="attrs" color="primary" dark size="32">
                                <span class="white--text">{{ item.cfg_level }}</span>
                            </v-avatar>
                        </template>
                        <span>접근 레벨</span>
                    </v-tooltip>
                </div>
                <div>
                    <v-btn @click="$emit('update', item)" icon :disabled="isGrant"><v-icon>mdi-pencil</v-icon></v-btn>
                </div>
            </div>
            <div>
                <div>
                    <b>{{ item.cfg_key }}</b>
                </div>
                <div>
                    <type-value :fieldType="item.cfg_type" :value="item.cfg_val" :readonly="true" />
                </div>
                <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                        <div class="client" v-on="on" v-bind="attrs">
                            <v-checkbox
                                v-model="item.cfg_client" 
                                readonly 
                                hide-details 
                                dense></v-checkbox>
                        </div>
                    </template>
                    <span>클라이언트 접근유무</span>
                </v-tooltip>
                <div>
                    <v-btn @click="$emit('remove', item)" icon :disabled="isGrant"><v-icon>mdi-delete</v-icon></v-btn>
                </div>
            </div>
        </div>
    </li>
</template>

<script>
import { mapState } from 'vuex';
import TypeValue from './TypeValue.vue';
export default {
    components : { TypeValue, },
    name : "ConfigItem",
    props : {
        item : {
            type : Object,
            required : true,
        }
    },
    computed : {
        ...mapState({
            user : state => state.user.user,
        }),
        isGrant() {
            return this.item.cfg_level > this.user.user_level;
        }
    }
}
</script>

<style>

</style>