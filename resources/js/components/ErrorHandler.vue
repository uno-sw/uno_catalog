<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { NOT_FOUND, UNAUTHORIZED } from '../util'

export default {
  computed: {
    errorCode() {
      return this.$store.getters['error/code']
    },
    errorMessage() {
      return this.$store.getters['error/message']
    },
  },
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
  },
}
</script>
