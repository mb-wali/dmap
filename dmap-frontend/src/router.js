import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import MyDmps from './views/MyDmps.vue'
import Login from './views/Login.vue'
import Logout from './views/Logout.vue'
import DmpCreate from './views/DmpCreate'
import DmpShow from './views/DmpShow'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/mydmps',
      name: 'mydmps',
      component: MyDmps
    },
    {
      path: '/dmps/:id',
      name: 'dmp-show',
      component: DmpShow
    },
    {
      path: '/dmps/create',
      name: 'dmp-create',
      component: DmpCreate
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    }
  ]
})

export default router
