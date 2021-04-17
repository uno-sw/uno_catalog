<template>
  <b-modal
    id="register-product"
    title="製品を登録"
    header-close-label="閉じる"
    @ok="register"
    @hidden="reset"
  >
    <b-form-group
      label="製品名"
      label-for="name"
      :state="error ? false : null"
      :invalid-feedback="error"
    >
      <b-form-input
        id="name"
        type="text"
        v-model="name"
        :state="error ? false : null"
      />
    </b-form-group>
    <template #modal-footer="{ hide, cancel }">
      <b-button :disabled="isProcessing" @click="cancel">キャンセル</b-button>
      <b-button :disabled="isProcessing" variant="primary" @click="register(hide)">
        <b-spinner label="処理中" small type="grow" v-if="isProcessing" />
        追加
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import client from '../client'
import { CREATED, UNPROCESSABLE_ENTITY } from '../util'

export default {
  data() {
    return {
      name: '',
      error: '',
      isProcessing: false,
    }
  },
  methods: {
    register(hide) {
      const wait = new Promise(resolve => setTimeout(() => resolve(), 1000))
      const request = client.post(`/api/products`, { name: this.name })

      this.isProcessing = true
      Promise.all([wait, request]).then(values => {
        this.isProcessing = false
        const response = values[1]
        if (response.status === UNPROCESSABLE_ENTITY) {
          this.error = this.formatErrors(response.data.errors)
          return false
        }

        if (response.status !== CREATED) {
          this.$store.commit('error/setCode', response.status)
          this.$store.commit('error/setMessage', '製品の登録に失敗しました')
          return false
        }

        this.$emit('register', { id: response.data.id, name: this.name })
        hide()
      })
    },
    reset() {
      this.name = ''
      this.error = ''
    },
    formatErrors(errors) {
      if (errors.name && errors.name.length > 0) {
        return errors.name[0]
      }
      return ''
    },
  },
}
</script>
