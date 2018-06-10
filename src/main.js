/* eslint-disable */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueAnalytics from 'vue-analytics';
import { Container, Header, Main, Row, Col, Steps, Step, Form, FormItem, Input, Button } from 'element-ui';

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

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
