import Vue from 'vue'
import App from './App.vue'

// Routes
import router from './routes'

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})