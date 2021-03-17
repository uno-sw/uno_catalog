<template>
  <b-row>
    <b-col lg="4">
      <b-card header="タグ" no-body>
        <b-form-checkbox-group
          v-if="tags && tags.length > 0"
          v-model="selectedTags"
        >
          <b-list-group flush>
              <b-list-group-item
                v-for="tag in tags"
                :key="tag.label"
                class="d-flex justify-content-between"
              >
                <b-form-checkbox :value="tag.id">{{ tag.label }}</b-form-checkbox>
                <b-link href="#">削除</b-link>
              </b-list-group-item>
          </b-list-group>
        </b-form-checkbox-group>
        <b-card-body v-if="tags && tags.length === 0">
          <p class="mb-0">タグはありません</p>
        </b-card-body>
      </b-card>
    </b-col>
    <b-col lg="8">
      <b-alert show variant="info">
        <span v-if="selectedTags && selectedTags.length > 0">
          タグ絞り込み: {{ selectedTagLabels }}
        </span>
        <span v-else>タグを選択してください</span>
      </b-alert>
      <b-row v-if="selectedTags && selectedTags.length > 0 && products && products.length > 0">
        <b-col v-for="product in products" :key="product.id" lg="6">
          <ProductSummary v-bind="product" />
        </b-col>
      </b-row>
      <p v-if="selectedTags && selectedTags.length > 0 && products && products.length === 0">
        表示できる製品はありません
      </p>
    </b-col>
  </b-row>
</template>

<script>
import ProductSummary from '../components/ProductSummary.vue'
import { OK } from '../util'

export default {
  components: {
    ProductSummary,
  },
  props: {
    selected: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      tags: null,
      selectedTags: null,
      products: null,
    }
  },
  methods: {
    async fetchTags() {
      const response = await axios.get('/api/tags')

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        return false
      }

      this.tags = response.data.data
    },
    async fetchProducts() {
      const response = await axios.get('/api/products', {
        params: { tag: this.selectedTags },
      })

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        return false
      }

      this.products = response.data.data
    },
  },
  computed: {
    selectedTagLabels() {
      if (!this.tags) {
        return ''
      }

      return this.tags.reduce((prev, tag) => {
        if (this.selectedTags.includes(tag.id)) {
          if (prev) {
            prev += `, ${tag.label}`
          } else {
            prev += tag.label
          }
        }
        return prev
      }, '')
    },
  },
  async mounted() {
    await this.fetchTags()

    const tagIds = this.tags.map(tag => tag.id)
    this.selectedTags = this.selected.filter(id => tagIds.includes(id))
  },
  watch: {
    async selectedTags(value) {
      this.$router.replace({ query: { selected: value } })

      if (!value || value.length === 0) {
        this.products = null
      } else {
        await this.fetchProducts()
      }
    },
  },
}
</script>
