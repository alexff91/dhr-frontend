import Vue from 'vue';
import Router from 'vue-router';
import Vacancy from '../Views/Vacancy/Index';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: '/demo/',

  routes: [
    {
      path: '/vacancy/:vacancyId',
      component: Vacancy
    }
  ]
});

export default router;