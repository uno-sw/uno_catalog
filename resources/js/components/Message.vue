<template>
  <b-alert :variant="variant" :show="!!message" :dismissible="dismissible">
    {{ message }}
  </b-alert>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    message: state => state.message.content,
    variant: state => state.message.variant,
    dismissible: state => state.message.dismissible,
  }),
}
</script>
