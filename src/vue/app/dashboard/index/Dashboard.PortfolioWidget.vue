<template>
  <div class="portfolio-widget">
    <template v-if="currentAsset">
      <div class="portfolio-widget__wrapper">
        <div class="portfolio-widget__select">
          <div class="portfolio-widget__select-picture">
            <router-link :to="{name: 'tickets.ticket-details', params: { id: currentAsset }}">
              <img class="portfolio-widget__asset" :src="iconUrl">
            </router-link>
          </div>
          <div class="portfolio-widget__select-field">
            <!-- :key is a hack to ensure that the component will be updated after computed calculated -->
            <select-field-custom :value="currentAssetForSelect"
                                 :values="assetList"
                                 :key="currentAssetForSelect"
                                 @input="emitSelect($event)"
            />
          </div>
        </div>
      </div>
      <div class="portfolio-widget__wrapper portfolio-widget__wrapper--values">
        <div class="portfolio-widget__asset-available">
          <div class="portfolio-widget__asset-value">
            {{ 'ticket_balance' | translate({ amount: balance, asset: currentAsset }) }}
          </div>
        </div>

        <template v-if="+get(accountBalances, `${currentAsset}.balance`) > 0 ||
                         get(accountBalances, `${currentAsset}.asset_details.owner`) === this.accountId">
            <router-link tag="button" class="app__button-raised"
              :to="{ name: 'bids.new', params: { code: currentAsset } }">
              <md-icon class="portfolio-widget__chart-icon">show_chart</md-icon>

              {{ 'ticket_sell_asset' | translate({ asset: currentAsset }) }}
            </router-link>
        </template>
      </div>
      <tickets-list v-if="+balance"
                    class="portfolio-widget__tickets-list"
                    :amount="+balance"
                    :asset="currentAsset"
                    @select-ticket="setCheckingBalanceTimer"/>
    </template>

    <template v-else>
      <no-data-message icon-name="toll"
                       :msg-title="i18n.th_no_assets_in_your_wallet()"
                       :msg-message="i18n.th_here_will_be_tokens()"/>
    </template>

  </div>
</template>

<script>
  import config from '@/config'
  import SelectFieldCustom from '@/vue/common/fields/SelectFieldCustom'
  import NoDataMessage from '@/vue/common/messages/NoDataMessage'
  import { ASSET_POLICIES } from '@/js/const/const'

  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '@/vuex/types'
  import { i18n } from '@/js/i18n'
  import { commonEvents } from '@/js/events/common_events'
  import get from 'lodash/get'
  import TicketsList from './components/Details.TicketsList'

  const UNSELECT_ID = -1

  export default {
    name: 'portfolio-widget',
    components: {
      SelectFieldCustom,
      NoDataMessage,
      TicketsList
    },
    props: {
      scale: { type: String, required: true },
      currentAsset: { type: [String, Object], default: config.DEFAULT_QUOTE_ASSET },
      showTabls: { type: Boolean, default: false }
    },
    data: _ => ({
      i18n,
      events: {
        assetChange: commonEvents.assetChangeEvent,
        changeDashboardScale: commonEvents.changeDashboardScale
      },
      config,
      ASSET_POLICIES,
      checkingBalanceTimer: null,
      selectCurrentAsset: null
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountId,
        vuexTypes.accountBalances,
        vuexTypes.tickets
      ]),
      assetList () {
        if (!this.tickets || !this.tickets.length) return
        const tokens = this.tickets
          .filter(token => Object.keys(this.accountBalances).includes(token.code))
          .sort((a, b) => a.code.localeCompare(b.code))
        return [...tokens].map(item => `${item.name} (${item.code})`)
      },
      currentAssetForSelect () {
        return this.selectCurrentAsset || this.tickets.filter(token => token.code === this.currentAsset)
          .map(item => `${item.name} (${item.code})`)[0]
      },
      balance () {
        return i18n.n(get(this.accountBalances, `${this.currentAsset}.balance`) || 0)
      },
      convertedBalance () {
        return i18n.cc(get(this.accountBalances, `${this.currentAsset}.converted_balance`) || 0)
      },
      iconUrl () {
        const selected = this.tickets
          .filter((item) => item.code === this.currentAsset)[0]
        return (selected || {}).iconUrl
      }
    },
    async created () {
      await this.loadTickets()
      await this.loadBalances()
    },
    methods: {
      get,
      ...mapActions({
        loadTickets: vuexTypes.GET_ALL_TICKETS,
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),
      emitSelect (event) {
        this.$emit(this.events.assetChange, event)
      },
      setCheckingBalanceTimer (id) {
        if (id !== UNSELECT_ID) {
          this.checkingBalanceTimer = setInterval(() => {
            this.loadBalances()
          }, 4000)
        } else {
          clearInterval(this.checkingBalanceTimer)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  $custom-breakpoint: 800px;

  .portfolio-widget__wrapper {
    display: flex;
    justify-content: space-between;

    @include respond-to-custom($custom-breakpoint) {
      flex-direction: column-reverse;
    }
  }

  .portfolio-widget__wrapper--values {
    align-items: flex-end;

    @include respond-to(medium) {
      align-items: flex-end;
    }

    @include respond-to-custom($custom-breakpoint) {
      flex-direction: column;
      align-items: center;

      button {
        margin-top: 2rem;
      }

    }
  }

  .portfolio-widget__select-scale {
    @include respond-to-custom($custom-breakpoint) {
      margin-top: 16px;
    }
  }

  .portfolio-widget__select {
    display: flex;
    align-items: center;
    margin-right: 16px;
  }

  .portfolio-widget__select-picture {
    width: 55px;
    height: 55px;
    padding: 4px;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, .15);
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;

    @include respond-to(small) {
      width: 40px;
      height: 40px;
    }
  }

  .portfolio-widget__asset-btns {
    align-items: center;
    justify-content: flex-end;
    display: flex;
    flex-wrap: wrap;
    margin: -4px;

    @include respond-to-custom($custom-breakpoint) {
      justify-content: flex-start;
      margin-bottom: 16px;
    }
  }

  .portfolio-widget__select-scale-btn {
    @include button();
    @include button-flat();
    font-weight: 400;
  }

  .portfolio-widget__select-scale-btn--selected {
    font-weight: 700;
  }

  .portfolio-widget__asset-btn {
    @include button();
    @include button-raised();
    margin: 4px;

    width: 180px;
    position: relative;
    height: 36px;

    @include respond-to-custom($custom-breakpoint) {
      width: 160px;
      margin-bottom: 0;
      padding-left: 30px;
    }
  }

  .portfolio-widget__asset-available {
    margin-top: 32px;
  }

  .portfolio-widget__asset-value {
    font-size: 30px;
    color: $col-md-primary;
    line-height: 40px;
  }

  .portfolio-widget__asset-usd {
    margin-top: 8px;
    font-size: 16px;
    color: rgba($col-md-primary, .5);
  }

  .portfolio-widget__asset-btn-icon {
    color: $white !important;
    transform: scale(.8);
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);

    @include respond-to-custom($custom-breakpoint) {
      left: 6px;
    }
  }

  .portfolio-widget__chart-icon {
    color: $white !important;
    margin-right: .5rem;
  }

  .portfolio-widget__asset-btn-icon--rotate {
    transform: translateY(-40%) rotate(-45deg) scale(.8);
    left: 10px;
    top: calc(50% - 4px);
  }

  .portfolio-widget__create-bid-caption {
    line-height: 4 * $point;
    color: $col-text-secondary;

  }

  .portfolio-widget__tickets-list {
    margin: 3rem 0;
  }

</style>
