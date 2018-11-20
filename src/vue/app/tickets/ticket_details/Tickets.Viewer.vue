<template>
  <div>
    <div v-if="failed" class="app__page-content-wrp">
      <h2 class="app__page-heading">
        {{ 'ticket_details_load_failed_heading' | translate }}
      </h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ 'ticket_details_load_failed' | translate }}
      </p>
    </div>

    <div v-else-if="!ready" class="app__page-content-wrp">
      <loader :message="'ticket_details_loading' | translate"/>
    </div>

    <div v-else class="ticket-details">
      <section class="ticket-details__section">
        <h1 class="ticket-details__heading"> {{ ticket.name }} ({{ ticket.code }})</h1>
        <p class="ticket-details__short-description">{{ ticket.shortDescription }}</p>

        <div class="ticket-details__ticket-splash-wrp">
          <img class="ticket-details__ticket-splash-img md-image"
              :src="ticket.splashUrl"
              :alt="ticket.name">
        </div>
      </section>

      <section class="ticket-details__row-section">
        <div class="ticket-details__row-section-item">
          <ticket-event-details :ticket="ticket" />
        </div>
        <div class="ticket-details__row-section-item
                    ticket-details__row-section-item--market"
        >
          <div class="ticket-details__market-wrp">
            <tabs class="app__tabs app__tabs--md">
              <tab :name="i18n.tickets_market()">
                <template v-if="marketReady">
                  <ticket-market :bids="bids"
                                 @bid-canceled="loadMarket"
                                 @ask-created="loadMarket"
                  />
                </template>
                <template v-else-if="!marketFailed">
                  <loader :message="'ticket_bids_loading' | translate"/>
                </template>
                <template v-else>
                  <p class="app__page-explanations app__page-explanations--secondary">
                    {{ 'ticket_bid_load_failed' | translate }}
                  </p>
                </template>
              </tab>
              <template v-if="isLoggedIn">
                <tab :name="i18n.tickets_my_offers()">
                  <ticket-request-viewer :requests="requests"/>
                </tab>
              </template>
            </tabs>


            <template v-if="isLoggedIn && isOverlayShown && bids.length">
              <div class="ticket-details__market-overlay">
                <div class="ticket-details__market-buy-wrp">
                  <md-icon class="ticket-details__market-buy-icon md-size-2x">shop_two</md-icon>
                  <p class="ticket-details__market-buy-msg">
                    {{ 'ticket_bids_available' | translate({ amount: totalTickets }) }}
                  </p>

                  <button class="app__button-raised
                                 ticket-details__market-buy-btn"
                          @click="isOverlayShown = false"
                  >
                    {{ 'ticket_buy' | translate }}
                  </button>
                </div>
              </div>
            </template>
          </div>

        </div>
      </section>

      <section class="ticket-details__section">
        <div class="ticket-details__map-wrp">
          <google-map class="ticket-details__map"
                      :name="`${ticket.code}`"
                      :initial-coordinates="ticket.eventCoordinates"
                      :allow-to-change-mark-position="false"
          />
        </div>
      </section>

      <section class="ticket-details__section">
        <h3 class="ticket-details__section-heading">
          {{ 'ticket_details_description_section_heading' | translate }}
        </h3>
        <p class="ticket-details__long-description"
          v-html="ticket.longDescription">
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import { RecordFactory } from '../../../../js/records/factory'
import { ticketsService } from '@/js/services/tickets.service'
import { bidsService } from '../../../../js/services/bids.service'

import TicketMarket from '../ticket_details/components/Tickets.Market'
import TicketEventDetails from './components/Tickets.EventViewer'
import TicketRequestViewer from '../ticket_details/components/Tickets.RequestsViewer'

import Loader from '@/vue/app/common/Loader'

import GoogleMap from '../../common/GoogleMap'

import { i18n } from '../../../../js/i18n'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '../../../../vuex/types'

