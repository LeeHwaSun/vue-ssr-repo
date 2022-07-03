<template>
    <div>
        <popup-view 
            v-for="(item, index) in items" 
            table="popup" 
            :item="item" 
            :key="item.wr_id"
            :idx="index"
            @onClose="popupClose(item)"
        />
    </div>
</template>

<script>
import VueCookies from 'vue-cookies';
import PopupView from './PopupView.vue';
export default {
    components: { PopupView },
    name: "PopupOpener",
    data() {
        return {
            items: [],
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const cookieNames = VueCookies.keys();
            const ignores = cookieNames
                .filter(name => name.startsWith('pop'))
                .map(name => name.split('-')[1])
                .join(',');
            const data = await this.$axios.get(`/api/board/popup-list?ignores=${ignores}`);
            if (data) {
                this.items = data;
            }
        },
        popupClose(item) {
            const idx = this.items.indexOf(item);
            this.items.splice(idx, 1);
        }
    },
}
</script>

<style>

</style>