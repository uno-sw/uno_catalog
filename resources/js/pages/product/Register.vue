<template>
  <b-row class="justify-content-center">
    <b-col md="8">
      <b-card header="製品の登録">
        <b-form @submit.prevent="register">

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

          <div class="text-right">
            <b-button type="submit" variant="primary">登録</b-button>
          </div>

        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { CREATED, UNPROCESSABLE_ENTITY } from '../../util'

export default {
  data() {
    return {
      values: {
        name: '',
        price: '',
        tags: [],
        note: '',
      },
      errors: {},
    }
  },
  methods: {
    async register() {
      const response = await axios.post('/api/products', this.values)

      if (response.status === UNPROCESSABLE_ENTITY) {
        this.errors = this.formatErrorMessages(response.data.errors)
        return false
      }

      if (response.status !== CREATED) {
        this.$store.commit('error/setCode', response.status)
        return false
      }

      this.$store.commit('message/setMessage', {
        content: '製品を登録しました',
        variant: 'success',
        dismissible: true,
      })

      this.$router.push('/')
    },
    formatErrorMessages(errors) {
      const ret = {}
      if (errors) {
        if (errors.name && errors.name.length >= 1) {
          ret['name'] = errors.name[0]
        }
        if (errors.price && errors.price.length >= 1) {
          ret['price'] = errors.price[0]
        }
        if (errors.note && errors.note.length >= 1) {
          ret['note'] = errors.note[0]
        }
        const tagsKey = Object.keys(errors).find(key => /^tags($|\.)/.test(key))
        if (tagsKey && errors[tagsKey] && errors[tagsKey].length >= 1) {
          ret['tags'] = errors[tagsKey][0]
        }
      }
      return ret
    },
  },
}
</script>

<style>
  .b-form-tags-button { flex-shrink: 0; }
</style>
