import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import VueApexCharts from 'vue-apexcharts'

Vue.use(VueAxios, axios)
Vue.use(VueCookies)
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

// Redirect to login screen if not logged in (i.e. does not have JWT in cookies)
/*
router.beforeEach((to, from, next) => {

  if(Vue.$cookies.get("jwt")) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${Vue.$cookies.get('jwt')}`
  }
  else {
    delete axios.defaults.headers.common['Authorization']
    window.location.href = process.env.VUE_APP_AUTHENTICATION_FRONT_URL
  }

  next();

});
*/

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
