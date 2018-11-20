<template>
  <div class="details-tickets-list">
    <div class="details-tickets-list__inner">
      <ticket v-if="ticketInfo && nameSurname"
              v-for="index in tickets.slice(0, amountToRender)"
              :id="+index"
              :key="index"
              :ticket-info="ticketInfo"
              :asset="asset"
              :select-ticket="selectTicketId"
              :name-surname="nameSurname"
              @select-ticket="selectTicket"/>
    </div>

    <template v-if="amountToRender < amount">
      <div class="details-tickets-list__btn-wrp">
        <button class="app__button-flat" @click="amountToRender += PAGE_LENGTH">More</button>
      </div>
    </template>
  </div>
</template>
<script>
  import Ticket from './Details.Ticket'
  import { ticketsService } from '@/js/services/tickets.service'
  import { commonEvents } from '@/js/events/common_events'
  import { EventDispatcher } from '@/js/events/event_dispatcher'
  import { i18n } from '@/js/i18n'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '@/vuex/types'

  const UNSELECT_ID = -1
  const PAGE_LENGTH = 10

  export default {
    props: ['amount', 'asset'],
    components: { Ticket },
    data: _ => ({
      amountToRender: PAGE_LENGTH,
      selectTicketId: UNSELECT_ID,
      ticketInfo: null,
      tickets: null,
      oldAmount: 0,
      PAGE_LENGTH,
      nameSurname: ''
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountLatestBlobId,
        vuexTypes.accountKycData
      ])
    },
    methods: {
      ...mapActions({
        loadKycRequests: vuexTypes.GET_ACCOUNT_KYC_REQUESTS,
        loadKycData: vuexTypes.GET_ACCOUNT_KYC_DATA
      }),
      async getNameSurname () {
        await this.loadKycRequests()
        await this.loadKycData({
          blobId: this.accountLatestBlobId
        })
        this.nameSurname = `${this.accountKycData.first_name} ${this.accountKycData.last_name}`
      },
      toArr (int) {
        let newArr = []
        for (let i = 0; i < int; i++) {
          newArr.push(i + '')
        }
        return newArr
      },
      async loadDetails (asset) {
        this.ticketInfo = await ticketsService.get(asset)
      },
      selectTicket (id) {
        this.selectTicketId = id
        this.$emit(commonEvents.selectTicket, id)
      }
    },
    watch: {
      asset () {
        this.loadDetails(this.asset)
      },
      amount () {
        if (this.oldAmount > this.amount && this.selectTicketId !== UNSELECT_ID) {
          this.tickets.splice(this.selectTicketId, 1)
          this.selectTicketId = UNSELECT_ID
          this.$emit(commonEvents.selectTicket, UNSELECT_ID)
          EventDispatcher.dispatchShowSuccessEvent(i18n.ticket_is_redemption())
        } else {
          this.tickets = this.toArr(this.amount)
        }
        this.oldAmount = this.amount
      }
    },
    created () {
      this.getNameSurname()
      this.oldAmount = this.amount
      this.tickets = this.toArr(this.amount)
      this.loadDetails(this.asset)
    }
  }
</script>
<style scoped lang="scss">
  .details-tickets-list__inner {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-left: -10px;
  }

  .details-tickets-list__btn-wrp {
    padding-top: 2.5rem;
    text-align: center;
  }
</style>
