import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue')
  },
  {
    path: '/Pagamento',
    name: 'Pagamento',
    component: () => import(/* webpackChunkName: "Pagamento" */ '../views/Pagamento.vue')
  },
  {
    path: '/Connessione',
    name: 'Connessione',
    component: () => import(/* webpack "Connessione" */ '../views/Connessione.vue')
  },
  {
    path: '/Database',
    name: 'Database',
    component: () => import(/* webpack "Database" */ '../views/Database.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
