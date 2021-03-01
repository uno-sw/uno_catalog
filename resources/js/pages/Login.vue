<template>
  <b-row class="justify-content-center">
    <b-col md="8">
      <b-card header="ログイン">
        <b-form @submit.prevent="login">
          <b-alert v-if="errors" variant="danger" show>
            <ul v-if="errors.email" class="mb-0 pl-3">
              <li v-for="msg in errors.email" :key="msg">{{ msg }}</li>
            </ul>
            <ul v-if="errors.password" class="mb-0 pl-3">
              <li v-for="msg in errors.password" :key="msg">{{ msg }}</li>
            </ul>
          </b-alert>
          <b-form-group
            label="メールアドレス"
            label-for="email"
            label-align-md="right"
            label-cols-md="4"
            content-cols-md
          >
            <b-form-input id="email" type="email" v-model="form.email" />
          </b-form-group>
          <b-form-group
            label="パスワード"
            label-for="password"
            label-align-md="right"
            label-cols-md="4"
            content-cols-md
          >
            <b-form-input id="password" type="password" v-model="form.password" />
          </b-form-group>
          <b-form-row>
            <b-col offset-md="4">
              <b-form-group>
                <b-form-checkbox v-model="form.remember">
                  継続してログインする
                </b-form-checkbox>
              </b-form-group>
              <b-button type="submit" variant="primary">ログイン</b-button>
            </b-col>
          </b-form-row>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        remember: false,
      },
    }
  },
  computed: {
    ...mapState({
      apiStatus: state => state.auth.apiStatus,
      errors: state => state.auth.loginErrorMessages,
      forwardingRoute: state => state.auth.forwardingRoute,
    }),
  },
  methods: {
    async login() {
      await this.$store.dispatch('auth/login', this.form)

      if (this.apiStatus) {
        if (this.forwardingRoute) {
          this.$router.push(this.forwardingRoute)
          this.$store.commit('auth/setForwardingRoute', null)
        } else {
          this.$router.push('/')
        }
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
