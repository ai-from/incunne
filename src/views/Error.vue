<template>
  <div class="error-page indent">
    <PageNotFound />
  </div>
</template>

<script>
import PageNotFound from "../components/error/PageNotFound"
export default {
  name: 'Error',
  components: {
    PageNotFound
  }
}
</script>

<style lang="sass" scoped>
.error-page
  .logo
    margin: 0 auto 80px
  #error-pic
    width: 70%
    height: auto
    max-height: 300px
    display: grid
    margin: 50px auto
</style>