<template>
  <div>
    <b-alert v-if="hasAnyFilterTag" variant="info" show>
      タグ: {{ filterTagLabels }}
    </b-alert>
    <div v-if="isLoading" class="d-flex justify-content-center">
      <b-spinner class="m-5" label="読み込み中" />
    </div>
    <div v-else-if="hasAnyProduct">
      <b-row>
        <b-col
          lg="4"
          md="6"
          v-for="product in products" :key="product.id"
        >
          <ProductSummary v-bind="product" />
        </b-col>
      </b-row>
    </div>
    <p v-else-if="hasNoProduct">
      表示できる製品はありません。
    </p>
  </div>
</template>

<script>
import ProductSummary from './ProductSummary.vue'

export default {
  components: {
    ProductSummary,
  },
  computed: {
    products() {
      return this.$store.getters['product/products']
    },
    isLoading() {
      return this.$store.getters['product/isLoading']
    },
    tags() {
      return this.$store.getters['product/tag/tags']
    },
    filterTags() {
      return this.$store.getters['product/filter/tags']
    },
    filterTagLabels() {
      return this.filterTags.map(filterTag => {
        return this.tags.find(tag => filterTag == tag.id).label
      }).join(', ')
    },
    hasAnyProduct() {
      return this.products && this.products.length > 0
    },
    hasNoProduct() {
      return this.products && this.products.length === 0
    },
    hasAnyFilterTag() {
      return this.filterTags && this.filterTags.length > 0
    },
  },
}
</script>
