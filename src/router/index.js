import Vue from 'vue'
import Router from 'vue-router'
import Database from '@/view/Database'




Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'database',
      component: Database,
      meta: {
        requiredAuth: false
      }
    }
  ]
})
    