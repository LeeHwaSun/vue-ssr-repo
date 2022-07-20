<template>
    <v-card :width="calculateWidth ? '50%' : '100%'">
        <v-card-title>
            {{ subject }}
            <v-spacer />
            <v-btn :to="`/board/${table}`" fab x-small>
                <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
        </v-card-title>
        <v-list v-if="items.length" >
            <div v-for="item in items" :key="item.wr_id">
                <v-divider />
                <v-list-item :to="`/board/${table}/${item.wr_id}`">
                    <v-chip 
                        v-if="item.wr_category" 
                        outlined 
                        small 
                        color="primary" 
                        class="mr-4" 
                        label
                    >
                        {{ item.wr_category }}
                    </v-chip>
                    <v-list-item-content>
                        <div class="text-truncate">
                            {{ item.wr_title }}
                            <v-chip small label color="transparent" class="ml-2">
                                <v-icon x-small left>mdi-message</v-icon>
                                {{ item.replys }}
                            </v-chip>
                        </div>
                    </v-list-item-content>
                    <v-list-item-action-text>
                        <v-icon small>mdi-account</v-icon>
                        {{ item.wr_name }}
                        <v-icon v-if="!isXs" class="ml-2" small>mdi-clock-outline</v-icon>
                        <display-time v-if="!isXs" :time="item.wr_create_at" />
                    </v-list-item-action-text>
                </v-list-item>
            </div>
        </v-list>
        <v-list v-else>
            <v-divider/>
            <v-list-item>
                <v-list-item-content>
                    <div class="d-flex justify-center align-center" style="height: 200px;">
                        등록된 데이터가 없습니다.
                    </div>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <!-- <span v-else>
            <div><v-divider /></div>
            <div class="d-flex justify-center align-center" style="height: 200px;">
                데이터가 없습니다.
            </div>
        </span> -->
    </v-card>
</template>

<script>
import DisplayTime from '../../../layout/common/DisplayTime.vue';
export default {
    components: { DisplayTime },
    name: "BasicLatest",
    props: {
        table : {
            type : String,
            required : true,
        },
        subject : {
            type : String,
            required : true,
        },
        items : {
            type : Array,
            required : true,
        },
        loading : {
            type : Boolean,
            default : false,
        },
        isDivided : {
            type : Boolean,
            default : false
        }
    },
    computed: {
        calculateWidth() {
            if (this.isDivided) {
                return true;
            }
            return false;
        },
        isXs() {
            return this.$vuetify.breakpoint.xs ? true : false;
        }
    },
}
</script>

<style>

</style>