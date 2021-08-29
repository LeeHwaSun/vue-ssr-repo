import { createApp } from './main';

export default (ctx) => {
    return new Promise(async (resolve, reject) => {
        const { app, router, store } = createApp();
        await store.dispatch('appInit', ctx.user);
        router.push(ctx.url);
        router.onReady(() => {
            ctx.rendered = () => ctx.state = store.state;
            const matchedComponents = router.getMatchedComponents();
            if (matchedComponents.length === 0) {
                return reject({ code: 404 });
            }
            return resolve(app);
        }, reject);
    });
}