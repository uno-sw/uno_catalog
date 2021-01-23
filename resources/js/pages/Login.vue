<template>
  <div class="row justify-content-center mx-0">
    <div class="col-md-6">
      <b-card header="ログイン">
        <form @submit.prevent="login">
          <b-alert v-if="errors" variant="danger" show>
            <ul v-if="errors.email" class="mb-0 pl-3">
              <li v-for="msg in errors.email" :key="msg">{{ msg }}</li>
            </ul>
            <ul v-if="errors.password" class="mb-0 pl-3">
              <li v-for="msg in errors.password" :key="msg">{{ msg }}</li>
            </ul>
          </b-alert>
          <b-form-group label="メールアドレス" label-for="email">
            <b-form-input id="email" type="email" v-model="form.email" />
          </b-form-group>
          <b-form-group label="パスワード" label-for="password">
            <b-form-input id="password" type="password" v-model="form.password" />
          </b-form-group>
          <div class="text-right">
            <b-button type="submit" variant="primary">ログイン</b-button>
          </div>
        </form>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    }
  },
  computed: {
    ...mapState({
      apiStatus: state => state.auth.apiStatus,
      errors: state => state.auth.loginErrorMessages,
    }),
  },
  methods: {
    async login() {
      await this.$store.dispatch('auth/login', this.form)

      if (this.apiStatus) {
        this.$router.push('/')
      }
    },
    clearError() {
      this.$store.commit('auth/setLoginErrorMessages', null)
    },
  },
  created() {
    this.clearError()
  },
}
</script>
