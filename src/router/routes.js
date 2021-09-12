import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/user/Login.vue'
import Join from '../views/user/Join.vue'
import Error from '../views/Error.vue'
import ModifyPassword from '../views/user/ModifyPassword.vue';

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
        //component: () => import(/* webpackChunkName: "Login" */ '../views/user/Login.vue')
        component: Login
    },
    {
        path: '/join',
        name: 'NoAuthJoin',
        //component: () => import(/* webpackChunkName: "Join" */ '../views/user/Join.vue')
        component: Join
    },
    {
        path: '/modifyPassword/:hash',
        name: 'NoAuthModiftPassword',
        //component: () => import(/* webpackChunkName: "modifyPassword" */ '../views/user/ModifyPassword.vue')
        component: ModifyPassword
    },
    {
        path: '*',
        name: 'Error',
        //component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue')
        component: Error
    },
    
  ]

  export default routes;