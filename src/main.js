import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from "vuex-router-sync"
//import router from './router'
//import store from './store'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

export function createApp(ctx) {
  const router = createRouter();
  const store = createStore();
  sync(store, router);

  const app = new Vue({
    data: { url: ctx ? ctx.url : '' },
    router,
    store,
    vuetify,
    render: h => h(App)
  });

  return { app, router, store };
}
/*new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')*/
