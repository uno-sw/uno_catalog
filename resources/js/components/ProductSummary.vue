<template>
  <b-card class="my-2" no-body>
    <b-card-img-lazy
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
          <b-badge variant="light" class="font-weight-normal" href="#">
            {{ tag.label }}
          </b-badge>&nbsp;
        </span>
      </div>
      <b-button
        :to="`/products/${id}`"
        variant="primary"
        class="mt-3"
      >詳細</b-button>
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
  },
}
</script>
