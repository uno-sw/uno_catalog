<template>
  <div>
    <div v-if="isLoading" class="d-flex justify-content-center">
      <b-spinner class="m-5" label="読み込み中" />
    </div>
    <div v-else>
      <EditProductSection v-bind="values" :id="id" />
      <EditLinkSection :id="id" :links="links" />
      <DeleteProductSection :id="id" :name="values.name" />
    </div>
  </div>
</template>

<script>
import DeleteProductSection from '../../components/DeleteProductSection.vue'
import EditLinkSection from '../../components/EditLinkSection.vue'
import EditProductSection from '../../components/EditProductSection.vue'
import client from '../../client'
import { OK } from '../../util'

export default {
  components: {
    DeleteProductSection,
    EditLinkSection,
    EditProductSection,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      values: {},
      links: [],
      isLoading: true,
    }
  },
  async created() {
    const wait = new Promise(resolve => setTimeout(() => resolve(), 1000))
    const request = await client.get(`/api/products/${this.id}`)

    this.isLoading = true
    const [, response] = await Promise.all([wait, request])
    this.isLoading = false

    if (!response) {
      this.$store.commit('error/setCode', 0)
      this.$store.commit('error/setMessage', 'ネットワークに接続されていません')
      return
    }

    if (response.status !== OK) {
      this.$store.commit('error/setCode', response.status)
      this.$store.commit('error/setMessage', '製品情報の読み込みに失敗しました')
      return
    }

    this.values.name = response.data.data.name
    this.values.price = response.data.data.price
    this.values.note = response.data.data.note
    this.values.tags = response.data.data.tags.map(tag => tag.label)
    this.values.image_url = response.data.data.image_url
    this.links = response.data.data.links
  },
}
</script>
