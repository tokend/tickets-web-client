<template>
  <div class="details-ticket">
    <div v-if="ticketInfo.stylePreset === VIP_TICKET_TYP"
         class="details-ticket__vip">VIP</div>
    <div class="details-ticket__qr">
      <div v-if="selectTicket !== id"
           class="details-ticket__qr-absolute details-ticket__qr-blackout"></div>
      <qrcode :text="qrMessage"
              :size="240"
              @click.native="selectQr(UNSELECT_ID)"
              color="#3f4244"
              class="details-ticket__qr-absolute"
      />
      <button v-if="selectTicket !== id"
              type="submit"
              @click="selectQr(id)"
              class="app__form-submit-btn">
        {{ 'ticket_qr_btn' | translate() }}
      </button>
    </div>
    <div class="details-ticket__info">
      <div class="details-ticket__line-info">
        <md-icon class="md-size-2x details-ticket__icon">
          details
        </md-icon>
        <div class="details-ticket-text-info">
          {{ ticketInfo.name }} ({{ticketInfo.code}})
        </div>
      </div>
      <div class="details-ticket__line-info">
        <md-icon class="md-size-2x details-ticket__icon">
          today
        </md-icon>
        {{ 'ticket_details_label_starts_at' | translate }}:
        {{ ticketInfo.eventStartsAt | formatDate('DoMT') }}
      </div>
      <div class="details-ticket__line-info">
        <md-icon class="md-size-2x details-ticket__icon">
          place
        </md-icon>
        <div class="details-ticket-text-info">
          {{ ticketInfo.eventAddress.city }}
          {{ ticketInfo.eventAddress.institution }}
          {{ ticketInfo.eventAddress.fullAddress }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { vuexTypes } from '@/vuex/types'
  import { commonEvents } from '@/js/events/common_events'
  import Qrcode from 'vue-qrcode-component'

  const UNSELECT_ID = -1
  const VIP_TICKET_TYP = 'vip'

  export default {
    props: ['asset', 'ticketInfo', 'id', 'selectTicket', 'nameSurname'],
    components: {
      Qrcode
    },
    data: _ => ({
      UNSELECT_ID,
      VIP_TICKET_TYP
    }),
    methods: {
      selectQr (id) {
        this.$emit(commonEvents.selectTicket, id)
      },
      arrayBufferToBase64 (buffer) {
        var binary = ''
        var bytes = new Uint8Array(buffer)
        var len = bytes.byteLength
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        return window.btoa(binary)
      }
    },
    computed: {
      ...mapGetters([
        vuexTypes.userEmail,
        vuexTypes.accountSeed,
        vuexTypes.accountKeypair
      ]),
      validationData () {
        return `${this.asset} ${this.userEmail} ${+new Date()}`
      },
      qrMessage () {
        return JSON.stringify({
          pl: `${this.validationData} ${this.arrayBufferToBase64(this.accountKeypair.sign(this.validationData))}`,
          name: this.nameSurname
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "~@scss/variables";

  .details-ticket {
    min-width: 290px;
    max-width: 290px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: $white;
    margin: 10px 10px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .2), 0 2px 2px rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .12);
  }

  .details-ticket__qr {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .details-ticket__info {
    width: 100%;
    display: block;
    font-size: 1rem;
    padding: 15px 7px 6px 10px;
  }

  .details-ticket__line-info {
    width: 100%;
    max-width: 100%;
    display: flex;
    overflow: auto;
    text-align: left;
    align-items: center;
    padding-bottom: 15px;
  }

  .details-ticket__icon {
    margin: 0;
    font-size: 28px !important;
    min-width: 32px !important;
    width: 35px;
    height: 32px;
    margin-right: 7px;
  }

  .details-ticket__vip {
    width: 100%;
    padding: 8px 0;
    display: flex;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 600;
    color: lightgray;
  }

  .details-ticket__qr-absolute {
    width: 240px;
    height: 240px;
    position: absolute;
    top: 30px;
    left: 25px;
    z-index: 2;
  }

  .details-ticket__qr-blackout {
    background: white;
    z-index: 3;
    opacity: 0.8;
  }

  .details-ticket__qr .app__form-submit-btn {
    z-index: 4;
  }
</style>

