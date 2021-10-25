import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'material-icons/iconfont/material-icons.css';
import 'vue-material/dist/theme/default.css';
import 'vue-material/dist/theme/default-dark.css';
import Vuesax from 'vuesax';
import 'vuesax/dist/vuesax.css'; //Vuesax styles
import router from './router';


Vue.use(Vuesax);
Vue.use(VueMaterial);
Vue.use(BootstrapVue);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')