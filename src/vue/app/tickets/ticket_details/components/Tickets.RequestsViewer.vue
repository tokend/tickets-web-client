<template>
  <div class="request-viewer">
    <template v-if="!requests.length">
      <no-data-message icon-name="list_alt"
                       :msg-title="i18n.tickets_the_list_is_empty()"
                       :msg-message="i18n.tickets_you_havent_requested_yet()"/>
    </template>
    <template v-else>
      <table class="request-viewer__list">
        <tr class="request-viewer__record">
          <th class="request-viewer__record-cell request-viewer__record-cell--left"></th>
          <th class="request-viewer__record-cell request-viewer__record-cell">{{ 'ticket_state' | translate }}</th>
          <th class="request-viewer__record-cell">{{ 'ticket_quote_asset' | translate }} </th>
          <th class="request-viewer__record-cell">{{ 'ticket_address_info' | translate }} </th>
        </tr>

        <template v-for="request in requests">


          <tr class="request-viewer__record">
            <td class="request-viewer__record-cell
                       request-viewer__record-cell--left
                       request-viewer__record-cell--bold
            ">
              {{ i18n.n(request.baseAmount) }} ticket{{ Number(request.baseAmount) >= 2 ? 's' : '' }}
            </td>
            <td :class="`request-viewer__record-cell
                         request-viewer__record-cell--left
                         request-viewer__state-cell
                         request-viewer__state-cell--${REQUEST_STATES_VERBOSE[request.state] || request.state}`">
              {{ REQUEST_STATES_VERBOSE[request.state] || request.state }}
            </td>
            <td class="request-viewer__record-cell">
              {{ request.quoteAsset }}
            </td>
            <td class="request-viewer__record-cell">
              <template v-if="request.address && ((REQUEST_STATES_VERBOSE[request.state] || request.state) !== REQUEST_STATES_VERBOSE.permanently_rejected)">
                <button class="app__button-icon" @click="activeRequest = request; isDialogOpened = true">
                  <md-icon md-src="/static/qr-code.svg" />
                </button>
              </template>
            </td>
          </tr>
        </template>
      </table>
    </template>

    <md-dialog :md-active.sync="isDialogOpened">
      <div class="app__dialog-inner">
        <template v-if="activeRequest">
          <swap-address :request="activeRequest" @close="activeRequest = null; isDialogOpened = false"/>
        </template>
        <template v-else>Oops... Something went wrong</template>
      </div>
    </md-dialog>
  </div>
</template>

<script>
  import NoDataMessage from '../../../../common/messages/NoDataMessage'
  import SwapAddress from './Tickets.AddressViewer'

  import { REQUEST_STATES_VERBOSE } from '../../../../../js/const/request_states.const'
  import { i18n } from '../../../../../js/i18n'

  export default {
    name: 'TicketsRequestsViewer',
    props: ['requests'],
    data: _ => ({
      i18n,
      isDialogOpened: false,
      activeRequest: null,
      REQUEST_STATES_VERBOSE
    }),
    components: {
      NoDataMessage,
      SwapAddress
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";
  @import "~@scss/mixins";

  .request-viewer {
    @include respond-to-custom(840px) {
      max-width: 90vw;
      overflow-y: scroll;
    }
  }

  .request-viewer__record-cell {
    $padding: 3 * $point;

    color: $col-md-primary;
    padding: $point $padding $point 0;
    text-align: center;
    white-space: nowrap;

    &--left { text-align: left }
    &--bold { font-weight: bold }
  }

  .request-viewer__state-cell:before {
    $size: .55rem;

    content: "";
    display: inline-block;
    margin-right: .5rem;
    border-radius: 50%;
    position: relative;
    top: .02rem;
    height: $size;
    width: $size;
  }

  .request-viewer__state-cell--rejected:before,
  .request-viewer__state-cell--canceled:before,
  .request-viewer__state-cell--cancelled:before {
    background-color: $col-md-accent;
  }

  .request-viewer__state-cell--pending:before {
    background-color: #ffb454;
  }

  .request-viewer__state-cell--approve:before{
    background-color: #51ca90;
  }
</style>
