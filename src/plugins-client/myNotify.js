import Vue from "vue";
import vuetify from "../plugins/vuetify";
import myNotifyPlugin from "./myNotifyPlugin/myNotifyPlugin";

const options = {
    width : 400,
}

Vue.use(myNotifyPlugin, vuetify, options);