<template>
  <FormSection title="製品を編集">
    <b-form @submit.prevent="edit">
      <b-form-group
        label="製品名"
        label-for="name"
        :state="errors.name ? false : null"
        :invalid-feedback="errors.name"
      >
        <b-form-input
          id="name"
          type="text"
          v-model="values.name"
          :state="errors.name ? false : null"
        />
      </b-form-group>

      <b-form-group
        label="価格"
        label-for="price"
        :state="errors.price ? false : null"
        :invalid-feedback="errors.price"
      >
        <b-input-group prepend="¥">
          <b-form-input
            id="price"
            type="number"
            min="0"
            v-model="values.price"
            :state="errors.price ? false : null"
          />
        </b-input-group>
      </b-form-group>

      <b-form-group
        label="タグ"
        label-for="tags"
        :state="errors.tags ? false : null"
        :invalid-feedback="errors.tags"
      >
        <b-form-tags
          input-id="tags"
          placeholder="タグを入力"
          add-button-text="追加"
          tag-remove-label="タグを削除"
          tag-removed-label="タグが削除されました"
          duplicate-tag-text="重複しているタグ"
          v-model="values.tags"
          :state="errors.tags ? false : null"
        >
        </b-form-tags>
      </b-form-group>

      <b-form-group
        label="メモ"
        label-for="note"
        :state="errors.note ? false : null"
        :invalid-feedback="errors.note"
      >
        <b-form-textarea
          id="note"
          max-rows="5"
          v-model="values.note"
          :state="errors.note ? false : null"
        />
      </b-form-group>

      <b-form-group
        label="画像URL"
        label-for="image-url"
        :state="errors.image_url ? false : null"
        :invalid-feedback="errors.image_url"
      >
        <b-form-input
          id="image-url"
          v-model="values.image_url"
          :state="errors.image_url ? false : null"
        />
      </b-form-group>

      <div class="text-right">
        <b-button :disabled="isEditProcessing" type="submit" variant="primary">
          <b-spinner label="処理中" small type="grow" v-if="isEditProcessing" />
          変更を適用
        </b-button>
      </div>
    </b-form>
  </FormSection>
</template>

<script>
import FormSection from './FormSection.vue'
import client from '../client'
import { OK, UNPROCESSABLE_ENTITY } from '../util'

export default {
  components: {
    FormSection,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
    price: {
      type: Number,
      required: false,
      default: '',
    },
    tags: {
      type: Array,
      required: false,
      default: () => [],
    },
    note: {
      type: String,
      required: false,
      default: '',
    },
    image_url: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      isEditProcessing: false,
      values: {},
      errors: {},
    }
  },
  methods: {
    async edit() {
      const wait = new Promise(resolve => setTimeout(() => resolve(), 1000))
      const request = client.put(`/api/products/${this.id}`, this.values)

      this.isEditProcessing = true
      const [, response] = await Promise.all([wait, request])
      this.isEditProcessing = false

      if (!response) {
        this.$store.commit('error/setCode', 0)
        this.$store.commit('error/setMessage', 'ネットワークに接続されていません')
        return
      }

      if (response.status === UNPROCESSABLE_ENTITY) {
        this.errors = this.formatErrorMessages(response.data.errors)
        return
      }

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        this.$store.commit('error/setMessage', '製品の編集に失敗しました')
        return
      }

      this.$root.$bvToast.toast('製品を編集しました', {
        variant: 'success',
        solid: true,
      })
    },
    formatErrorMessages(errors) {
      const ret = {}
      if (errors) {
        if (errors.name && errors.name.length > 0) {
          ret.name = errors.name[0]
        }
        if (errors.price && errors.price.length > 0) {
          ret.price = errors.price[0]
        }
        if (errors.note && errors.note.length > 0) {
          ret.note = errors.note[0]
        }
        if (errors.image_url && errors.image_url.length > 0) {
          ret.image_url = errors.image_url[0]
        }
        const tagsKey = Object.keys(errors).find(key => /^tags($|\.)/.test(key))
        if (tagsKey && errors[tagsKey] && errors[tagsKey].length > 0) {
          ret.tags = errors[tagsKey][0]
        }
      }
      return ret
    },
  },
  created() {
    this.values.name = this.name
    this.values.price = this.price
    this.values.tags = this.tags
    this.values.note = this.note
    this.values.image_url = this.image_url
  },
}
</script>

<style>
  .b-form-tags-button { flex-shrink: 0; }
</style>
