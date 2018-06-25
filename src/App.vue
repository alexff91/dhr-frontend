<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>

  export default {
    name: 'app',
    data() {
      return {};
    }
  };
</script>

<style lang="scss" scoped>
    h1 {
        margin: 0 0 2rem;
        font-weight: 500;
    }

    .demo-container {
        width: 95%;
        max-width: 768px;
        margin: 1rem auto 0;
        padding: 40px;
        background-color: #fff;
        box-shadow: 0 4px 70px -18px #707070;
    }

    ul {
        padding-left: 1.5rem;

        .vacancy-link {
            font-size: 22px;
            margin-bottom: 6px;
            display: block;
            color: #409EFF;
        }
    }
</style>