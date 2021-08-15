import Vue from "vue";

export const state = () => ({
    user : null,

});

export const mutations = {

};

export const getters = {

};

export const actions = {
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
        console.log('loginUserLocal ', data);
        return data;
    }
};