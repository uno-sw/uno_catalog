<template>
  <div class="row justify-content-center mx-0">
    <div class="col-md-6">
      <b-card header="ログイン">
        <form @submit.prevent="login">
          <label for="email">メールアドレス</label>
          <b-form-input id="email" type="email" v-model="email" />
          <label class="mt-2" for="password">パスワード</label>
          <b-form-input id="password" type="password" v-model="password" />
          <div class="text-right">
            <b-button
              class="mt-3"
              type="submit"
              variant="primary"
            >
              ログイン
            </b-button>
          </div>
        </form>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      const credentials = { email: this.email, password: this.password }
      await this.$store.dispatch('auth/login', credentials)
      this.$router.push('/')
    },
  },
}
</script>
