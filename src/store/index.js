import Vue from 'vue'
import Vuex from 'vuex'
import modules from "./modules";

Vue.use(Vuex)

function menuAccess(ref, arr) {
  arr.forEach(el => {
    ref[el.to] = el.grant;
    if (el.subItems && el.subItems.length) {
      menuAccess(ref, el.subItems);
    }
  });
}

const store = new Vuex.Store({
  state: {
    appReady : false,
    config: {},
  },
  mutations: {
    SET_APP_READY(state) {
      state.appReady = true;
    },
    SET_CONFIG(state, {key, value}) {
      try {
        value = JSON.parse(value);
      } catch (e) {}

      if (state.config[key]) {
        state.config[key] = value;
      } else {
        Vue.set(state.config, key, value);
      }
    }
  },
  getters : {
    access(state) {
      const obj = {};
      if (state.config.menu) {
        menuAccess(obj, state.config.menu);
      }
      return obj;
    }
  },
  actions: {
    async appInit({ dispatch, commit }, ctx) {
      // 사이트 설정을 가지고 올 예정
      if (ctx) {
        const keys = Object.keys(ctx.config);
        for (const key of keys) {
          commit('SET_CONFIG', { key, value : ctx.config[key] });
        }
        commit('user/SET_USER', ctx.user);
        commit('user/SET_TOKEN', ctx.token);
        if (ctx.member) {
          commit('socket/ROOM_JOIN', ctx.user.user_id);
        }
      } else {
        await dispatch('configLoad');
        await dispatch('user/initUser');
      }
      commit('SET_APP_READY');
    },
    async configDuplicateCheck(ctx, { field, value }) {
      const { $axios } = Vue.prototype;
      const data = await $axios.get(`/api/config/duplicateCheck/${field}/${value}`);
      return data;
    },
    async configSave(ctx, form) {
      const { $axios } = Vue.prototype;
      const data = await $axios.post('/api/config', form);
      return data;
    },
    async configLoad( { commit } ) {
      const { $axios } = Vue.prototype;
      const data = await $axios.get('/api/config');
      const keys = Object.keys(data);
      for (const key of keys) {
        commit('SET_CONFIG', {key, value : data[key]});
      }
    }
  },
  modules
});

export function createStore() {
  return store;
}

export default store;