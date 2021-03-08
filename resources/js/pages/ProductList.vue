<template>
  <div>
    <h1>Product List</h1>
    <b-row>
      <b-col
        lg="4"
        md="6"
        v-for="product in products" :key="product.id">
        <b-card
          :title="product.name"
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
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { OK } from '../util'

export default {
  data() {
    return {
      products: [],
    }
  },
  methods: {
    async fetchProducts() {
      const response = await axios.get('api/products')

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        return false
      }

      this.products = response.data.data
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
