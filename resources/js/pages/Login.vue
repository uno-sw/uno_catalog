<template>
  <b-container>
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
                <b-button type="submit" variant="primary">ログイン</b-button>
              </b-col>
            </b-form-row>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
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
