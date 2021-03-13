<template>
  <b-card class="mb-4">
    <b-row>
      <b-col lg="6">
        <h1 class="h5 font-weight-bold mb-4">{{ title }}</h1>
      </b-col>
      <b-col lg="6">
        <slot />
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
