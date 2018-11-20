<template>
  <div class="transfer app__page-content-wrp">
    <template v-if="!tokenCodes.length">
      <h2 class="app__page-heading">{{ i18n.transfer_no_assets_heading() }}</h2>
      <p class="app__page-explanations app__page-explanations--secondary">
        {{ i18n.transfer_no_assets() }}
      </p>
      <router-link to="/tickets" tag="button" class="app__button-raised">
        {{ i18n.transfer_discover_assets_btn() }}
      </router-link>
    </template>

    <template v-else-if="tokenCodes.length && showForm">
      <h2 class="app__page-heading">{{ i18n.transfer_heading() }}</h2>
      <form @submit.prevent="submit(form.isPaidForRecipient)" id="transfer-form">
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field-unchained :values="tokenCodes"
              v-model="form.tokenCode"
              :label="i18n.lbl_asset()"
              :readonly="isPending"/>
              <div class="app__form-field-description">
                <p v-if="form.tokenCode">
                  {{ i18n.transfer_balance({ amount: i18n.n(balance.balance), asset: form.tokenCode }) }}
                </p>
              </div>
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field-unchained name="amount"
              step="1"
              type="number"
              v-model.trim="form.amount"
              v-validate="'required|amount'"
              :label="i18n.lbl_amount()"
              :disabled="isPending"
              :errorMessage="errors.first('amount') ||
                (isLimitExceeded ? i18n.transfer_error_insufficient_funds() : '')"
            />
          </div>
        </div>

        <div class="app__form-row">
          <input-field-unchained name="recipient"
            v-model.trim="form.recipient"
            v-validate="'required|email_or_account_id'"
            :label="i18n.lbl_recipient_email_or_account()"
            :errorMessage="errorMessage('recipient')"
            :disabled="isPending"
          />
        </div>

        <div class="app__form-row">
          <textarea-field id="transfer-description"
            name="description"
            v-model="form.subject"
            v-validate="'max:250'"
            :label="i18n.lbl_add_note()"
            :maxlength="250"
            :errorMessage="errorMessage('recipient')"
            :disabled="isPending"
          />
        </div>
      </form>

      <div class="app__form-actions">
        <button v-ripple
          type="submit"
          class="app__form-submit-btn"
          :disabled="isPending"
          form="transfer-form">
          {{ i18n.transfer_submit() }}
        </button>
      </div>
    </template>
  </div>

</template>

<script>
import get from 'lodash/get'

import FormMixin from '@/vue/common/mixins/form.mixin'
import SelectFieldUnchained from '@/vue/common/fields/SelectFieldUnchained'
import InputFieldUnchained from '@/vue/common/fields/InputFieldUnchained'
import TickField from '@/vue/common/fields/TickField'
import FormConfirmation from '@/vue/common/form-confirmation/FormConfirmation'

import { ErrorHandler } from '@/js/errors/error_handler'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { Keypair } from 'tokend-js-sdk'
import { errors } from '@/js/errors/factory'
import { i18n } from '@/js/i18n'
import { EventDispatcher } from '@/js/events/event_dispatcher'

import { accountsService } from '@/js/services/accounts.service'
import { feeService } from '@/js/services/fees.service'
import { transferService } from '@/js/services/transfers.service'

