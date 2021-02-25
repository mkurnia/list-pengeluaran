import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import vueStore from './store'
import VueMoment from 'vue-moment'
import moment from 'moment'
import VueCurrencyFilter from 'vue-currency-filter'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import './assets/scss/main.scss'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueMoment, {
  moment,
})
Vue.use(VueCurrencyFilter,
{
  symbol : 'Rp',
  thousandsSeparator: '.',
  fractionCount: 0,
  fractionSeparator: ',',
  symbolPosition: 'front',
  symbolSpacing: true,
  avoidEmptyDecimals: undefined,
})

const store = new Vuex.Store(vueStore)

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
