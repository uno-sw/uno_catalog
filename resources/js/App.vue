<template>
  <div>
    <header>
      <Navbar />
    </header>
    <b-container tag="main" class="py-4">
      <Message />
      <RouterView />
    </b-container>
  </div>
</template>

<script>
import Message from './components/Message.vue'
import Navbar from './components/Navbar.vue'
import { NOT_FOUND, UNAUTHORIZED, INTERNAL_SERVER_ERROR } from './util'

export default {
  components: {
    Message,
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
      this.$store.commit('message/setMessage', { content: '' })
    },
  },
}
</script>
