<template>
  <div id="app">
    <component :is="layout" />
  </div>
</template>

<script>
import inner from './layouts/inner'
import error from "./layouts/error";
export default {
  name: 'App',
  components: {
    inner,
    error
  },
  computed: {
    layout() {
      return this.$route && this.$route.meta && this.$route.meta.layout ?
        this.$route.meta.layout : ''
    }
  }
}
</script>

<style lang="sass">
// coding
</style>
