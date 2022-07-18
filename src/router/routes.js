import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
        //component: About
    },
    {
        path: '/login',
        name: 'NoAuthLogin',
        component: () => import(/* webpackChunkName: "Login" */ '../views/user/Login.vue')
        //component: Login
    },
    {
        path: '/join',
        name: 'NoAuthJoin',
        component: () => import(/* webpackChunkName: "Join" */ '../views/user/Join.vue')
        //component: Join
    },
    {
        path: '/modifyPassword/:hash',
        name: 'NoAuthModiftPassword',
        component: () => import(/* webpackChunkName: "modifyPassword" */ '../views/user/ModifyPassword.vue')
        //component: ModifyPassword
    },
    {
        path: '/adm/config',
        name: 'AdmConfig',
        component: () => import(/* webpackChunkName: "admConfig" */ '../views/admin/Config.vue')
        //component: Config
    },
    {
        path: '/adm/user',
        name: 'AdmUser',
        component: () => import(/* webpackChunkName: "admUser" */ '../views/admin/User.vue')
        //component: User
    },
    {
        path: '/adm/menu',
        name: 'AdmMenu',
        component: () => import(/* webpackChunkName: "admMenu" */ '../views/admin/Menu.vue')
        //component: Menu
    },
    {
        path: '/adm/board/*',
        name: 'AdmBoard',
        component: () => import(/* webpackChunkName: "admBoard" */ '../views/admin/BoardRenderer.vue')
        //component: BoardRenderer
    },
    {
        path: '/board/*',
        name: 'Board',
        component: () => import(/* webpackChunkName: "board" */ '../views/board/Board.vue')
        //component: BoardRenderer
    },
    {
        path: '/contents/:wr_1',
        name: 'Contents',
        component: () => import(/* webpackChunkName: "contentsRenderer" */ '../views/contents/ContentsRenderer.vue')
        //component: BoardRenderer
    },
    {
        path: '/testPage',
        name: 'Test',
        component: () => import(/* webpackChunkName: "Test" */ '../views/Test.vue')
    },
    {
        path: '*',
        name: 'Error',
        component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue')
        //component: Error
    },
    
  ]

  export default routes;