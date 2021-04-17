<template>
  <ErrorHandler>
    <header>
      <Navbar />
    </header>
    <b-container tag="main" class="py-4">
      <RouterView />
    </b-container>
  </ErrorHandler>
</template>

<script>
import ErrorHandler from './components/ErrorHandler.vue'
import Navbar from './components/Navbar.vue'

export default {
  components: {
    ErrorHandler,
    Navbar,
  },
  watch: {
    $route() {
      this.$store.commit('error/setCode', null)
      this.$store.commit('error/setMessage', '')
    },
  },
}
</script>
