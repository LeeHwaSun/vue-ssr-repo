import Vue from "vue";
import qs from 'qs';

export const state = () => ({
    user : null,
    token : null,
});

export const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
    SET_TOKEN(state, token) {
        state.token = token;
    }
};

export const getters = {

};

export const actions = {
    async initUser({ commit }) {
        const { $axios } = Vue.prototype;
        const data = await $axios.get('/api/user/auth');
        if (data && data.user && data.token) {
            commit('SET_USER', data.user);
            commit('SET_TOKEN', data.token);
        }
    },
    async duplicateCheck(ctx, { field, value }) {
        const { $axios } = Vue.prototype;
        const data = await $axios.get(`/api/user/duplicateCheck/${field}/${value}`);
        return data;
    },
    async createUser(ctx, form) {
        const { $axios } = Vue.prototype;
        const data = await $axios.post(`/api/user/`, form);
        return data;
    },
    async loginUserLocal({ commit }, form) {
        const { $axios } = Vue.prototype;
        const data = await $axios.post(`/api/user/loginUserLocal`, form);
        if (data && data.user) {
            commit('SET_USER', data.user);
            commit('SET_TOKEN', data.token);
        }
        return !!data;
    },
    async logout({ commit, state }) {
        const user_name = state.user.user_name;
        const { $axios } = Vue.prototype;
        await $axios.get('/api/user/logout');
        commit("SET_USER", null);
        commit('SET_TOKEN', null);
        return user_name;
    },
    async findIDLocal(ctx, form) {
        const { $axios } = Vue.prototype;
        const query = qs.stringify(form);
        const data = await $axios.get(`/api/user/findID?${query}`);
        return data;
    },
    async findPasswordLocal(ctx, form) {
        const { $axios } = Vue.prototype;
        const query = qs.stringify(form);
        const data = await $axios.get(`/api/user/findPassword?${query}`);
        return data;
    }
};