<template>
  <FormSection title="リンクを編集">
    <ul v-if="hasAnyLink">
      <li v-for="link in dataLinks" :key="link.id">
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
</template>

<script>
import AddLinkModal from './AddLinkModal.vue'
import FormSection from './FormSection.vue'
import client from '../client'
import { OK } from '../util'

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
    links: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      dataLinks: [],
    }
  },
  computed: {
    hasAnyLink() {
      return this.dataLinks.length > 0
    },
  },
  methods: {
    onAddLink(link) {
      this.dataLinks.push(link)
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

      if (!result) {
        return
      }

      const response = await client.delete(`/api/links/${id}`)

      if (!response) {
        this.$store.commit('error/setCode', 0)
        this.$store.commit('error/setMessage', 'ネットワークに接続されていません')
        return
      }

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        this.$store.commit('error/setMessage', `リンク「${title}」の削除に失敗しました`)
        return
      }

      this.dataLinks = this.dataLinks.filter(link => link.id !== id)
      this.$bvToast.toast(`リンク「${title}」を削除しました`, {
        variant: 'success',
        solid: true,
      })
    },
  },
  created() {
    this.dataLinks = this.links.slice()
  },
}
</script>
