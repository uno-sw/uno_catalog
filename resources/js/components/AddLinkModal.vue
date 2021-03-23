<template>
  <b-modal
    id="add-link"
    title="リンクを追加"
    header-close-label="閉じる"
    @ok="add"
    @hidden="reset"
  >
    <b-form-group
      label="タイトル"
      label-for="link-title"
      :state="errors.title ? false : null"
      :invalid-feedback="errors.title"
    >
      <b-form-input
        id="link-title"
        type="text"
        v-model="values.title"
        :state="errors.title ? false : null"
      />
    </b-form-group>
    <b-form-group
      label="URL"
      label-for="link-url"
      :state="errors.url ? false : null"
      :invalid-feedback="errors.url"
    >
      <b-form-input
        id="link-url"
        type="text"
        v-model="values.url"
        :state="errors.url ? false : null"
      />
    </b-form-group>
    <template #modal-footer="{ hide, cancel }">
      <b-button :disabled="isProcessing" @click="cancel">キャンセル</b-button>
      <b-button :disabled="isProcessing" variant="primary" @click="add(hide)">
        <b-spinner label="処理中" small type="grow" v-if="isProcessing" />
        追加
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { CREATED, UNPROCESSABLE_ENTITY } from '../util'

export default {
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      values: {
        title: '',
        url: '',
      },
      errors: {},
      isProcessing: false,
    }
  },
  methods: {
    add(hide) {
      const wait = new Promise(resolve => setTimeout(() => resolve(), 1000))
      const request = axios.post(`/api/products/${this.productId}/links`, this.values)

      this.isProcessing = true
      Promise.all([wait, request]).then(values => {
        this.isProcessing = false
        const response = values[1]
        if (response.status === UNPROCESSABLE_ENTITY) {
          this.errors = this.formatErrors(response.data.errors)
          return false
        }

        if (response.status !== CREATED) {
          this.$store.commit('error/setCode', response.status)
          this.$store.commit('error/setMessage', 'リンクの追加に失敗しました')
          return false
        }

        this.$emit('addLink', {id: response.data.id, ...this.values})
        hide()
      })
    },
    reset() {
      this.values = { title: '', url: '' }
      this.states = { title: null, url: null }
      this.errors = { title: null, url: null }
    },
    formatErrors(errors) {
      const ret = {}
      if (errors.title && errors.title.length > 0) {
        ret['title'] = errors.title[0]
      }
      if (errors.url && errors.url.length > 0) {
        ret['url'] = errors.url[0]
      }
      return ret
    },
  },
}
</script>
