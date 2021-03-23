<template>
  <div>
    <div v-if="isLoading" class="d-flex justify-content-center">
      <b-spinner label="読み込み中" />
    </div>
    <div v-else>
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
      <FormSection title="リンクを編集">
        <ul v-if="links && links.length > 0">
          <li v-for="link in links" :key="link.url">
            <strong>{{ link.title }}</strong> - {{ link.url }}
            <a href="#" @click.prevent="deleteLink(link.id, link.title)">削除</a>
          </li>
        </ul>
        <p v-else class="text-muted">リンクはありません</p>
        <div class="text-right">
          <b-button v-b-modal.add-link variant="light">リンクを追加</b-button>
        </div>
        <AddLinkModal :productId="id" @addLink="onAddLink" />
      </FormSection>
      <FormSection title="製品を削除">
        <b-button block variant="danger" @click="deleteProduct">この製品を削除</b-button>
      </FormSection>
    </div>
  </div>
</template>

<script>
import AddLinkModal from '../../components/AddLinkModal'
import FormSection from '../../components/FormSection'
import { OK, UNPROCESSABLE_ENTITY } from '../../util'

export default {
  components: {
    AddLinkModal,
    FormSection,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      values: {
        name: '',
        price: '',
        tags: [],
        note: '',
        image_url: '',
      },
      links: [],
      errors: {},
      isLoading: true,
      isEditProcessing: false,
    }
  },
  methods: {
    async fetchProduct() {
      const wait = new Promise(resolve => setTimeout(() => resolve(), 1000))
      const request = await axios.get(`/api/products/${this.id}`)

      this.isLoading = true
      const [, response] = await Promise.all([wait, request])
      this.isLoading = false

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        this.$store.commit('error/setMessage', '製品情報の読み込みに失敗しました')
        return false
      }

      this.values.name = response.data.data.name
      this.values.price = response.data.data.price
      this.values.note = response.data.data.note
      this.values.tags = response.data.data.tags.map(tag => tag.label)
      this.values.image_url = response.data.data.image_url
      this.links = response.data.data.links
    },
    async edit() {
      const wait = new Promise(resolve => setTimeout(() => resolve(), 1000))
      const request = axios.put(`/api/products/${this.id}`, this.values)

      this.isEditProcessing = true
      const [, response] = await Promise.all([wait, request])
      this.isEditProcessing = false

      if (response.status === UNPROCESSABLE_ENTITY) {
        this.errors = this.formatErrorMessages(response.data.errors)
        return false
      }

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        this.$store.commit('error/setMessage', '製品の編集に失敗しました')
      }

      this.$root.$bvToast.toast('製品を編集しました', {
        variant: 'success',
        solid: true,
      })
      this.$router.push(`/products/${this.id}`)
    },
    onAddLink(link) {
      this.links.push(link)
      this.$bvToast.toast(`リンク「${link.title}」を追加しました`, {
        variant: 'success',
        solid: true,
      })
    },
    async deleteLink(id, title) {
      const result = await this.$bvModal.msgBoxConfirm(
        `${title}を削除してもよろしいですか？`,
        {
          okTitle: '削除',
          okVariant: 'danger',
          cancelTitle: 'キャンセル',
        },
      )
      if (result) {
        const response = await axios.delete(`/api/links/${id}`)

        if (response.status !== OK) {
          this.$store.commit('error/setCode', response.status)
          this.$store.commit('error/setMessage', `リンク「${title}」の削除に失敗しました`)
          return false
        }

        this.links = this.links.filter(link => link.id !== id)
        this.$bvToast.toast(`リンク「${title}」を削除しました`, {
          variant: 'success',
          solid: true,
        })
      }
    },
    async deleteProduct() {
      const result = await this.$bvModal.msgBoxConfirm(
        '削除した製品は元に戻せません。',
        {
          title: `${this.values.name}を削除します`,
          okTitle: '削除',
          okVariant: 'danger',
          cancelTitle: 'キャンセル',
        },
      )

      if (result) {
        const response = await axios.delete(`/api/products/${this.id}`)

        if (response.status !== OK) {
          this.$store.commit('error/setCode', response.status)
          this.$store.commit(
            'error/setMessage',
            `製品「${this.values.name}」の削除に失敗しました`,
          )
          return false
        }

        this.$root.$bvToast.toast(`製品「${this.values.name}」を削除しました`, {
          variant: 'success',
          solid: true,
        })
        this.$router.push('/')
      }
    },
    formatErrorMessages(errors) {
      const ret = {}
      if (errors) {
        if (errors.name && errors.name.length > 0) {
          ret['name'] = errors.name[0]
        }
        if (errors.price && errors.price.length > 0) {
          ret['price'] = errors.price[0]
        }
        if (errors.note && errors.note.length > 0) {
          ret['note'] = errors.note[0]
        }
        if (errors.image_url && errors.image_url.length > 0) {
          ret['image_url'] = errors.image_url[0]
        }
        const tagsKey = Object.keys(errors).find(key => /^tags($|\.)/.test(key))
        if (tagsKey && errors[tagsKey] && errors[tagsKey].length > 0) {
          ret['tags'] = errors[tagsKey][0]
        }
      }
      return ret
    },
  },
  watch: {
    $route: {
      async handler() {
        await this.fetchProduct()
      },
      immediate: true,
    },
  },
}
</script>

<style>
  .b-form-tags-button { flex-shrink: 0; }
</style>
