<template>
  <b-form-select
    class="mb-3"
    :options="sortOptions"
    :value="sort"
    @change="onChange"
  />
</template>

<script>
export default {
  data() {
    return {
      sortOptions: [
        { value: { sort: 'created_at', order: 'desc' }, text: '作成日が新しい順' },
        { value: { sort: 'created_at', order: 'asc' }, text: '作成日が古い順' },
        { value: { sort: 'updated_at', order: 'desc' }, text: '更新日が新しい順' },
        { value: { sort: 'updated_at', order: 'asc' }, text: '更新日が古い順' },
        { value: { sort: 'price', order: 'asc' }, text: '価格が安い順' },
        { value: { sort: 'price', order: 'desc' }, text: '価格が高い順' },
        { value: { sort: 'name', order: 'asc' }, text: '製品名昇順' },
        { value: { sort: 'name', order: 'desc' }, text: '製品名降順' },
      ],
    }
  },
  methods: {
    async onChange(value) {
      this.$router.replace(
        { query: { ...this.$route.query, ...value } }
      )
      this.$store.commit('product/sort/setSort', value.sort)
      this.$store.commit('product/sort/setOrder', value.order)
      this.$store.commit('product/setIsLoading', true)
      await this.$store.dispatch(
        'product/fetchProducts',
        this.$route.query.page,
      )
      this.$store.commit('product/setIsLoading', false)
    },
  },
  computed: {
    sort() {
      return {
        sort: this.$store.getters['product/sort/sort'],
        order: this.$store.getters['product/sort/order'],
      }
    },
  },
}
</script>
