<template>
    <div id="app">
        <router-link to="/vacancy/1" v-if="$route.path === '/'"
                     style="display: block; font-size: 2rem; margin-top: 10rem; text-align:center">
            Test Vacancy
        </router-link>
        <router-view></router-view>
    </div>
</template>

<script>
  export default {
    name: 'app'
  };
</script>
