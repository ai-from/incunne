import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuebar from 'vuebar'

Vue.config.productionTip = false
Vue.use(Vuebar)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
