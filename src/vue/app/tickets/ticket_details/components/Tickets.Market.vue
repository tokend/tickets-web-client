<template>
  <div class="ticket-market">

    <template v-if="bids">

      <template v-if="!activeBid">

        <template v-if="bids && bids.length">
          <h3 class="ticket-market__heading">{{ 'tickets_active_bids' | translate }}</h3>

          <table class="ticket-market__bids">
            <tr class="ticket-market__bid-record">
              <th class="ticket-market__bid-record-cell">{{ 'tickets_bid_available' | translate }}</th>
              <th class="ticket-market__bid-record-cell">{{ 'tickets_no_bid_created_at' | translate }}</th>
              <th class="ticket-market__bid-record-cell"></th>
            </tr>
            <template v-for="bid in bids">
              <tr class="ticket-market__bid-record" v-if="+bid.availableAmount > 0">
                <td class="ticket-market__bid-record-cell">{{ i18n.n(bid.availableAmount) }} {{ bid.baseAsset }}</td>
                <td class="ticket-market__bid-record-cell">{{ bid.createdAt | formatDate('DoMT') }}</td>
                <td class="ticket-market__bid-record-cell">
                  <template v-if="bid.ownerId === accountId">
                    <button class="app__button-icon"
                            @click="cancelBid(bid)"
                            :disabled="isPending">
                      <md-icon class="ticket-market__cancel-icon">cancel</md-icon>
                      <md-tooltip md-direction="right">{{ 'tickets_cancel_bid' | translate }}</md-tooltip>
                    </button>
                  </template>
                  <template v-else-if="isLoggedIn">
                    <button class="app__button-flat" @click="activeBid = bid">
                      {{ 'lbl_buy' | translate }}
                    </button>
                  </template>
                </td>
              </tr>
            </template>
          </table>
        </template>

        <template v-else>
          <no-data-message icon-name="inbox"
                           :msg-title="i18n.ticket_market_empty()"
                           :msg-message="i18n.ticket_no_active_bids()"/>
        </template>
      </template>

      <template v-else>

        <h3 class="ticket-market__heading">Bid #{{ activeBid.id }}</h3>
        <tickets-buyer :bid="activeBid"
                       @cancel-click="activeBid = null"
                       @ask-created="activeBid = null; $emit('ask-created')"
        />
      </template>

    </template>
    <template v-else>
      {{ 'tickets_no_bids' | translate }}
    </template>
  </div>
</template>

<script>
import TicketsBuyer from './Tickets.Buyer'
import FormMixin from '../../../../common/mixins/form.mixin'
import NoDataMessage from '../../../../common/messages/NoDataMessage'

import { ErrorHandler } from '../../../../../js/errors/error_handler'
import { bidsService } from '../../../../../js/services/bids.service'
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../../vuex/types'
import { i18n } from '@/js/i18n'
import { confirmAction } from '../../../../../js/modals/confirmation_message'

export default {
  components: {
    TicketsBuyer,
    NoDataMessage
  },
  mixins: [FormMixin],
  props: ['bids'],
  data: _ => ({
    i18n,
    activeBid: null
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.isLoggedIn
    ])
  },
  methods: {
    async cancelBid (bid) {
      if (!await confirmAction()) return
      this.disable()
      try {
        await bidsService.cancelBid({
          bidID: bid.id
        })
        this.$emit('bid-canceled')
      } catch (e) { ErrorHandler.processUnexpected(e) }
      this.enable()
    }
  }
}
</script>

<style lang='scss'>
  @import "~@scss/variables";
  @import "~@scss/mixins";

  .ticket-market {
    @include respond-to-custom(840px) {
      max-width: 90vw;
      overflow-y: scroll;
    }
  }

  .ticket-market__heading,
  .ticket-market__bid-record-cell {
    color: $col-md-primary;
  }


  .ticket-market__heading {
    margin-bottom: 3 * $point;
  }

  .ticket-market__bid-record {
    margin-bottom: 4 * $point;
  }

  .ticket-market__bid-record-cell {
    $padding: 3 * $point;

    padding: 0 $padding 0 0;
    text-align: left;
    white-space: nowrap;
  }

  .ticket-market__back-btn {
    padding-left: 0;
    margin-left: -0.4rem;
    padding-top: 0;
  }

  .ticket-market__cancel-icon {
    color: $col-md-accent!important;
  }
</style>
