import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/user/Login.vue'
import Join from '../views/user/Join.vue'
import Error from '../views/Error.vue'
import ModifyPassword from '../views/user/ModifyPassword.vue';
import Config from '../views/admin/Config.vue';
import User from '../views/admin/User.vue';
import Menu from '../views/admin/Menu.vue';

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
        path: '/adm/config',
        name: 'AdmConfig',
        //component: () => import(/* webpackChunkName: "admConfig" */ '../views/admin/Config.vue')
        component: Config
    },
    {
        path: '/adm/user',
        name: 'AdmUser',
        //component: () => import(/* webpackChunkName: "admUser" */ '../views/admin/User.vue')
        component: User
    },
    {
        path: '/adm/menu',
        name: 'AdmMenu',
        //component: () => import(/* webpackChunkName: "admMenu" */ '../views/admin/Menu.vue')
        component: Menu
    },
    {
        path: '*',
        name: 'Error',
        //component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue')
        component: Error
    },
    
  ]

  export default routes;