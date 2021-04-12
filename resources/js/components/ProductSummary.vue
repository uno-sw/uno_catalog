<template>
  <b-card class="my-2" no-body>
    <b-card-img-lazy
      v-if="image_url"
      :src="image_url"
      :alt="`${name}の画像`"
      blank-color="#bbb"
      blank
      top
    />
    <b-card-body>
      <b-card-title title-tag="h5">{{ name }}</b-card-title>
      <b-card-sub-title v-if="price">
        ¥{{ price.toLocaleString() }}
      </b-card-sub-title>
      <b-card-sub-title v-else>価格情報なし</b-card-sub-title>
      <div v-if="tags && tags.length > 0" class="mt-2">
        <span v-for="tag in tags" :key="tag.label">
          <b-badge
            variant="light"
            class="font-weight-normal"
            :to="`/?tags=${tag.id}`"
          >
            {{ tag.label }}
          </b-badge>&nbsp;
        </span>
      </div>
      <div class="mt-3">
        <b-button :to="`/products/${id}/edit`" variant="primary">編集</b-button>
        <b-dropdown v-if="links && links.length > 0" text="リンク">
          <b-dropdown-item v-for="link in links" :key="link.title" :href="link.url">
            {{ link.title }}
          </b-dropdown-item>
        </b-dropdown>
        <b-dropdown v-if="note" text="メモ">
          <b-dropdown-text>
            <pre class="mb-0">{{ note }}</pre>
          </b-dropdown-text>
        </b-dropdown>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
    tags: {
      type: Array,
      required: false,
    },
    image_url: {
      type: String,
      required: false,
      default: '',
    },
    links: {
      type: Array,
      required: false,
      default: () => [],
    },
    note: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>
