 <template>
  <div class="auth-page">
    <div class="auth-page__titles">
      <h3 class="auth-page__title-small">{{ i18n.auth_phrase() }}</h3>
      <h1 class="auth-page__title" v-html="i18n.auth_title()"></h1>
    </div>
    <div class="auth-page__form">
      <logotype class="auth-page__form-logotype"/>
      <router-view/>
      <app-footer/>
    </div>
  </div>
</template>

<script>
  import { i18n } from '@/js/i18n'
  import Logotype from '../app/common/Logotype'
  import AppFooter from '../navigation/Footer'

  export default {
    components: {
      Logotype,
      AppFooter
    },

    data () {
      return {
        i18n
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'auth';
  @import '~@scss/variables';
  .auth-page__form {
    padding-bottom: 3.5 * $point;
  }

  .auth-page__form-logotype {
    display: block;
    max-width: 390px;
    width: 100%;
  }

  .auth-page__titles {
    z-index: 1;
  }
</style>
