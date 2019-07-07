import Vue from 'vue';
import App from './App';
import router from '@/plugins/router';
import store from '@/plugins/store';
import '@/plugins/ui';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
