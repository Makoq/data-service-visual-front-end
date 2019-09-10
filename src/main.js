import Vue from 'vue';
import VueDraggableResizable from 'vue-draggable-resizable';
import VueDragResize from 'vue-drag-resize';
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
import VCharts from 'v-charts';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import './assets/font/iconfont.css';
import dayjs from 'dayjs';
import Axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store/index';
import http from './http';
// import initMock from '../mock';
import i18n from './assets/i18n';


// 需要 mock 数据时请打开注释
// initMock();

Vue.config.productionTip = false;
Vue.prototype.$http = http;
Vue.prototype.$dayjs = dayjs;
Vue.prototype.bus = new Vue();
Vue.prototype.$axios = Axios;
// 注册Vue插件
Vue.use(VCharts);
Vue.use(ElementUI);
Vue.use(dayjs);
// 注册Vue组件
Vue.component('vue-draggable-resizable', VueDraggableResizable);
Vue.component('vue-drag-resize', VueDragResize);

new Vue({
  router,
  store,
  i18n,
  Axios,
  render: h => h(App),
}).$mount('#app');
