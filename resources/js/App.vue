<template>
  <div>
    <header>
      <Navbar />
    </header>
    <b-container tag="main" class="py-4">
      <RouterView />
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Navbar from './components/Navbar.vue'
import { NOT_FOUND, UNAUTHORIZED } from './util'

export default {
  components: {
    Navbar,
  },
  computed: mapState({
    errorCode: state => state.error.code,
    errorMessage: state => state.error.message,
  }),
  watch: {
    errorCode: {
      handler(val) {
        if (val === UNAUTHORIZED) {
          this.$store.commit('auth/setUser', null)
          this.$router.push('/login')
        } else if (val === NOT_FOUND) {
          this.$router.push('/not-found')
        } else if (val !== null && this.errorMessage) {
          this.$root.$bvToast.toast(this.errorMessage, {
            variant: 'danger',
            solid: true,
          })
        }
      },
      immediate: true,
    },
    $route() {
      this.$store.commit('error/setCode', null)
      this.$store.commit('error/setMessage', '')
    },
  },
}
</script>
