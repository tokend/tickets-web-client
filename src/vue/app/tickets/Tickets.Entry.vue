<template>
  <router-view/>
</template>

<script>
  import RouteEntryMixin from '@/vue/common/mixins/route-entry'

  export default {
    mixins: [RouteEntryMixin],
    data: _ => ({
      routes: [
        { path: '/tokens/explore', label: 'Explore tokens' }
      ]
    })
  }
</script>

<style scoped>

</style>
