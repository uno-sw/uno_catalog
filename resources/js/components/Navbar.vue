<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-container>
      <b-navbar-brand tag="router-link" to="/">Uno Catalog</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="isLoggedIn">
          <b-nav-item to="/products/register">製品を登録</b-nav-item>
          <b-nav-item to="/tags">タグ</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown v-if="isLoggedIn" :text="username" right>
            <b-dropdown-item @click.prevent="logout">ログアウト</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item v-if="!isLoggedIn" to="/login">ログイン</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
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
      isLoggedIn: 'auth/check',
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
