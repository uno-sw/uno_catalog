<template>
  <b-badge variant="light" class="font-weight-normal" :to="link">
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
}
</script>
