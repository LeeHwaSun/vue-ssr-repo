import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from "vuex-router-sync"
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import plugins from './plugins';

import Mixins from './mixins';

Vue.config.productionTip = false

export function createApp(ctx) {
  const router = createRouter();
  const store = createStore();
  sync(store, router);

  const mixins = Object.keys(Mixins);
  for (const mixin of mixins) {
    Vue.mixin(Mixins[mixin]);
  }

  const app = new Vue({
    data: { url: ctx ? ctx.url : '' },
    router,
    store,
    vuetify : plugins.vuetify,
    render: h => h(App)
  });

  return { app, router, store };
}
