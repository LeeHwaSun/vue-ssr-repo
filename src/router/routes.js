import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/member/Login.vue'
import Join from '../views/member/Join.vue'
import Error from '../views/Error.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        //component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
        component: About
    },
    {
        path: '/login',
        name: 'NoAuthLogin',
        //component: () => import(/* webpackChunkName: "Login" */ '../views/member/Login.vue')
        component: Login
    },
    {
        path: '/join',
        name: 'NoAuthJoin',
        //component: () => import(/* webpackChunkName: "Join" */ '../views/member/Join.vue')
        component: Join
    },
    {
        path: '*',
        name: 'Error',
        //component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue')
        component: Error
    }
  ]

  export default routes;