import { createApp } from './main';
import plugins from './plugins-client';

const { app, router, store } = createApp();

function addStyle(href) {
    const style = document.createElement('link');
    style.href = href;
    style.rel = 'stylesheet';
    style.type = 'text/css';
    document.head.append(style);
}

addStyle('/css/style.css');
addStyle('/css/ez-tiptap.min.css');

router.onReady(() => {
    app.$mount('#app');
});