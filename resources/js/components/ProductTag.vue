<template>
  <b-badge
    variant="light"
    class="font-weight-normal"
    :to="link"
    @click="filter"
  >
    {{ label }}
  </b-badge>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  computed: {
    link() {
      let query = { ...this.$route.query, tags: [this.id]}
      delete query.page
      return { path: '/', query }
    },
  },
  methods: {
    async filter() {
      this.$store.dispatch('product/filter/setTags', [this.id])
      this.$store.commit('product/setIsLoading', true)
      await this.$store.dispatch('product/fetchProducts')
      this.$store.commit('product/setIsLoading', false)
    },
  },
}
</script>
