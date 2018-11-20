<template>
  <div class="ticket-manager">
    <h2 class="app__page-heading">{{ 'tokens_ticket_form_creation' | translate }}</h2>

    <form novalidate @submit.prevent="submit">

      <div class="app__form-section">
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field-unchained id="event-name" name="event-name"
                                   v-model="request.details.name"
                                   v-validate="'required'"
                                   :label="i18n.lbl_event_name()"
                                   :data-vv-as="i18n.lbl_event_name()"
                                   :errorMessage="errorMessage('event-name')"
            />
          </div>
          <div class="app__form-field">
            <input-field-unchained id="ticket-code" name="ticket-code"
                                   v-model="request.tokenCode"
                                   v-validate="'required'"
                                   :label="i18n.lbl_ticket_code()"
                                   :data-vv-as="i18n.lbl_ticket_code()"
                                   :errorMessage="errorMessage('ticket-code')"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field-unchained id="token-max-issuance-amount" type="number" name="max-issuance-amount"
                                   v-model="request.maxIssuanceAmount"
                                   v-validate="'required|amount'"
                                   :label="i18n.lbl_ticket_amount()"
                                   :data-vv-as="i18n.lbl_ticket_amount()"
                                   :errorMessage="errorMessage('max-issuance-amount')"
            />
          </div>
          <div class="app__form-field">
            <select-field-unchained v-model="request.details.stylePreset"
                                    :values="STYLE_PRESETS"
                                    :title="i18n.lbl_ticket_type()"
                                    :label="i18n.lbl_ticket_type()"
            />
          </div>
        </div>
      </div>


      <div class="app__form-section">
        <div class="app__form-row">
          <div class="app__form-field">
            <file-field file-type="image"
                        v-model="documents[documentTypes.icon]"
                        :label="i18n.lbl_ticket_icon()"
                        :minWidth='120'
                        :minHeight='120'
                        :accept="'image/*'"
                        :type="documentTypes.tokenIcon"
            />
          </div>
          <div class="app__form-field">
            <file-field file-type="image"
                        v-model="documents[documentTypes.splash]"
                        :label="i18n.lbl_ticket_image()"
                        :accept="'image/*'"
                        :type="documentTypes.tokenIcon"
            />
          </div>
        </div>
      </div>


      <div class="app__form-section">
        <h3 class="app__form-section-heading">{{ 'ticket_provide_event_details' | translate }}</h3>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field-unchained id="ticket-host-name" name="host-name"
                                   v-model="request.details.host.name"
                                   v-validate="'required'"
                                   :data-vv-as="i18n.lbl_ticket_host_name()"
                                   :label="i18n.lbl_ticket_host_name()"
                                   :errorMessage="errorMessage('host-name')"
            />
          </div>
          <div class="app__form-field">
            <input-field-unchained id="ticket-host-email" name="host-email"
                                   v-model="request.details.host.email"
                                   v-validate="'required'"
                                   :data-vv-as="i18n.lbl_ticket_host_email()"
                                   :label="i18n.lbl_ticket_host_email()"
                                   :errorMessage="errorMessage('host-email')"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <date-field-flatpickr id="event-starts-at" name="event-starts-at"
                                  v-model="request.details.eventStartsAt"
                                  v-validate="'required'"
                                  :key="`event-starts-at`"
                                  :data-vv-as="i18n.lbl_event_starts_at()"
                                  :label="i18n.lbl_event_starts_at()"
                                  :errorMessage="errorMessage('event-starts-at')"
            />
          </div>
          <div class="app__form-field">
            <date-field-flatpickr id="event-ends-at" name="event-ends-at"
                                  v-model="request.details.eventEndsAt"
                                  v-validate="'required'"
                                  :key="`event-ends-at`"
                                  :data-vv-as="i18n.lbl_event_ends_at()"
                                  :label="i18n.lbl_event_ends_at()"
                                  :errorMessage="errorMessage('event-ends-at')"
            />
          </div>
        </div>
        <div class="app__form-row">
          <textarea-field name="short-description"
                          v-model="request.details.shortDescription"
                          v-validate="'required'"
                          :label="i18n.lbl_ticket_short_description()"
                          :data-vv-as="i18n.lbl_ticket_short_description()"
                          :maxlength="180"
                          :errorMessage="errorMessage('short-description')"
          />
        </div>
        <div class="app__form-row">
          <textarea-field name="short-description"
                          v-model="request.details.longDescription"
                          v-validate="'required'"
                          :label="i18n.lbl_ticket_long_description()"
                          :data-vv-as="i18n.lbl_ticket_long_description()"
                          :maxlength="1000"
                          :errorMessage="errorMessage('long-description')"
          />
        </div>
      </div>


      <div class="app__form-section">
        <h3 class="app__form-section-heading">{{ 'ticktet_where_event_will_be' | translate }}</h3>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field-unchained id="event-address-city" name="event-address-city"
                                   v-model="request.details.eventAddress.city"
                                   v-validate="'required'"
                                   :data-vv-as="i18n.lbl_event_city()"
                                   :label="i18n.lbl_event_city()"
                                   :errorMessage="errorMessage('event-address-city')"
            />
          </div>
          <div class="app__form-field">
            <input-field-unchained id="event-address-institution" name="event-address-institution"
                                   v-model="request.details.eventAddress.institution"
                                   v-validate="'required'"
                                   :data-vv-as="i18n.lbl_event_institution()"
                                   :label="i18n.lbl_event_institution()"
                                   :errorMessage="errorMessage('event-address-institution')"
            />
          </div>
        </div>
        <div class="app__form-row">
          <input-field-unchained id="event-address-full" name="event-address-full"
                                 v-model="request.details.eventAddress.fullAddress"
                                 v-validate="'required'"
                                 :data-vv-as="i18n.lbl_event_full_address()"
                                 :label="i18n.lbl_event_full_address()"
                                 :errorMessage="errorMessage('event-address-full')"
          />
        </div>
      </div>

      <div class="app__form-section">
        <google-map @update-mark-position="updateMarkPosition"
                    class="ticket-manager__map" name="ticket-manager-map"
                    :allow-to-change-mark-position="true"
                    :initial-coordinates="request.details.eventCoordinates"
        />
      </div>

      <div class="app__form-actions">
        <button v-ripple
                type="submit"
                class="app__form-submit-btn"
                :disabled="isPending">
          {{ i18n.lbl_submit() }}
        </button>
      </div>
    </form>

  </div>
