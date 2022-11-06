import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import VueApexCharts from 'vue-apexcharts'
import './registerServiceWorker'

axios.defaults.baseURL = process.env.VUE_APP_WEIGHT_API_URL
Vue.use(VueAxios, axios)
Vue.use(VueCookies)
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
