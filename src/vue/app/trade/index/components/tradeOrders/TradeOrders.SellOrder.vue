<template>
  <div class="sell-order__card app__card">
    <form @submit.prevent="submit">
      <div class="app__card-header">
        <div class="md-title">{{ i18n.trd_create_sell_order() }}</div>
      </div>

      <div class="app__card-content">
        <div class="app__form-row">
          <input-field-unchained
            class="md-layout-item"
            v-model.trim="form.price"
            :label="i18n.trd_price_per({ asset: assets.base })"
            name="order-buy-price"
            v-validate="'required'"
            :whiteAutofill="true"
            type="number"
            :errorMessage="(allowToValidPrice && (Number(form.price) === 0 ||
                          Number(form.price) < 0) ? i18n.trd_validate_minimal_price() : '')"
          />
        </div>

        <div class="app__form-row">
          <input-field-unchained
            class="md-layout-item"
            v-model.trim="form.amount"
            :label="i18n.trd_amount_for({ asset: assets.base })"
            name="order-buy-amount"
            v-validate="'required'"
            :whiteAutofill="true"
            type="number"
            :errorMessage="(allowToValidAmount && lessThanMinimumAmount) ? i18n.trd_validate_minimal_amount() : ''"
          />
        </div>

        <div class="app__form-row">
          <input-field-unchained
            class="md-layout-item"
            :value="i18n.c(form.quoteAmount)"
            :label="i18n.trd_total_value({ value: assets.quote })"
            name="order-buy-total"
            :readonly="true"
          />
        </div>
      </div>

      <div class="app__card-actions">
        <button v-ripple
                type="submit"
                class="app__form-submit-btn"
                :disabled="!+form.quoteAmount || isPending">
          {{ i18n.lbl_sell() }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import InputField from '../../../../../common/fields/InputField'
  import FormMixin from '../../../../../common/mixins/form.mixin'
  import OrderMakerMixin from '../order-maker.mixin'

  import { confirmAction } from '../../../../../../js/modals/confirmation_message'
  import { multiply } from '../../../../../../js/utils/math.util'
  import { i18n } from '../../../../../../js/i18n'

  export default {
    name: 'trade-orders-sell',
    mixins: [FormMixin, OrderMakerMixin],
    components: { InputField },
    props: {
      assets: { type: Object, require: true }
    },
    data () {
      return {
        form: {
          price: '',
          amount: '',
          quoteAmount: ''
        },
        allowToValidPrice: false,
        allowToValidAmount: false,
        i18n
      }
    },
    created () {
    },
    computed: {
      lessThanMinimumAmount () {
        return Number(this.form.amount) < 0.000001
      }
    },
    methods: {
      getQuoteAmount () {
        this.form.quoteAmount = multiply(this.form.price, this.form.amount)
      },
      async submit () {
        this.allowToValidPrice = true
        this.allowToValidAmount = true
        if (!await this.isValid()) return
        if (!await confirmAction()) return
        this.errors.clear()
        this.disable()
        await this.createOrder({
          pair: {
            base: this.assets.base,
            quote: this.assets.quote
          },
          baseAmount: this.form.amount,
          quoteAmount: this.form.quoteAmount,
          price: this.form.price,
          isBuy: false
        })
        this.enable()
        this.resetForm()
      },
      resetForm () {
        this.form.price = ''
        this.form.amount = ''
        setTimeout(() => this.changeAllow(), 0)
      },
      changeAllow () {
        this.allowToValidPrice = false
        this.allowToValidAmount = false
      }
    },
    watch: {
      'form.price' (value) {
        this.getQuoteAmount()
        this.allowToValidPrice = true
      },
      'form.amount' (value) {
        this.getQuoteAmount()
        this.allowToValidAmount = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sell-order__card {
    .app__card-actions {
      justify-content: flex-start;
    }
  }
</style>
