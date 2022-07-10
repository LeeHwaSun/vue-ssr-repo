import Vue from 'vue';
import axios from 'axios';

export const state = () => ({
    config : null,
    list : [],
    totalItems : 0,
    detail : null,
    latest: {},
});

export const mutations = {
    SET_CONFIG(state, config) {
        state.config = config;
    },
    SET_LIST(state, { items, totalItems }) {
        state.list = items;
        state.totalItems = totalItems;
    },
    SET_DETAIL(state, detail) {
        state.detail = detail;
    },
    VIEW_UP(state) {
        if (state.detail) {
            state.detail.wr_view++;
        }
    },
    SET_LATEST(state, { table, payload }) {
        Vue.set(state.latest, table, payload);
    }
};

let axiosToken = {
    axiosSource : null,
}
export const actions = {
    async getBoardConfig({ commit }, table) {
        const { $axios } = Vue.prototype; 
        const data = await $axios.get(`/api/board/config/${table}`);
        if (data) {
            commit('SET_CONFIG', data);
        }
    },
    async getBoardList({ commit }, { vm, query, headers }) {
        const { $axios } = Vue.prototype;
        const { table } = vm;
        if (axiosToken.axiosSource) {
            axiosToken.axiosSource.cancel("fetchData 취소");
        }

        axiosToken.axiosSource = axios.CancelToken.source();
        try {
            const data = await $axios.get(
                `/api/board/list/${table}?${query}`, 
                { headers, cancelToken : axiosToken.axiosSource.token }
            );
            if (data) {
                commit('SET_LIST', data);
                vm.pushState();
                vm.pageReady = true;
                vm.pageRouting = false;
            }
        } catch (e) {
            console.log("request cancel >", e.message);
        }
    },
    async getBoardDetail({ commit }, { table, id, headers }) {
        const { $axios } = Vue.prototype;
        const data = await $axios.get(
            `/api/board/detail/${table}/${id}`, 
            { headers }
        );
        if (data) {
            commit('SET_DETAIL', data);
        }
    },
    async getContentsDetail({ commit }, { wr_1, headers }) {
        const { $axios } = Vue.prototype;
        const data = await $axios.get(
            `/api/contents/${wr_1}`, 
            { headers }
        );
        if (data) {
            commit('SET_DETAIL', data);
        }
    },
    async getLatest({ commit }, { table, limit }) {
        const { $axios } = Vue.prototype;
        const data = await $axios.get(`/api/board/latest/${table}?limit=${limit}`);
        /*
        latest : {table : {subject : "제목", items : []}}
        */
        if (data) {
            commit('SET_LATEST', { table, payload: data });
        }
    }
};
