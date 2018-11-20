<template>
  <div class="tickets-explore">
    <template v-if="!isLoaded">
      <loader :message="i18n.tickets_loading()"/>
    </template>

    <template v-else>
      <ticket-list :tickets="tickets"/>
    </template>

  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { i18n } from '@/js/i18n'

  import Loader from '@/vue/app/common/Loader'
  import TicketList from './Tickets.List'

  export default {
    name: 'TicketsExplore',
    components: { Loader, TicketList },
    data: _ => ({
      bids: [],
      isLoaded: false,
      filters: {
        baseAsset: ''
      },
      i18n
    }),
    async created () {
      this.isLoaded = false
      await this.getTickets()
      this.isLoaded = true
    },
    computed: {
      ...mapGetters({
        tickets: vuexTypes.tickets
      })
    },
    methods: {
      ...mapActions({
        getTickets: vuexTypes.GET_ALL_TICKETS
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';

  .tickets-explore {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: auto;
  }

  .tickets-explore__no-sales-found-msg {
    padding: 10px 40px;
    text-align: center;
    background-color: $col-content-block;
    margin: 0 auto;
    .icon {
      margin-bottom: 20px;
      i {
        font-size: $material-icon-xx-super-big;
        line-height: 1;
      }
    }
  }
</style>
