<template>
  <b-navbar type="dark" variant="dark">
    <b-container>
      <b-navbar-brand tag="router-link" to="/">Uno Catalog</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown v-if="isLogin" :text="username" right>
          <b-dropdown-item @click.prevent="logout">ログアウト</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-else tag="router-link" to="/login">
          ログイン
        </b-nav-item>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
      apiStatus: state => state.auth.apiStatus,
    }),
    ...mapGetters({
      isLogin: 'auth/check',
      username: 'auth/username',
    }),
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout')

      if (this.apiStatus) {
        this.$router.push('/login')
      }
    },
  },
}
</script>
