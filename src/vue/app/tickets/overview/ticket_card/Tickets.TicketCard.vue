<template>
  <div class="ticket-card">
    <div class="ticket-card__image-wrp">
      <img :src="ticket.splashUrl" :alt="ticket.name">
    </div>

    <div class="ticket-card__content">
      <div class="ticket-card__header">
        <h3 class="ticket-card__name">{{ ticket.name }}</h3>
      </div>
      <p class="ticket-card__description">{{ ticket.shortDescription }}</p>

      <template v-if="!bid && !accountBalances[ticket.code] && isLoggedIn">
        <button class="ticket-card__follow-btn app__button-raised"
                :disabled="isPending"
                @click="addBalance"
        >
          {{ 'ticket_follow' | translate }}
        </button>
      </template>

    </div>
  </div>
</template>

<script>
  import FormMixin from '../../../../common/mixins/form.mixin'

  import { accountsService } from '../../../../../js/services/accounts.service'
  import { ErrorHandler } from '../../../../../js/errors/error_handler'
  import { mapGetters, mapActions } from 'vuex'
  import { vuexTypes } from '../../../../../vuex/types'
  import { EventDispatcher } from '../../../../../js/events/event_dispatcher'

  import { i18n } from '../../../../../js/i18n'

  export default {
    name: 'ticket-card',
    props: ['ticket', 'bid'],
    mixins: [FormMixin],
    computed: {
      ...mapGetters([
        vuexTypes.accountBalances,
        vuexTypes.isLoggedIn
      ])
    },
    methods: {
      ...mapActions({
        loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
      }),
      async addBalance (e) {
        e.stopPropagation()
        this.disable()
        try {
          await accountsService.createBalance(this.ticket.code)
          await this.loadBalances()
          EventDispatcher.dispatchShowSuccessEvent(i18n.tickets_followed())
        } catch (e) { ErrorHandler.processUnexpected(e) }
        this.enable()
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

$padding-side: 20px;

$ratio_16: 100%;
$ratio_9: $ratio_16 * (9/16);

.ticket-card {
  @include box-shadow();

  background: $col-md-block;
  font-weight: 200;
  overflow: hidden;
  position: relative;
  width: $ratio_16;
  color: $col-md-primary;

  &:before {
    bottom: 0;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
}

.ticket-card__image-wrp {
  position: relative;
  padding-bottom: $ratio_9;

  img {
    position: absolute;
    object-fit: cover;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}

.ticket-card__content {
  padding: 1rem;
  height: 7.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.ticket-card__name {
  font-weight: 600;
  font-size: 2 * $point;
  line-height: 4 * $point;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ticket-card__header {
  position: relative;
}

.ticket-card__syndicate {
  color: $col-active;
  font-style: italic;
}

.ticket-card__syndicate,
.ticket-card__description {
  font-size: $fs-tip;
}

.ticket-card__description {
  $line-height: 1.15rem;
  $max-lines: 3;
  text-align: justify;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: $max-lines;
  -webkit-box-orient: vertical;
  line-height: $line-height;
  max-height: 3.45rem;
  min-height: 3.45rem;
}

.ticket-card__state-tip {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem 3rem;
  transform: translate(32%, 33%) rotate(45deg);
  color: $col-msg-text;

  &--upcoming {
    background: $col-pending;
  }
  &--finished {
    background: $col-success;
  }
  &--cancelled {
    background: $col-danger;
  }
}

.ticket-card__follow-btn {
  position: absolute;
  top: 0;
  right: 1rem;
  transform: translateY(-50%);
}

</style>
