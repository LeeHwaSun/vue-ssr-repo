import { createApp } from './main';
import './plugins-client';

const { app, router, store } = createApp();

router.onReady(() => {
    app.$mount('#app');
});