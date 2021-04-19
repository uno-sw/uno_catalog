<template>
  <div v-if="!isProductLoading" class="overflow-auto">
    <b-pagination-nav
      v-if="hasAnyProduct"
      :value="currentPage"
      :link-gen="linkGen"
      :number-of-pages="lastPage"
      align="center"
      use-router
      class="mt-4"
      @change="onChangePage"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  methods: {
    linkGen(pageNum) {
      const query = { page: pageNum }
      if (this.$route.query.tags) {
        query['tags'] = this.$route.query.tags
      }
      if (this.$route.query.sort) {
        query['sort'] = this.$route.query.sort
      }
      if (this.$route.query.order) {
        query['order'] = this.$route.query.order
      }
      return { query }
    },
    async onChangePage(page) {
      this.$store.commit('product/setIsLoading', true)
      await this.$store.dispatch('product/fetchProducts', page)
      this.$store.commit('product/setIsLoading', false)
    },
  },
  computed: {
    hasAnyProduct() {
      const products = this.$store.getters['product/products']
      return products && products.length > 0
    },
    ...mapGetters({
      isProductLoading: 'product/isLoading',
      currentPage: 'product/pagination/currentPage',
      lastPage: 'product/pagination/lastPage',
    }),
  },
}
</script>
