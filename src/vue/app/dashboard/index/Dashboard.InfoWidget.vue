<template>
  <div class="info-widget">
    <template v-if="list.length">
      <div class="info-widget__title"> {{ i18n.dash_activity() }} </div>
      <div class="info-widget__list-wrapper">
        <div class="info-widget__list" v-table-scroll-shadow>
          <div class="info-widget__list-header">
            <div class="info-widget__list-header-item info-widget__list-header-item--date">{{ i18n.lbl_date() }}</div>
            <div class="info-widget__list-header-item info-widget__list-header-item--type">{{ i18n.lbl_tx_type() }}
            </div>
            <div class="info-widget__list-header-item info-widget__list-header-item--asset">{{ i18n.lbl_amount() }}
            </div>
            <div class="info-widget__list-header-item info-widget__list-header-item--status">{{ i18n.lbl_status() }}
            </div>
            <div class="info-widget__list-header-item info-widget__list-header-item--status">
              {{ 'lbl_direction' | translate }}
            </div>
            <div class="info-widget__list-header-item info-widget__list-header-item--btn"></div>
          </div>
          <div class="info-widget__list-body">
            <div class="info-widget__list-body-elem"
                 v-for="(tx, i) in list"
                 v-if="i < transactionsToShow"
                 :key="`activity-item-${i}`"
                 :class="`info-widget__list-body-elem--${tx.state}`">
              <div class="info-widget__list-body-row">
                <div :title="tx.date" class="info-widget__list-body-item info-widget__list-body-item--date">
                  {{ i18n.dmy(tx.date) }}
                </div>
                <div :title="tx.name" class="info-widget__list-body-item info-widget__list-body-item--type">
                  {{ tx.name }}
                </div>
                <div :title="tx.asset" class="info-widget__list-body-item info-widget__list-body-item--asset">
                  <template v-if="DIRECTION.out === tx.direction">-</template>
                  {{ i18n.n(tx.quoteAmount || tx.amount) }} {{ tx.quoteAsset || tx.asset }}
                </div>
                <div :title="tx.state" class="info-widget__list-body-item info-widget__list-body-item--status">
                  {{ tx.state === 'fully matched' ? 'success' : tx.state }}
                </div>
                <div class="info-widget__list-body-item info-widget__list-body-item--status">
                  <template v-if="DIRECTION.out === tx.direction">{{ 'ticket_in' | translate }}</template>
                  <template v-else>{{ 'ticket_out' | translate }}</template>
                </div>
                <div class="info-widget__list-body-item info-widget__list-body-item--btn">
                  <button class="info-widget__list-body-item-btn" @click="toggleDetails(i)">
                    <md-icon class="info-widget__list-body-item-icon"
                             :class="{ 'info-widget__list-body-item-icon--active': isSelected(i) }">
                      keyboard_arrow_down
                    </md-icon>
                  </button>
                </div>
              </div>
              <div class="info-widget__list-body-row info-widget__list-body-row--details" v-if="isSelected(i)">
                <tx-details class="info-widget__list-body-row-details" :tx="tx"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <no-data-message icon-name="trending_up"
                       :msg-title="i18n.th_no_transaction_history()"
                       :msg-message="i18n.th_here_will_be_the_list()"/>
    </template>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../vuex/types'
  import { RecordTypes } from '../../../../js/records/types'
  import { PricesHelper } from '../../../../vuex/helpers/prices.helper'
  import { DEFAULT_CONVERSION_ASSET } from '../../../../js/const/configs.const'
  import { i18n } from '../../../../js/i18n'
  import { TX_STATES } from '../../../../js/const/const'
  import NoDataMessage from '@/vue/common/messages/NoDataMessage'
  import { humanizePastDate } from '../../../../js/utils/dates.util'
  import TxDetails from './Dashboard.TxDetails'

  import get from 'lodash/get'

  const DIRECTION = {
    in: 'in',
    out: 'out'
  }

  export default {
    name: 'info-widget',
    components: {
      NoDataMessage,
      TxDetails
    },
    data: _ => ({
      transactionsToShow: 10,
      i18n,
      DEFAULT_CONVERSION_ASSET,
      TX_STATES,
      index: -1,
      DIRECTION
    }),
    props: ['currentAsset'],
    computed: {
      ...mapGetters([
        vuexTypes.transactions,
        vuexTypes.userWalletTokens
      ]),
      list () {
        return (get(this.transactions, `${this.currentAsset}.records`) || [])
          .reduce((list, item) => {
            if (item instanceof RecordTypes.MatchRecord) {
              item.transactions.forEach(tx => {
                list.push(tx)
              })
              return list
            }
            list.push(item)
            return list
          }, [])
      }
    },
    methods: {
      humanizePastDate,
      ...mapActions({
        loadList: vuexTypes.GET_TX_LIST
      }),
      toggleDetails (index) {
        this.index = this.index === index ? -1 : index
      },
      isSelected (i) {
        return this.index === i
      },
      convertAmount (amount) {
        return PricesHelper.baseToQuote(amount, this.currentAsset, DEFAULT_CONVERSION_ASSET)
      }
    },
    created () {
      if (this.currentAsset) {
        this.loadList(this.currentAsset)
      }
    },
    watch: {
      currentAsset (value) {
        this.loadList(value)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";
  @import "~@scss/mixins";

  .info-widget__list {
    padding: 0 4px 6px 4px;

    @include respond-to-custom(1300px) {
      overflow-x: auto;
    }
  }

  .info-widget__title {
    color: $col-md-primary;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
    margin-top: 72px;

    @include respond-to(medium) {
      margin-top: 24px;
    }
  }

  .info-widget__list-header,
  .info-widget__list-body-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
  }

  .info-widget__list-body-row--details {
    position: relative;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 16px;
      right: 30px;
      height: 1px;
      background-color: rgba($col-md-primary, 0.2);

      @include respond-to(medium) {
        right: 10px;
      }
    }
  }

  // .info-widget__list-header {
  //   @include respond-to(medium) {
  //     min-width: 670px;
  //   }
  // }

  .info-widget__list-wrapper {
    position: relative;
  }

  .info-widget__list-body-elem--failed,
  .info-widget__list-body-elem--pending,
  .info-widget__list-body-elem--success,
  .info-widget__list-body-elem--fully.matched {
    &:before {
      position: absolute;
      left: -25px;
      margin-top: 22px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      color: #fff;
      font-size: 10px;
      line-height: 18px;

      @include respond-to(medium) {
        left: -25px;
      }

      @include respond-to-custom(800px) {
        left: -21px;
      }

      @include respond-to(xsmall) {
        width: 14px;
        height: 14px;
        font-size: 8px;
        line-height: 16px;
        left: -13px;
      }
    }
  }

  .info-widget__list-body-elem--failed:before {
    content: "\2715";
    background-color: $col-md-accent;
    padding: 0 4px;
  }

  .info-widget__list-body-elem--pending:before {
    background-color: #ffb454;
    content: "";
  }

  .info-widget__list-body-elem--success:before,
  .info-widget__list-body-elem--fully.matched:before {
    content: "\2713";
    background-color: #51ca90;
    padding: 0 3px;
  }

  .info-widget__list-body-elem {
    @include box-shadow();

    background-color: #fff;

    // @include respond-to(medium) {
    //   min-width: 670px;
    // }

    &:not(:last-child) {
      margin-bottom: 6px;
    }
  }

  .info-widget__list-body-item,
  .info-widget__list-header-item {
    padding: 8px 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $col-md-primary;
  }

  .info-widget__list-body-row-details {
    padding-top: 17px;
    padding-bottom: 17px;
    margin: 0 20px;
  }

  .info-widget__history {
    max-width: 280px;

    @include respond-to(medium) {
      margin-left: auto;
      margin-right: 30px;
    }
  }

  .info-widget__list-body-item--btn,
  .info-widget__list-header-item--btn {
    width: 70px;
    flex: none;
    padding: 0;

    @include respond-to(medium) {
      width: 47px;
    }
  }

  .info-widget__list-body-item-btn {
    @include button();
    @include button-flat();

    background: rgba($col-md-primary, 0.1);
    font-size: 10px;
    border-radius: 4px;
    padding: 8px;
  }

  .info-widget__list-body-item-icon {
    color: $col-md-primary !important;
    font-size: 20px !important;
    font-weight: 400;
    transition: transform 0.15s ease-out;
    will-change: transform;
  }

  .info-widget__list-body-item-icon--active {
    transform: rotate(-180deg);
  }

  .info-widget__list-header-item--date,
  .info-widget__list-body-item--date {
    // width: 20%;
    flex: 1;

    @include respond-to(medium) {
      // width: 16%;
      // min-width: 114px;
    }
  }

  .info-widget__list-body-item--type,
  .info-widget__list-header-item--type {
    // width: 30%;
    flex: 1;

    @include respond-to(medium) {
      // width: 15%;
      // min-width: 166px;
    }
  }

  .info-widget__list-body-item--asset,
  .info-widget__list-header-item--asset {
    // width: 12%;
    flex: 1;

    @include respond-to(small) {
      display: none;
    }
  }

  .info-widget__list-body-item--amount,
  .info-widget__list-header-item--amount {
    // width: 20%;
    flex: 1;

    @include respond-to(medium) {
      // width: 11%;
      // min-width: 107px;
    }
  }

  .info-widget__list-body-item--counterparty,
  .info-widget__list-header-item--counterparty {
    // width: 25%;
    flex: 1;

    @include respond-to(medium) {
      // width: 18%;
      // min-width: 118px;
    }
  }

  .info-widget__list-body-item--status,
  .info-widget__list-header-item--status {
    // width: 15%;
    flex: 1;

    @include respond-to(medium) {
      display: none;
      // width: 15%;
      // min-width: 97px;
    }
  }

  .info-widget__list-body-row-detail {
    display: flex;
    font-size: 12px;

    label {
      width: 65px;
      margin-right: 16px;
      color: #837fa1;
    }

    p {
      color: #3a4180;
    }
  }
</style>