export default {
  name: 'transfers-make',
  mixins: [FormMixin],
  components: {
    SelectFieldUnchained,
    InputFieldUnchained,
    FormConfirmation,
    TickField
  },
  data: _ => ({
    form: {
      tokenCode: null,
      amount: '',
      recipient: '',
      subject: '',
      isPaidForRecipient: false
    },
    view: {
      opts: {}
    },
    showForm: true, // always true, but need for rerender form
    i18n,
    fees: {
      source: {
        fixed: '',
        percent: '',
        feeAsset: ''
      },
      destination: {
        fixed: '',
        percent: '',
        feeAsset: ''
      }
    },
    isFeesLoaded: false
  }),
  created () {
    this.setTokenCode()
    this.loadCurrentBalances()
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.userTransferableTickets
    ]),
    tokenCodes () {
      return this.userTransferableTickets.map(token => token.code)
    },
    balance () {
      return this.accountBalances[this.form.tokenCode]
    },
    isLimitExceeded () {
      return Number(this.form.amount) > Number(get(this.balance, 'balance') || 0)
    }
  },
  methods: {
    ...mapActions({
      loadCurrentBalances: vuexTypes.GET_ACCOUNT_BALANCES
    }),
    async submit (feeFromSource) {
      this.disable()
      if (!await this.isValid()) return
      await this.processTransfer()
      try {
        await transferService.createTransfer({
          ...this.view.opts,
          feeFromSource,
          asset: this.form.tokenCode
        })
        EventDispatcher.dispatchShowSuccessEvent(i18n.transfer_successful())
        await this.loadCurrentBalances()
        this.rerenderForm()
      } catch (error) {
        console.error(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },
    async processTransfer () {
      try {
        const counterparty = await this.loadCounterparty()
        const fees = await this.loadFees(counterparty.accountId)
        this.fees = fees
        this.isFeesLoaded = true

        const opts = {
          amount: this.form.amount,
          destinationAccountId: counterparty.accountId,
          destinationEmail: counterparty.email,
          destinationFixedFee: fees.destination.fixed,
          destinationPercentFee: fees.destination.percent,
          destinationFeeAsset: fees.destination.feeAsset,
          sourceBalanceId: this.balance.balance_id,
          sourceFixedFee: fees.source.fixed,
          sourcePercentFee: fees.source.percent,
          sourceFeeAsset: fees.source.feeAsset,
          subject: this.form.subject,
          tokenCode: this.form.tokenCode
        }
        this.view.opts = opts
      } catch (error) {
        console.error(error)
        if (error instanceof errors.NotFoundError) {
          error.showBanner(i18n.tr_recipient_not_found())
          return
        }
        ErrorHandler.processUnexpected(error)
      }
    },
    async loadCounterparty () {
      const counterparty = {}
      const providedRecipient = this.form.recipient
      if (Keypair.isValidPublicKey(providedRecipient)) {
        counterparty.accountId = providedRecipient
        counterparty.email = await accountsService.loadEmailByAccountId(providedRecipient)
        return counterparty
      }
      counterparty.email = providedRecipient
      counterparty.accountId = await accountsService.loadAccountIdByEmail(providedRecipient)
      return counterparty
    },
    async loadFees (recipientAccountId) {
      const fees = { source: {}, destination: {} }
      const [senderFees, recipientFees] = await Promise.all([
        feeService.loadPaymentFeeByAmount(this.form.tokenCode, this.form.amount),
        feeService.loadPaymentFeeByAmount(this.form.tokenCode, this.form.amount, recipientAccountId)
      ])
      fees.source.fixed = senderFees.fixed
      fees.source.percent = senderFees.percent
      fees.source.feeAsset = senderFees.feeAsset
      fees.destination.fixed = recipientFees.fixed
      fees.destination.percent = recipientFees.percent
      fees.destination.feeAsset = recipientFees.feeAsset
      return fees
    },
    resetData (opts = {}, clear = false) {
      this.view.opts = opts
      this.clear()
      this.setTokenCode()
    },
    rerenderForm () {
      this.showForm = false
      this.isFeesLoaded = false
      this.resetData()
      setTimeout(() => {
        this.showForm = true
      }, 0)
    },
    setTokenCode () {
      this.form.tokenCode = this.$route.params.tokenCode || this.tokenCodes[0] || null
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.transfer__fee-box {
  margin-top: 4 * $point;
  padding-top: 4 * $point;
  border-top: 0.1 * $point dashed $col-md-primary-inactive;
}

.transfer__fee-box-heading {
  margin-top: 0;
  margin-bottom: 1 * $point;
  font-weight: normal;
  display: block;
  font-size: 1.6 * $point;
  color: $col-md-primary;
}

.transfer__fee-box-heading:not(:first-child) {
  margin-top: 2.5 * $point;
}

.transfer__fee {
  color: $col-md-primary;
  font-size: 1.6 * $point;
  line-height: 1.5;
  margin: 0;
}

.transfer__no-fee-msg {
  color: $col-md-primary-inactive;
  font-size: 1.6 * $point;
  line-height: 1.5;
  margin: 1 * $point 0;
}

.transfer__fee-type {
  color: $col-md-primary-secondary;
}
</style>
