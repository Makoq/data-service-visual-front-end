
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import locale from 'element-ui/lib/locale';
import messages from './langs'; // 默认导出index.js

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: localStorage.lang == undefined ? 'zh_CN' : localStorage.lang,
  messages,
});

locale.i18n((key, value) => i18n.t(key, value)); // 为了实现element插件的多语言切换

export default i18n;
