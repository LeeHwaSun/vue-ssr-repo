import myNotifyInterface from "./myNotifyInterface.vue";

const defaultOptions = {
    width: 400,
    icon: "",
    iconColor: "orange",
    type: "alert",
    text: ""
};

export default {
    install(Vue, vuetify, options) {
        const Construct = Vue.extend(myNotifyInterface);
        const Instance = new Construct({
            vuetify : vuetify,
            data: {
                options : Object(defaultOptions, options),
            }
        });
        Vue.prototype.$nextTick(() => {
            Vue.prototype.$myNotify = Instance.$mount();
            document.getElementById('app').appendChild(Instance.$el);
        })
    }
}
