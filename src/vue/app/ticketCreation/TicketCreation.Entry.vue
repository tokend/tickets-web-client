<template>
  <router-view/>
</template>

<script>
  import RouteEntryMixin from '../../common/mixins/route-entry'

  export default {
    name: 'ticket-creation',
    mixins: [RouteEntryMixin],
    data: _ => ({
      routes: [
        { path: '/ticket-creation/index', label: 'Create ticket' }
      ]
    })
  }
</script>

<style scoped>

</style>
