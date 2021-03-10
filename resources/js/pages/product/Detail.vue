<template>
  <div v-if="product">
    <b-card :title="product.name">
      <b-card-sub-title v-if="product.price">
        ¥{{ product.price.toLocaleString() }}
      </b-card-sub-title>
      <div v-if="product.tags && product.tags.length > 0" class="mt-2">
        <span v-for="tag in product.tags" :key="tag.label">
          <b-badge variant="light" class="font-weight-normal">
            {{ tag.label }}
          </b-badge>&nbsp;
        </span>
      </div>
      <ul v-if="product.links && product.links.length > 0" class="mt-3 pl-4">
        <li v-for="link in product.links" :key="link.url">
          <a :href="link.url">{{ link.title }}</a>
        </li>
      </ul>
      <pre v-if="product.note" :class="$style.note">{{ product.note }}</pre>
    </b-card>
  </div>
</template>

<script>
import { OK } from '../../util';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      product: null,
    }
  },
  methods: {
    async fetchProduct() {
      const response = await axios.get(`/api/products/${this.id}`)

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        return false
      }

      this.product = response.data.data
    },
  },
  watch: {
    $route: {
      async handler() {
        await this.fetchProduct()
      },
      immediate: true,
    },
  },
}
</script>

<style module>
  .note {
    white-space: pre-wrap;
  }
</style>
