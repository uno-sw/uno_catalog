<template>
  <FormSection title="製品を削除">
    <b-button block variant="danger" @click="deleteProduct">
      この製品を削除
    </b-button>
  </FormSection>
</template>

<script>
import FormSection from './FormSection.vue'
import client from '../client'
import { OK } from '../util'

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
      required: true,
    },
  },
  methods: {
    async deleteProduct() {
      const result = await this.$bvModal.msgBoxConfirm(
        '削除した製品は元に戻せません。',
        {
          title: `${this.name}を削除します`,
          okTitle: '削除',
          okVariant: 'danger',
          cancelTitle: 'キャンセル',
        },
      )

      if (!result) {
        return
      }

      const response = await client.delete(`/api/products/${this.id}`)

      if (!response) {
        this.$store.commit('error/setCode', 0)
        this.$store.commit('error/setMessage', 'ネットワークに接続されていません')
        return
      }

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        this.$store.commit(
          'error/setMessage',
          `製品「${this.name}」の削除に失敗しました`,
        )
        return
      }

      this.$root.$bvToast.toast(`製品「${this.name}」を削除しました`, {
        variant: 'success',
        solid: true,
      })
      this.$router.push('/')
    },
  },
}
</script>
