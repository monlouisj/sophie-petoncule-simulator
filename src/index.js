import Vue from 'vue'
import App from './components/App.vue'
import Chat from './vue-beautiful-chat/src/index.js'

Vue.use(Chat)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App)
})
