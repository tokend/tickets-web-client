<template>
  <md-tabs md-card class="requests__tabs" md-sync-route :md-dynamic-height="true">
    <md-tab :md-label="`${ i18n.lbl_tickets_creation()}`" to="/requests/token-creation">
      <token-creation />
    </md-tab>
    <!-- TODO: temp/ hidden -->
    <!-- <md-tab :md-label="`${ i18n.lbl_sale_creation()}`" to="/requests/sale-creation">
      <sale-creation />
    </md-tab>
    <md-tab :md-label="`${ i18n.preis_upload()}`">
      <pre-issuance-upload />
    </md-tab> -->
  </md-tabs>
</template>

<script>
import TokenCreation from './Requests.TokenCreation'
import PreIssuanceUpload from './Requests.PreissuanceUpload'
import SaleCreation from './Requests.SaleCreation'
import { i18n } from '../../../../js/i18n'
export default {
  components: {
    TokenCreation,
    SaleCreation,
    PreIssuanceUpload
  },
  data: _ => ({
    i18n
  })
}
</script>

<style lang="scss">
@import "~@scss/variables";

.requests__tabs {
  .md-title,
  .md-table-cell-container {
    color: $col-md-primary !important;
  }

  .md-table-head-label {
    color: $col-md-primary-inactive !important;
  }

  .md-tabs-indicator {
    background-color: $col-md-primary-secondary-inactive !important;
  }

  .md-button:hover {
    background-color: $col-md-primary-secondary-tabs-hover !important;
  }
  .md-button:not([disabled]).md-focused:before, .md-button:not([disabled]):active:before, .md-button:not([disabled]):hover:before {
    background-color: $col-md-primary-secondary-tabs-hover !important;
  }

  .md-tab {
    padding: 0;
  }

  .md-card {
    box-shadow: none;
  }

  .md-tabs-content {
    height: auto !important;
    min-height: 100% !important;
    background-color: transparent;
  }
}
</style>
