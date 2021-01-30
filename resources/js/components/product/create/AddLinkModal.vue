<template>
  <b-modal
    id="add-link"
    title="リンクを追加"
    cancel-title="キャンセル"
    ok-title="追加"
    header-close-label="閉じる"
    @ok="add"
    @hidden="reset"
  >
    <b-form-group label="タイトル" label-for="link-title">
      <b-form-input
        id="link-title"
        type="text"
        v-model="values.title"
        :state="states.title"
        aria-describedby="link-title-error"
        trim
      />
      <b-form-invalid-feedback id="link-title-error">
        {{ errors.title }}
      </b-form-invalid-feedback>
    </b-form-group>
    <b-form-group label="URL" label-for="link-url">
      <b-form-input
        id="link-url"
        type="text"
        v-model="values.url"
        :state="states.url"
        aria-describedby="link-url-error"
        trim
      />
      <b-form-invalid-feedback id="link-url-error">
        {{ errors.url }}
      </b-form-invalid-feedback>
    </b-form-group>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      values: {
        title: '',
        url: '',
      },
      states: {
        title: null,
        url: null,
      },
      errors: {
        title: null,
        url: null,
      },
    }
  },
  methods: {
    validate() {
      let isValid = true

      this.states = { title: true, url: true }
      this.errors = { title: null, url: null }

      if (this.values.title.length === 0) {
        this.states.title = false
        this.errors.title = '入力されていません'
        isValid = false
      }

      const urlRegExp = /^https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+$/
      if (this.values.url.length === 0) {
        this.states.url = false
        this.errors.url = '入力されていません'
        isValid = false
      } else if (!urlRegExp.test(this.values.url)) {
        this.states.url = false
        this.errors.url = '不正な形式のURLです'
        isValid = false
      }

      return isValid
    },
    add(event) {
      if (!this.validate()) {
        event.preventDefault()
        return
      }

      this.$emit('addLink', this.values)
    },
    reset() {
      this.values = { title: '', url: '' }
      this.states = { title: null, url: null }
      this.errors = { title: null, url: null }
    },
  },
}
</script>
