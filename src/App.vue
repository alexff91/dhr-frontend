<template>
    <div id="app">
        <div v-if="$route.path === '/'">
            <el-input v-model="demoVacancy" placeholder="Введите номер вакансии"
                      style="display: block; font-size: 2rem; margin-top: 10rem; text-align:center" />
            <el-button type="success" style="margin:auto; font-size: 2rem; display: block; text-align:center">
                <router-link to="/vacancy/49c88bec" v-if="!demoVacancy">
                    Test Vacancy
                </router-link>
                <router-link :to="{ path: '/vacancy/'+demoVacancy }" v-if="demoVacancy">
                    To Vacancy {{demoVacancy}}
                </router-link>
            </el-button>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        demoVacancy: null
      };
    }
  };
</script>
