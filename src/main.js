import Vue from 'vue'
import Buefy from 'buefy'
import '@mdi/font/css/materialdesignicons.css'
import 'buefy/dist/buefy.css'

import App from './App.vue'

Vue.config.productionTip = false;
Vue.use(Buefy);

new Vue({
  render: h => h(App),
}).$mount('#app');
