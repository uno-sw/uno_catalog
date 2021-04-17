<template>
  <div>
    <h1 class="mb-4">製品一覧</h1>
    <TagList />
    <ProductSort />
    <ProductList />
    <ProductPagination />
  </div>
</template>

<script>
import ProductList from '../components/ProductList.vue'
import ProductPagination from '../components/ProductPagination.vue'
import ProductSort from '../components/ProductSort.vue'
import TagList from '../components/TagList.vue'

export default {
  components: {
    ProductList,
    ProductPagination,
    ProductSort,
    TagList,
  },
  computed: {
    tags() {
      return Array.isArray(this.$route.query.tags)
          ? this.$route.query.tags
          : [this.$route.query.tags]
    },
  },
  watch: {
    $route: {
      async handler(route) {
        await this.$store.dispatch('product/filter/setTags', [])

        this.$store.commit('product/sort/setSort', route.query.sort)
        this.$store.commit('product/sort/setOrder', route.query.order)

        await this.$store.dispatch('product/tag/fetchTags')

        await this.$store.dispatch('product/filter/setTags', this.tags)

        await this.$store.dispatch(
          'product/fetchProducts',
          this.$route.query.page,
        )
      },
      immediate: true,
    },
  },
}
</script>
