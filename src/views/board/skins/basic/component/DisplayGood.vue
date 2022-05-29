<template>
    <div v-bind="$attrs">
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <v-btn 
                    v-on="on" 
                    v-bind="{ ...attrs, ...btnProps }"
                    :color="goodColor"
                    @click="goodUpdate(1)"
                >
                    <v-icon left>{{ icon.good }}</v-icon>
                    {{ good }}
                </v-btn>
            </template>
            <span>{{ label.good }}</span>
        </v-tooltip>
        <v-tooltip v-if="!goodOnly" top>
            <template v-slot:activator="{ on, attrs }">
                <v-btn 
                    v-on="on" 
                    v-bind="{ ...attrs, ...btnProps }"
                    :color="badColor"
                    @click="goodUpdate(2)"
                >
                    <v-icon left>{{ icon.bad }}</v-icon>
                    {{ bad }}
                </v-btn>
            </template>
            <span>{{ label.bad }}</span>
        </v-tooltip>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name : "DisplayGood",
    props : {
        item : {
            type : Object,
            required : true,
        },
        table : {
            type : String,
            required : true,
        },
        btnProps : {
            type : Object,
            default : null,
        },
        icon : {
            type : Object,
            default : () => ({
                good : "mdi-heart-outline",
                bad : "mdi-heart-broken-outline"
            }),
        },
        label : {
            type : Object,
            default : {
                good : "좋아요",
                bad : "싫어요"
            }
        },
        goodOnly : {
            type : Boolean,
            default : false,
        }
    },
    data() {
        return {
            goodFlag : this.item.goodFlag,
            good : this.item.good,
            bad : this.item.bad,
        }
    },
    computed : {
        ...mapState('user', ['user']),
        goodColor() {
            return this.goodFlag == 1 ? 'primary' : '';
        },
        badColor() {
            return this.goodFlag == 2 ? 'error' : '';
        }
    },
    methods : {
        async goodUpdate(brd_good_flag) {
            if (!this.user) {
                this.$toast.error('회원만 사용 할 수 있습니다.');
                return;
            }
            let data;
            if (brd_good_flag == this.goodFlag) {
                // 좋아요 삭제
                data = await this.$axios.delete(`/api/good/${this.table}/${this.item.wr_id}`);
            } else {
                // 좋아요 변경
                data = await this.$axios.post(`/api/good/${this.table}/${this.item.wr_id}`, { brd_good_flag });
            }

            if (data) {
                this.goodFlag = data.goodFlag;
                this.good = data.good;
                this.bad = data.bad;
            }
        },
    }
}
</script>

<style>

</style>