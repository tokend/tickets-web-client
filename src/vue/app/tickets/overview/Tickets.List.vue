<template>
  <div>
    <template v-if="tickets.length > 0">
      <div class="tickets-explore__sale-overview-inner">
        <div class="tickets-explore__card-wrapper-outer"
             v-for="ticket in tickets"
             :key="ticket.code">
          <router-link :to="{name: 'tickets.ticket-details', params: { id: ticket.code }}"
                       tag="button"
                       class="tickets-explore__card-wrapper">
            <ticket-card class="tickets-explore__card" :ticket="ticket"/>
          </router-link>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="app__page-content-wrp">
        <h2 class="app__page-heading">{{ i18n.tickets_no_tickets_heading() }}</h2>
        <p class="app__page-explanations app__page-explanations--secondary">
          {{ i18n.tickets_no_tickets() }}
        </p>
      </div>
    </template>
  </div>
</template>

<script>
  import TicketCard from './ticket_card/Tickets.TicketCard'
  import { i18n } from '../../../../js/i18n'

  export default {
    name: 'TicketsList',
    components: { TicketCard },
    props: ['tickets'],
    data: _ => ({
      i18n
    })
  }
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';

  .tickets-explore__sale-overview-inner {
    display: flex;
    flex-wrap: wrap;
  }

  .tickets-explore__sale-overview-inner {
    margin: 0 auto;
    margin: -1.2 * $point;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .tickets-explore__card-wrapper-outer {
    padding: 1.2 * $point;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    flex: 0.333;
    min-width: 33.333%;
    max-width: 33.333%;

    @include respond-to(xmedium) {
      flex: 0.5;
      min-width: 49.999%;
      max-width: 50%;
    }

    @media only screen and (max-width: 767px) {
      flex: 1;
      min-width: 100%;
      margin-right: 0;
    }

    @include respond-to(small) {
      padding-right: 0;
      padding-left: 0;
    }
  }

  .tickets-explore__card-wrapper {
    background: $col-content-block;
    border: none;
    box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.08);
    cursor: pointer;
    display: block;
    flex: 1;
    font-size: initial;
    max-width: 100%;
    text-align: initial;
  }
</style>
