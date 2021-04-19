<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-container>
      <b-navbar-brand tag="router-link" to="/">Uno Catalog</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="isLoggedIn">
          <b-nav-item href="#" @click.prevent="showRegisterProductModal">
            製品を登録
          </b-nav-item>
          <RegisterProductModal @register="onRegisterProduct" />
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
import RegisterProductModal from './RegisterProductModal.vue'

export default {
  components: {
    RegisterProductModal,
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['auth/check']
    },
    username() {
      return this.$store.getters['auth/username']
    },
    apiStatus() {
      return this.$store.getters['auth/apiStatus']
    },
  },
  methods: {
    showRegisterProductModal() {
      this.$bvModal.show('register-product')
    },
    async onRegisterProduct(product) {
      this.$bvToast.toast('製品を編集', {
        title: `製品「${product.name}」を登録しました`,
        variant: 'success',
        solid: true,
        to: `/products/${product.id}/edit`,
      })
      if (this.$route.path === '/') {
        this.$store.commit('product/setIsLoading', true)
        await this.$store.dispatch('product/fetchProducts')
        this.$store.commit('product/setIsLoading', false)
      } else {
        this.$router.push('/')
      }
    },
    async logout() {
      await this.$store.dispatch('auth/logout')

      if (this.apiStatus) {
        this.$router.push('/login')
        this.$root.$bvToast.toast('ログアウトしました', {
          variant: 'success',
          solid: true,
        })
      }
    },
  },
}
</script>
