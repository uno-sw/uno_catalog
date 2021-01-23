<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main class="py-4">
      <RouterView />
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import { NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from './util'

export default {
  components: {
    Navbar,
  },
  computed: {
    errorCode() {
      return this.$store.state.error.code
    },
  },
  watch: {
    errorCode: {
      handler(val) {
        if (val === INTERNAL_SERVER_ERROR) {
          this.$router.push('/500')
        } else if (val === UNAUTHORIZED) {
          this.$store.commit('auth/setUser', null)
          this.$router.push('/login')
        } else if (val === NOT_FOUND) {
          this.$router.push('/not-found')
        }
      },
      immediate: true,
    },
    $route() {
      this.$store.commit('error/setCode', null)
    },
  },
}
</script>
