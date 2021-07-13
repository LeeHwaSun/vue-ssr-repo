import Vue from "vue";
import vuetify from "../plugins/vuetify";
import myNotify from "./myNotifyPlugin";

const options = {
    iconColor: 'red',
}

Vue.use(myNotify, vuetify, options);