import Vue from "vue";
import qs from 'qs';
import { LV } from '../../../util/level';

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
    isAdmin(state) {
        if (state.user) {
            return state.user && state.user.user_level >= LV.ADMIN;
        }
    },
    isSuper(state) {
        if (state.user) {
            return state.user && state.user.user_level >= LV.SUPER;
        }
    },
    GRANT(state) {
        if (state.user) {
            return state.user.user_level;
        }
        return LV.BLOCK;
    }
};

export const actions = {
    async initUser({ commit, dispatch }) {
        const { $axios } = Vue.prototype;
        const data = await $axios.get('/api/user/auth');
        if (data && data.user && data.token) {
            commit('SET_USER', data.user);
            commit('SET_TOKEN', data.token);
            dispatch('socket/joinRoom', data.user.user_id, {root : true});
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
    async updateUser({ commit }, form) {
        const { $axios } = Vue.prototype;
        commit('SET_USER', null);
        const data = await $axios.patch(`/api/user/`, form);
        if (data) {
            commit('SET_USER', data);
        }
        return !!data;
    },
    async loginUserLocal({ commit, dispatch }, form) {
        const { $axios } = Vue.prototype;
        const data = await $axios.post(`/api/user/loginUserLocal`, form);
        if (data && data.user && data.token) {
            commit('SET_USER', data.user);
            commit('SET_TOKEN', data.token);
            dispatch('socket/joinRoom', data.user.user_id, {root : true});
        }
        return !!data;
    },
    async loginUserSocial({ commit, dispatch }, data) {
        commit('SET_USER', data.user);
        commit('SET_TOKEN', data.token);
        dispatch('socket/joinRoom', data.user.user_id, {root : true});
    },
    async checkPassword({ commit }, form) {
        const { $axios } = Vue.prototype;
        const data = await $axios.post(`/api/user/checkPassword`, form);
        return data;
    },
    async logout({ commit, state, dispatch }) {
        const user_name = state.user.user_name;
        const { $axios } = Vue.prototype;
        await $axios.get('/api/user/logout');
        dispatch('socket/leaveRoom', state.user.user_id, {root : true});
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
    },
    async modifyPassword(ctx, form) {
        const { $axios } = Vue.prototype;
        const data = await $axios.patch(`/api/user/modifyPassword`, form);
        return data;
    }
};