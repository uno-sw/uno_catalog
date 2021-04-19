<template>
  <div>
    <b-button v-b-toggle.filter class="mb-3">絞り込み</b-button>
    <b-sidebar id="filter" title="絞り込み" shadow>
      <div class="px-3 py-2">
        <b-form
          v-if="hasAnyTag"
          @submit.prevent="applyFilter"
          @reset="resetFilter"
        >
          <b-form-group label="タグ" v-slot="{ ariaDescribedBy }">
            <b-form-checkbox-group
              v-model="selectedTags"
              :aria-describedby="ariaDescribedBy"
              stacked
            >
              <div
                v-for="tag in tags"
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
            <b-button
              type="submit"
              variant="primary"
              :disabled="!canApplyFilter"
            >
              適用
            </b-button>
          </div>
        </b-form>
        <p v-else>タグはありません</p>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTags: [],
    }
  },
  methods: {
    async applyFilter() {
      if (this.canApplyFilter) {
        const query = {...this.$route.query, tags: this.selectedTags}
        delete query.page
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

      if (!result) {
        return
      }

      await this.$store.dispatch('product/tag/deleteTag', id)

      if (this.apiStatus) {
        this.$root.$bvToast.toast(`タグ「${label}」を削除しました`, {
          variant: 'success',
          solid: true,
        })

        if (this.filterTags.some(tag => tag == id)) {
          const tags = this.filterTags.filter(tag => tag != id)
          let query = { ...this.$route.query, tags }
          delete query.page
          this.$router.replace({ query })
        } else {
          await this.$store.dispatch(
            'product/fetchProducts',
            this.$route.query.page,
          )
        }
      }
    },
  },
  computed: {
    tags() {
      return this.$store.getters['product/tag/tags']
    },
    hasAnyTag() {
      return this.tags && this.tags.length > 0
    },
    filterTags() {
      return this.$store.getters['product/filter/tags']
    },
    canApplyFilter() {
      return this.filterTags.length !== this.selectedTags.length
          || this.filterTags.some(tag => !this.selectedTags.includes(tag))
    },
    apiStatus() {
      return this.$store.getters['product/tag/apiStatus']
    },
  },
  watch: {
    filterTags: {
      handler(value) {
        this.selectedTags = value
      },
      immediate: true,
    },
  },
}
</script>
