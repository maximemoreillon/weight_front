import Vue from 'vue'
import VueRouter from 'vue-router'
import Weight from '../views/WeightApex.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Weight
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
