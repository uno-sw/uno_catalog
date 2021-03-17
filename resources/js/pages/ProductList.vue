<template>
  <div>
    <h1 class="mb-4">製品一覧</h1>
    <b-row v-if="products && products.length > 0">
      <b-col
        lg="4"
        md="6"
        v-for="product in products" :key="product.id"
      >
        <ProductSummary v-bind="product" />
      </b-col>
    </b-row>
    <b-alert v-if="products && products.length === 0" show variant="info">
      表示できる製品はありません。
    </b-alert>
    <div class="overflow-auto">
      <b-pagination-nav
        v-if="products && products.length > 0"
        :value="currentPage"
        :link-gen="linkGen"
        :number-of-pages="lastPage"
        align="center"
        use-router
        class="mt-4"
      />
    </div>
  </div>
</template>

<script>
import ProductSummary from '../components/ProductSummary.vue'
import { OK } from '../util'

export default {
  components: {
    ProductSummary,
  },
  props: {
    page: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  data() {
    return {
      products: null,
      currentPage: 0,
      lastPage: 0,
    }
  },
  methods: {
    async fetchProducts() {
      const response = await axios.get(`/api/products/?page=${this.page}`)

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        return false
      }

      this.products = response.data.data
      this.currentPage = response.data.meta.current_page
      this.lastPage = response.data.meta.last_page
    },
    linkGen(pageNum) {
      return `?page=${pageNum}`
    },
  },
  watch: {
    $route: {
      async handler() {
        await this.fetchProducts()
      },
      immediate: true,
    },
  },
}
</script>
