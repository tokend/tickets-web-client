<template>
  <div class="swap-address">

    <template v-if="!isPending && !isFailed">

      <p class="swap-address__quote-amount">
        {{ i18n.c(quoteAmount) }} {{ request.quoteAsset }}<br>
        <span class="swap-address__quote-label">price for {{ i18n.n(request.baseAmount) }} tickets</span>
      </p>

      <p class="swap-address__hint">{{ 'ticket_send_to_this_address' | translate({ asset: request.quoteAsset }) }}</p>
      <div class="swap-address__content">
        <div class="swap-address__qr-wrp">
          <!--TODO: use vue-qr instead for consistency-->
          <qrcode class="swap-address__qr-code"
                  :text="request.address"
                  :size="180"
                  color="#3f4244"
          />
        </div>

        <div class="app__form-row">
          <clipboard-field
            :value="request.address"
            :label="i18n.ticket_address({ asset: request.quoteAsset })"
            :monospaced="true"
          />
        </div>
      </div>

      <div class="swap-address__actions">
        <button class="app__button" @click="$emit('close')">
          {{ 'lbl_ok' | translate }}
        </button>
      </div>
    </template>

    <template v-else-if="isFailed">
      Failed to load data. Probably the bid was cancelled or all tickets were sold
    </template>

    <template v-else>
      <loader :message="i18n.tickets_modal_loading()"/>
    </template>

  </div>
</template>

<script>
  import ClipboardField from '../../../../common/fields/ClipboardField'
  import Qrcode from 'vue-qrcode-component'
  import Loader from '@/vue/app/common/Loader'

  import { i18n } from '../../../../../js/i18n'

  import { bidsService } from '../../../../../js/services/bids.service'
  import { RecordFactory } from '../../../../../js/records/factory'
  import { multiply } from '../../../../../js/utils/math.util'

  import _get from 'lodash/get'

  export default {
    name: 'TicketsSwapAddress',
    props: ['request'],
    data: _ => ({
      i18n,
      bid: null,
      isPending: false,
      isFailed: false
    }),
    components: {
      ClipboardField,
      Qrcode,
      Loader
    },
    async created () {
      this.isPending = true
      try {
        await this.loadBid()
      } catch (e) {
        console.error(e)
        this.isFailed = true
      }
      this.isPending = false
    },
    computed: {
      quoteAmount () {
        const price = (_get(this, 'bid.quoteAssets', [])
          .find(q => q.asset === this.request.quoteAsset) || {})
          .price
        return multiply(price, this.request.baseAmount)
      }
    },
    methods: {
      async loadBid () {
        this.bid = RecordFactory.createBidRecord(
          await bidsService.getBid(this.request.bidId)
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";

  .swap-address {
    max-width: 20rem;
  }

  .swap-address__quote-amount {
    width: 100%;
    background: $col-background;
    border-radius: 5px;
    color: $col-md-primary;
    font-size: 2.4 * $point;
    text-align: center;
    padding: 1rem 0;
    margin-bottom: 2rem;
  }


  .swap-address__quote-label {
    font-size: .7rem;
  }

  .swap-address,
  .swap-address button {
    font-family: 'Circular', 'Noto Sans', '-apple-system', 'BlinkMacSystemFont', sans-serif !important;
    color: $col-md-primary;
  }

  .swap-address__heading {
    margin-bottom: 1rem;
  }

  .swap-address__hint,
  .swap-address__content {
    margin-bottom: 2rem;
  }

  .swap-address__qr-code {
    margin: auto;
    width: 180px;
  }

  .swap-address__actions {
    text-align: right;
  }
</style>
