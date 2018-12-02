import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'

//有赞UI
import Vant from 'vant';
import 'vant/lib/index.css';

//签名
import vueSignature from "vue-signature"
Vue.use(Vant);
Vue.use(vueSignature)

//图标样式
import './assets/icon/iconfont.css'
//localStorage
import storage from '@/assets/js/storage';

Vue.prototype.HOME ="/apis"
Vue.prototype.$axios = axios
Vue.prototype.$storage = storage





Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
