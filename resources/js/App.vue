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

<script lang="ts">
import Vue from 'vue'
import Navbar from './components/Navbar.vue'
import { NOT_FOUND, UNAUTHORIZED } from './util'

export default Vue.extend({
  components: {
    Navbar,
  },
  computed: {
    errorCode(): number | null {
      return this.$store.getters['error/code']
    },
    errorMessage(): string {
      return this.$store.getters['error/message']
    },
  },
  watch: {
    errorCode: {
      handler(val: number | null) {
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
})
</script>
