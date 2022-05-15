import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes';
import store from '../store';
import { LV, LV_LABEL } from '../../util/level';

Vue.use(VueRouter)

export function createRouter() {
  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  });

  router.beforeEach(async (to, from, next) => {
    const { $Progress, $toast } = Vue.prototype;

    if ( $Progress ) $Progress.start();

    if (typeof(window) == 'object') {
      if (!store.state.appReady) {
        if (window.__INITIAL_STATE__) {
          store.replaceState(window.__INITIAL_STATE__);
        } else {
          await store.dispatch('appInit');
        }
      }
    }

    const access = store.getters.access;
    const GRANT = store.getters['user/GRANT'];
    const isUser = !!store.state.user.user;

    let msg = '';
    if (to.name.startsWith('NoAuth') && isUser) {
      // 비회원인 경우에만 접근
      msg = "이미 로그인 되어있습니다."
    } else if (to.name.startsWith('Adm') && GRANT < LV.ADMIN) {
      // 관리자 전용 페이지
      msg = `${LV_LABEL(LV.ADMIN)} 이상 접근 가능합니다.`;
    } else {
      // 메뉴 접근 레벨에 따름
      const accessLv = access[to.path] || LV.BLOCK;
      if (accessLv > GRANT) {
        msg = `${LV_LABEL(accessLv)} 이상 접근 가능합니다.`;
      }
    }

    if (msg) {
      // 접근 차단
      if ( $toast ) $toast.error(msg);
      if ( $Progress ) $Progress.fail();
      if ( from.name ) { // 이전 경로가 있으면 라우팅 동작 안함
        return isUser ? next('/') : next(false);
      } else { // 이전 경로가 없으면 홈 또는 로그인 페이지로 이동
        return isUser ? next('/') : next({
          name : 'NoAuthLogin',
          query : { nextUrl : to.fullPath }
        });
      }
    } else {
      // 통과
      if ( $Progress ) $Progress.finish();
      next();
    }

    /*if ( $Progress ) $Progress.finish();
      next();*/
  });

  router.afterEach((to, from) => {

  });

  return router;
}