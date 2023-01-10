import Vue from 'vue'
import App from './App.vue'

import vueDebounce from 'vue-debounce'

// Routes
import router from './routes'

Vue.use(vueDebounce)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})