</template>

<script>
  import FormMixin from '../../common/mixins/form.mixin'
  import FileField from '../../common/fields/FileField'
  import GoogleMap from '../common/GoogleMap'

  import { i18n } from '../../../js/i18n'
  import { documentTypes } from '../../../js/const/documents.const'

  import { tokensService } from '../../../js/services/tokens.service'
  import { reviewableRequestsService } from '../../../js/services/reviewable_requests.service'
  import { fileService } from '../../../js/services/file.service'

  import { EventDispatcher } from '../../../js/events/event_dispatcher'
  import { ErrorHandler } from '../../../js/errors/error_handler'
  import { DocumentContainer } from '../../../js/helpers/DocumentContainer'

  import { TicketCreationRecord } from '@/js/records/ticket_creation.record'

  import config from '../../../config'
  import { ASSET_POLICIES } from '@/js/const/xdr.const'

  const DEFAULT_TICKET_POLICY =
    ASSET_POLICIES.transferable |
    ASSET_POLICIES.requiresKyc |
    ASSET_POLICIES.canBeBaseInAtomicSwap

  const STYLE_PRESETS = Object.freeze(['default', 'vip'])

  export default {
    mixins: [FormMixin],
    components: {
      FileField,
      GoogleMap
    },
    props: ['id'],
    data: _ => ({
      request: {
        policy: DEFAULT_TICKET_POLICY,
        tokenCode: '',
        maxIssuanceAmount: '',
        details: {
          name: '',
          host: {
            name: '',
            email: ''
          },
          shortDescription: '',
          longDescription: '',
          eventStartsAt: '',
          eventEndsAt: '',
          eventAddress: {
            city: '',
            institution: '',
            fullAddress: ''
          },
          eventCoordinates: {
            latitude: 50.450075,
            longitude: 30.524160
          },
          stylePreset: 'default'
        }
      },
      documents: {
        icon: null,
        splash: null
      },
      i18n,
      documentTypes,
      STYLE_PRESETS
    }),

    async created () {
      if (this.id) {
        this.request = new TicketCreationRecord(await reviewableRequestsService.loadReviewableRequestById(this.id))
        this.documents[documentTypes.splash] = this.request.splash.key ? new DocumentContainer(this.request.splash) : null
        this.documents[documentTypes.icon] = this.request.icon.key ? new DocumentContainer(this.request.icon) : null
      }
    },

    methods: {
      async submit () {
        if (!await this.isValid()) return
        this.disable()
        try {
          await this.uploadDocs()
          await this.createRequest()
          EventDispatcher.dispatchShowSuccessEvent(i18n.kyc_upload_success())
          this.$router.push({ path: '/requests/token-creation' })
        } catch (error) {
          console.error(error)
          ErrorHandler.processUnexpected(error)
        }
        this.enable()
      },

      updateMarkPosition (position) {
        this.request.details.eventCoordinates.latitude = position.latitude
        this.request.details.eventCoordinates.longitude = position.longitude
      },

      async uploadDocs () {
        const icon = this.documents[documentTypes.icon]
        const splash = this.documents[documentTypes.splash]

        if (icon && !icon.isUploaded) {
          icon.setKey(await fileService.uploadFile(icon.getDetailsForUpload()))
        }

        if (splash && !splash.isUploaded) {
          splash.setKey(await fileService.uploadFile(splash.getDetailsForUpload()))
        }
      },

      async createRequest () {
        await tokensService.createTokenCreationRequest({
          requestID: this.request.id ? this.request.id : '0',
          maxIssuanceAmount: this.request.maxIssuanceAmount,
          initialPreissuedAmount: this.request.maxIssuanceAmount,
          preissuedAssetSigner: config.NULL_ASSET_SIGNER,
          policies: this.request.policy,
          code: this.request.tokenCode,
          details: {
            icon: this.documents[documentTypes.icon] ? this.documents[documentTypes.icon].getDetailsForSave() : {},
            splash: this.documents[documentTypes.splash] ? this.documents[documentTypes.splash].getDetailsForSave() : {},
            ...this.request.details
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ticket-manager__map {
    height: 400px;
  }
</style>
