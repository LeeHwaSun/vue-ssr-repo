<template>
    <div class="pop-wrap elevation-9" :style="wrapStyle">
        <v-btn v-bind="linkAttrs" text block height="auto">
            <img :src="popImg" :alt="item.wr_title" :width="width" :height="height"/>
        </v-btn>
        <div class="d-flex px-2 align-center">
            <v-checkbox 
                v-model="isCheck" 
                :label="`${expire}일간 보지 않기`" 
                dense 
                dark 
                hide-details
                style="position: relative; top: -4px;"
            ></v-checkbox>
            <v-spacer />
            <v-btn 
                x-small 
                icon 
                color="white" 
                @click="close"
                style="position: relative;"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
import { getImage } from '../../../../../../util/lib';
export default {
    name: "PopupView",
    props: {
        item : {
            type : Object,
            required : true
        },
        table : {
            type : String,
            required : true
        }
    },
    data() {
        return {
            isCheck : false,
        }
    },
    computed : {
        top() {
            return parseInt(this.item.wr_6);
        },
        left() {
            return parseInt(this.item.wr_7);
        },
        width() {
            return parseInt(this.item.wr_8);
        },
        height() {
            return parseInt(this.item.wr_9);
        },
        link() {
            return this.item.wr_5;
        },
        expire() {
            return this.item.wr_1;
        },
        wrapStyle() {
            return {
                left : this.left + 'px', 
                top: this.top + 'px',
                width: this.width + 'px',
                height : (this.height + 30) + 'px'
            }
        },
        imgStyle() {
            return {
                width : '100%'
            }
        },
        popImg() {
            return getImage(this.item, this.table, {w : this.width, h : this.height});
        },
        linkAttrs() {
            if (this.link.startsWith('http')) {
                return {
                    href : this.link,
                    target : "_blank"
                }
            } else {
                return {
                    to: this.link,
                }
                
            }
        }
    },
    mounted() {
        console.log(this.item);
        console.log(this.popImg);
    },
    methods: {
        close() {
            this.$emit('onClose')
        }
    }
}
</script>

<style>
.pop-wrap { position: fixed; background: #333; overflow: hidden; z-index: 999; }
</style>