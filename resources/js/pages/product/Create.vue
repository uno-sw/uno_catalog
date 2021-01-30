<template>
  <b-container>
    <b-row class="justify-content-center">
      <b-col md="8">
        <b-card header="製品の登録">
          <b-form @submit.prevent="register">

            <b-form-group label="製品名" label-for="name">
              <b-form-input
                id="name"
                type="text"
                v-model="values.name"
                required
              />
            </b-form-group>

            <b-form-group label="価格" label-for="price">
              <b-input-group prepend="¥">
                <b-form-input
                  id="price"
                  type="number"
                  min="0"
                  v-model="values.price"
                  required
                />
              </b-input-group>
            </b-form-group>

            <b-form-group label="タグ" label-for="tags">
              <b-form-tags
                input-id="tags"
                placeholder="タグを入力"
                tag-remove-label="タグを削除"
                tag-removed-label="タグが削除されました"
                duplicate-tag-text="重複しているタグ"
                v-model="values.tags"
              >
              </b-form-tags>
            </b-form-group>

            <b-form-group label="リンク">
              <ul v-if="values.links.length !== 0">
                <li v-for="link in values.links" :key="link.id">
                  <strong>{{ link.title }}</strong> - {{ link.url }}
                  <b-button-close aria-label="削除" @click="removeLink(link.id)" />
                </li>
              </ul>
              <b-button variant="light" v-b-modal.add-link>追加</b-button>
              <AddLinkModal @addLink="addLink" />
            </b-form-group>

            <b-form-group label="メモ" label-for="note">
              <b-form-textarea
                id="note"
                max-rows="5"
                v-model="values.note"
              />
            </b-form-group>

            <div class="text-right">
              <b-button type="submit">登録</b-button>
            </div>

          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import AddLinkModal from '../../components/product/create/AddLinkModal'

export default {
  components: {
    AddLinkModal,
  },
  data() {
    return {
      values: {
        name: '',
        price: 0,
        tags: [],
        links: [],
        note: '',
      },
      linksNextId: 0,
    }
  },
  methods: {
    addLink({ title, url }) {
      this.values.links.push({ id: this.linksNextId++, title, url })
    },
    removeLink(id) {
      const indexToRemove = this.values.links.findIndex(link => link.id === id)
      this.values.links.splice(indexToRemove, 1)
    },
    register() {},
  },
}
</script>

<style scoped>
  .b-form-tags-button { flex-shrink: 0; }
</style>
