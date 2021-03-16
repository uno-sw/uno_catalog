<template>
  <div>
    <h1 class="mb-4">製品一覧</h1>
    <b-row v-if="products && products.length > 0">
      <b-col
        lg="4"
        md="6"
        v-for="product in products" :key="product.id">
        <b-card
          :title="product.name"
          :img-src="product.image_url"
          :img-alt="`${product.name}の画像`"
          img-top
          title-tag="h5"
          class="my-2"
        >
          <b-card-sub-title v-if="product.price">
            ¥{{ product.price.toLocaleString() }}
          </b-card-sub-title>
          <b-card-sub-title v-else>価格情報なし</b-card-sub-title>
          <div v-if="product.tags && product.tags.length > 0" class="mt-2">
            <span v-for="tag in product.tags" :key="tag.label">
              <b-badge variant="light" class="font-weight-normal" href="#">
                {{ tag.label }}
              </b-badge>&nbsp;
            </span>
          </div>
          <b-button
            :to="`/products/${product.id}`"
            variant="primary"
            class="mt-3"
          >詳細</b-button>
        </b-card>
      </b-col>
    </b-row>
    <b-alert v-if="products && products.length === 0" show variant="info">
      表示できる製品はありません。
    </b-alert>
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
</template>

<script>
import { OK } from '../util'

export default {
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
      const response = await axios.get(`api/products/?page=${this.page}`)

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
    }
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
