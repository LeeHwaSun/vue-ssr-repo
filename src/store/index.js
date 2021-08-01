import Vue from 'vue'
import Vuex from 'vuex'
import modules from "./modules";

Vue.use(Vuex)

export function createStore() {
  const store = new Vuex.Store({
    state: {
      config: {
        title : "My Diary Home",
        footer : "Lee Hwa Seon all right reserved.",
        menu: [
          {
            title : "Home",
            icon : "mdi-home",
            to: '/',
            grant: 0,
            newTab : false,
            subItems : [
              {
                title : "menu1",
                icon : "",
                to: '/menu1',
                grant: 0,
                newTab : false,
                subItems : [
                  {
                    title : "menu1-1",
                    icon : "",
                    to: '/menu1-1',
                    grant: 0,
                    newTab : false,
                    subItems : []
                  },
                  {
                    title : "menu1-2",
                    icon : "",
                    to: '/menu1-2',
                    grant: 0,
                    newTab : false,
                    subItems : []
                  }
                ]
              },
              {
                title : "menu2",
                icon : "",
                to: '/menu2',
                grant: 0,
                newTab : false,
                subItems : []
              }
            ]
          },
          {
            title : "About",
            icon : "mdi-help",
            to: '/about',
            grant: 0,
            newTab : false,
            subItems : []
          }
        ],
      }
    },
    mutations: {
    },
    actions: {
    },
    modules
  });
  return store;
}