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
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import SKINS from './skins';
import BoardError from './BoardError.vue';

export default {
    components : { ...SKINS, BoardError, },
    name : "Board",
    data() {
        return {
            //config: null,
        }
    },
    computed : {
        ...mapState({
            config : state => state.board.config,
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
            //this.config = null;
            //this.fetchConfig();
            this.getBoardConfig(this.table);
        }
    },
    serverPrefetch() {
        return this.getBoardConfig(this.table);
    },
    mounted() {
        //this.fetchConfig();
        if (!this.config) {
            this.getBoardConfig(this.table);
        }
    },
    destroyed() {
        this.SET_CONFIG(null);
        this.SET_LIST({items: [], totalItems: 0});
        this.SET_DETAIL(null);
    },
    methods : {
        ...mapMutations('board', ['SET_CONFIG', 'SET_LIST', 'SET_DETAIL']),
        ...mapActions('board', ['getBoardConfig']),
    }
}
</script>

<style>

</style>