<template>
    <component 
        :is="curSkin"
        :config="config"
        :access="access"
        :id="wr_id"
    />
</template>

<script>
import upperFirst from 'lodash/upperFirst';
import { mapGetters, mapState, mapMutations } from 'vuex';
import SKINS from './skins';
import BoardError from './BoardError.vue';

export default {
    components : { ...SKINS, BoardError, },
    name : "Board",
    data() {
        return {
            config: null,
        }
    },
    computed : {
        ...mapState({
            initData : state => state.initData,
        }),
        ...mapGetters({
            GRANT : 'user/GRANT',
        }),
        pathMatch() {
            return this.$route.params.pathMatch.split('/');
        },
        table() {
            return this.pathMatch[0];
        },
        wr_id() {
            return this.pathMatch[1];
        },
        action() {
            if (this.wr_id) {
                return this.$route.query.act || 'read';
            } else {
                return this.$route.query.act || 'list';
            }
        },
        access() {
            if (this.config) {
                return {
                    list : this.GRANT >= this.config.brd_list_level,
                    read : this.GRANT >= this.config.brd_read_level,
                    write : this.GRANT >= this.config.brd_write_level,
                    reply : this.GRANT >= this.config.brd_reply_level,
                    comment : this.GRANT >= this.config.brd_comment_level,
                    download : this.GRANT >= this.config.brd_download_level,
                }
            }
            return null;
        },
        curSkin() {
            if (this.config) {
                const prefix = upperFirst(this.config.brd_skin);
                if (this.action === 'list' && this.access.list) {
                    return `${prefix}List`;
                } else if (this.access.write && this.action === 'write') {
                    return `${prefix}Form`;
                } else if (this.access.write && this.action === 'reply') {
                    return `${prefix}Form`;
                } else if (this.wr_id && this.action === 'read' && this.access.read) {
                    return `${prefix}Detail`;
                } else {
                    return 'BoardError';
                }
            }
            return 'BoardError';
        }
    },
    watch : {
        table() {
            this.config = null;
            this.fetchConfig();
        }
    },
    mounted() {
        //this.fetchConfig();
        console.log('initData', this.initData);
    },
    /*syncData() {
        if (this.initData && this.initData.config) {
            return this.setConfig(this.initData.config);
        } else {
            return this.fetchConfig();
        }
    },*/
    methods : {
        ...mapMutations(['SET_INITDATA']),
        async fetchConfig() {
            const data = await this.$axios.get(`/api/board/config/${this.table}`);
            if (this.$ssrContext) {
                console.log('SET_INITDATA', data.brd_table);
                this.SET_INITDATA({ config : data });
            }
            this.setConfig(data);
        },
        setConfig(data) {
            if (data) {
                this.config = data;
            }
        }
    }
}
</script>

<style>

</style>