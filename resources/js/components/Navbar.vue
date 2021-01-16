<template>
  <b-navbar type="dark" variant="dark">
    <b-navbar-brand tag="router-link" to="/">UnoLearning</b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown v-if="isLogin" :text="username" right>
        <b-dropdown-item @click.prevent="logout">ログアウト</b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item v-else tag="router-link" to="/login">
        ログイン
      </b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  computed: {
    isLogin() {
      return this.$store.getters['auth/check']
    },
    username() {
      return this.$store.getters['auth/username']
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
  },
}
</script>
