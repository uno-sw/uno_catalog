<template>
  <div v-if="product">
    <b-card>
      <b-row no-gutters>
        <b-col lg="6">
          <b-card-title>{{ product.name }}</b-card-title>
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
          <dl
            v-if="product.links && product.links.length > 0 || product.note"
            class="mt-3 mb-0"
          >
            <dt v-if="product.links && product.links.length > 0">リンク</dt>
            <dd>
              <ul v-if="product.links && product.links.length > 0" class="mb-0 pl-4">
                <li v-for="link in product.links" :key="link.url">
                  <a :href="link.url">{{ link.title }}</a>
                </li>
              </ul>
            </dd>
            <dt v-if="product.note">メモ</dt>
            <dd>
              <pre
                v-if="product.note"
                class="mb-0"
                :class="$style.note"
              >{{ product.note }}</pre>
            </dd>
          </dl>
        </b-col>
        <b-col lg="6">
          <b-img
            v-if="product.image_url"
            class="mt-3"
            :src="product.image_url"
            :alt="`${product.name}の画像`"
            rounded
            fluid
          />
        </b-col>
      </b-row>
      <b-button :to="`/products/${id}/edit`" class="mt-4">
        編集
      </b-button>
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
