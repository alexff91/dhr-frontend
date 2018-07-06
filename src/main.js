/* eslint-disable */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueYandexMetrika from 'vue-yandex-metrika';
import VueAnalytics from 'vue-analytics';
import { Button, Col, Container, Form, FormItem, Header, Input, Main, Row, Step, Steps } from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/styles/main.scss';

Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Row);
Vue.use(Col);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

Vue.config.productionTip = false;

Vue.use(VueAnalytics, {
  id: 'UA-99302694-2',
  router
});

Vue.use(VueYandexMetrika, {
  id: 49469917,
  router: router,
  env: process.env.NODE_ENV,
  options: {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true
  }
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