export default {
  name: 'ticket-details',
  props: ['id'],
  components: {
    TicketMarket,
    TicketEventDetails,
    TicketRequestViewer,
    Loader,
    GoogleMap
  },

  data: _ => ({
    ticket: {},
    bids: [],
    requests: [],
    ready: false,
    failed: false,
    marketReady: false,
    marketFailed: false,
    isOverlayShown: true,
    i18n
  }),

  async created () {
    if (this.id) {
      try {
        await this.loadDetails()
        await this.loadMarket()
        this.ready = true
      } catch (error) {
        console.error(error)
        this.failed = true
      }
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.isLoggedIn
    ]),
    totalTickets () {
      return this.bids.reduce((r, b) => {
        return Number(b.availableAmount) + r
      }, 0)
    }
  },

  methods: {
    ...mapActions({
      loadTokens: vuexTypes.GET_ALL_TOKENS
    }),
    async loadDetails () {
      await this.loadTokens()
      this.ticket = await ticketsService.get(this.id)
      this.bids = await this.getBids(this.ticket.code)
      if (this.isLoggedIn) {
        this.requests = await this.getRequests()
      }
    },
    async loadMarket () {
      this.marketReady = false
      try {
        this.marketReady = true
        const bids = await this.getBids(this.ticket.code)
        const requests = await this.getRequests()
        this.requests = requests.filter(r => bids.find(b => b.id === r.bidId))
        this.bids = bids.filter(b => !b.isCanceled)
      } catch (e) {
        console.error(e)
        this.marketFailed = true
      }
    },
    async getRequests () {
      const response = await bidsService.getSwapRequests()
      return response.records.map(r => RecordFactory.createASwapRequestRecord(r))
    },
    async getBids (baseAsset) {
      const response = await bidsService.getBids({ baseAsset })
      return response.records.map(r => RecordFactory.createBidRecord(r))
    }
  }
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";
$ratio_16: 100%;
$ratio_9: $ratio_16 * (9/16);

.ticket-details {
  max-width: 1000px;
  margin: 0 auto;
}

.ticket-details__ticket-splash-wrp {
  position: relative;
  padding-bottom: $ratio_9;
  width: 100%;
  margin-top: 2.4 * $point;
}

.ticket-details__ticket-splash-img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ticket-details__heading {
  font-size: 2 * $point;
  line-height: 1.5;
  margin: 0 0 0.8 * $point;
  vertical-align: middle;
  color: $col-md-primary;
  opacity: 1;
}

.ticket-details__short-description {
  font-size: 1.6 * $point;
  color: $col-md-primary-inactive;
  line-height: 1.5;
}

.ticket-details__section {
  margin: 4.8 * $point 0;
  &:first-of-type {
    margin-top: 0;
  }
}

$row-section-item-margin: 2.4 * $point;
.ticket-details__row-section {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + $row-section-item-margin);
  margin: 0 -$row-section-item-margin;

}

.ticket-details__row-section-item {
  flex: 1;
  margin: $row-section-item-margin;

  &--market {
    min-width: 40 * $point;

    @include respond-to(small) {
      min-width: 90vw;
    }
  }
}

.ticket-details__section-heading {
  margin-bottom: 1 * $point;
  color: $col-md-primary
}

.ticket-details__long-description {
  font-size: 1.6 * $point;
  line-height: 1.5;
  color: $col-md-primary;
}

.ticket-details__map-wrp {
  position: relative;
  padding-bottom: 100% * (9/16);
  height: 0;
  background-color: silver;

  & > .ticket-details__map {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

  .ticket-details__market-wrp { position: relative }
  .ticket-details__market-overlay {
    background: rgba(255,255,255, .95);
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }

  .ticket-details__market-buy-wrp {
    position: absolute;
    @include center();
    text-align: center;
  }

  .ticket-details__market-buy-icon {
    margin-bottom: .5rem;
  }

  .ticket-details__market-buy-msg {
    font-size: 2 * $point;
    margin-bottom: 1rem;
  }

  .ticket-details__map {
    height: 400px;
  }
</style>
