<template>
  <div>
    <h1 class="mb-4">製品一覧</h1>
    <b-button v-b-toggle.filter class="mb-3">絞り込み</b-button>
    <b-form-select class="mb-3" :options="sortOptions" v-model="selectedSort" />
    <b-sidebar id="filter" title="絞り込み" shadow>
      <div class="px-3 py-2">
        <b-form @submit.prevent="applyFilter" @reset="resetFilter">
          <b-form-group label="タグ" v-slot="{ ariaDescribedBy }">
            <b-form-checkbox-group
              v-model="selectedTags"
              :aria-describedby="ariaDescribedBy"
              stacked
            >
              <div
                v-for="tag in allTags"
                :key="tag.id"
                class="d-flex justify-content-between">
                <b-form-checkbox :value="tag.id">
                  {{ tag.label }}
                </b-form-checkbox>
                <a href="#" @click.prevent="deleteTag(tag.id, tag.label)">
                  削除
                </a>
              </div>
            </b-form-checkbox-group>
          </b-form-group>
          <div class="text-right">
            <b-button type="reset">リセット</b-button>
            <b-button type="submit" variant="primary">適用</b-button>
          </div>
        </b-form>
      </div>
    </b-sidebar>
    <b-alert v-if="appliedTags && appliedTags.length > 0" variant="info" show>
      タグ: {{ appliedTagLabels }}
    </b-alert>
    <div v-if="products && products.length > 0">
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
    <b-alert v-if="products && products.length === 0" show variant="info">
      表示できる製品はありません。
    </b-alert>
    <div v-if="isLoading" class="d-flex justify-content-center">
      <b-spinner class="m-5" label="読み込み中" />
    </div>
    <div class="overflow-auto">
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
  </div>
</template>

<script>
import ProductSummary from '../components/ProductSummary.vue'
import { OK } from '../util'

export default {
  components: {
    ProductSummary,
  },
  props: {
    page: {
      type: Number,
      required: false,
    },
    tags: {
      type: Array,
      required: false,
      default: () => [],
    },
    sort: {
      type: String,
      required: false,
    },
    order: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      products: null,
      allTags: null,
      selectedTags: [],
      appliedTags: [],
      currentPage: 0,
      lastPage: 0,
      isLoading: true,
      selectedSort: { sort: 'created_at', order: 'desc' },
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
    async fetchProducts(page = 1) {
      const wait = new Promise(resolve => setTimeout(() => resolve(), 1000))
      const request = await axios.get('/api/products', {
        params: {
          tags: this.appliedTags,
          page: page,
          sort: this.selectedSort.sort,
          order: this.selectedSort.order,
        },
      })

      const [, response] = await Promise.all([wait, request])

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        this.$store.commit('error/setMessage', '製品の読み込みに失敗しました')
        return false
      }

      this.products = response.data.data
      this.currentPage = response.data.meta.current_page
      this.lastPage = response.data.meta.last_page
    },
    async fetchTags() {
      const response = await axios.get('/api/tags')

      if (response.status !== OK) {
        this.$store.commit('error/setCode', response.status)
        this.$store.commit('error/setMessage', 'タグの読み込みに失敗しました')
        return false
      }

      this.allTags = response.data.data
    },
    linkGen(pageNum) {
      const query = { page: pageNum }
      if (this.appliedTags.length > 0) {
        query['tags'] = this.appliedTags
      }
      if (this.sort) {
        query['sort'] = this.sort
      }
      if (this.order) {
        query['order'] = this.order
      }
      return { query }
    },
    applyFilter() {
      if (this.appliedTags.length !== this.selectedTags.length
          || this.appliedTags.some(tag => !this.selectedTags.includes(tag))) {
        this.appliedTags = this.selectedTags
        const query = { tags: this.appliedTags }
        if (this.sort) {
          query['sort'] = this.sort
        }
        if (this.order) {
          query['order'] = this.order
        }
        this.$router.replace({ query })
      }
    },
    resetFilter() {
      this.selectedTags = []
    },
    async deleteTag(id, label) {
      const result = await this.$bvModal.msgBoxConfirm(
        '全ての製品からこのタグが削除されます。',
        {
          title: `タグ「${label}」を削除してもよろしいですか？`,
          okVariant: 'danger',
          okTitle: '削除',
          cancelTitle: 'キャンセル',
        },
      )

      if (result) {
        const response = await axios.delete(`/api/tags/${id}`)

        if (response.status !== OK) {
          this.$store.commit('error/setCode', response.status)
          this.$store.commit('error/setMessage', `タグ「${label}」の削除に失敗しました`)
          return false
        }

        this.$root.$bvToast.toast(`タグ「${label}」を削除しました`, {
          variant: 'success',
          solid: true,
        })
        if (this.appliedTags.includes(id)) {
          this.appliedTags = this.appliedTags.filter(tag => tag !== id)
          const query = { tags: this.appliedTags }
          if (this.sort) {
            query['sort'] = this.sort
          }
          if (this.order) {
            query['order'] = this.order
          }
          this.$router.replace({ query })
        } else {
          await this.fetchTags()
          await this.fetchProducts()
        }
      }
    },
  },
  computed: {
    appliedTagLabels() {
      return this.appliedTags.map(appliedTag => {
        return this.allTags.find(tag => appliedTag === tag.id).label
      }).join(', ')
    },
  },
  watch: {
    $route: {
      async handler() {
        if (this.sortOptions.some(option => option.value.sort === this.sort)) {
          this.selectedSort.sort = this.sort
        }
        if (this.sortOptions.some(option => option.value.order === this.order)) {
          this.selectedSort.order = this.order
        }

        this.products = null
        this.currentPage = 0
        this.lastPage = 0
        this.isLoading = true

        await this.fetchTags()

        const allTagIds = this.allTags.map(tag => tag.id)
        const validTags = this.tags.filter(id => allTagIds.includes(id))
        if (this.tags.some(tag => !allTagIds.includes(tag))) {
          const query = { tags: validTags }
          if (this.page) {
            query['page'] = this.page
          }
          if (this.sort) {
            query['sort'] = this.sort
          }
          if (this.order) {
            query['order'] = this.order
          }
          this.$router.replace({ query })
        }
        console.log(this.tags)
        this.selectedTags = this.appliedTags = validTags

        await this.fetchProducts(this.page ?? 1)

        this.isLoading = false
      },
      immediate: true,
    },
    async selectedSort() {
      const query = { ...this.selectedSort }
      if (this.page) {
        query['page'] = this.page
      }
      if (this.tags && this.tags.length > 0) {
        query['tags'] = this.tags
      }
      this.$router.replace({ query })
    },
  },
}
</script>
