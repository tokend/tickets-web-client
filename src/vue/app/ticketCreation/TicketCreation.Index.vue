<template>
  <div class="create-token app__page-content-wrp">
    <div v-if="accountTypeI === ACCOUNT_TYPES.notVerified || accountTypeI !== ACCOUNT_TYPES.syndicate">
      <no-data-message icon-name='work'
                       :msg-title="i18n.lbl_not_available()"
                       :msg-message="i18n.lbl_token_not_available_exp()"/>
    </div>
    <ticket-manager v-else :id = "id" />
  </div>
</template>

<script>
  import TicketManager from './TicketCreation.Manager'
  import NoDataMessage from '@/vue/common/messages/NoDataMessage'

  import { ACCOUNT_TYPES } from '../../../js/const/const'
  import { vuexTypes } from '../../../vuex/types'
  import { mapGetters } from 'vuex'
  import { i18n } from '../../../js/i18n'

  export default {
    components: { TicketManager, NoDataMessage },
    props: ['id'],
    data: _ => ({
      i18n,
      ACCOUNT_TYPES
    }),
    computed: {
      ...mapGetters([
        vuexTypes.accountTypeI
      ])
    }
  }
</script>
