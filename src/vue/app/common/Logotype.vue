<template>
  <router-link to='/dashboard' class="logotype">
    <img class="logotype__img" src="/static/images/logo.svg" alt="Logotype">
  </router-link>
</template>

<script>
  export default {
    name: 'tokend-logo'
  }
</script>

<style scoped>
.logotype {
  width: 100%;
}

.logotype__img {
  width: 65%;
}
</style>
