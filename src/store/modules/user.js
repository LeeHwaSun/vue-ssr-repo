import Vue from "vue";
import VueCookies from 'vue-cookies';

export const state = () => ({
    user : null,

});

export const mutations = {
    SET_USER(state, user) {
        state.user = user;
    }
};

export const getters = {

};

export const actions = {
    async initUser({ commit }) {
        const { $axios } = Vue.prototype;
        const user = await $axios.get('/api/user/auth');
        if (user) {
            commit('SET_USER', user);
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
            VueCookies.set('token', data.token);
        }
        return data;
    }
};