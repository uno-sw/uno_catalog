<template>
  <div>
    <header>
      <Navbar />
    </header>
    <main class="py-4">
      <RouterView />
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  components: {
    Navbar,
  },
}
</script>
