<template>
  <div class="error-layout">
    <div class="scroll scroll-up">
      <div class="error-layout__wrapper common-layout-class">
        Error layout
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error'
}
</script>

<style lang="sass" scoped>
.error-layout
  position: relative
  height: 100vh
  > .scroll
    min-height: 100vh
  &__wrapper
    display: grid !important
    grid-template-rows: repeat(2, min-content) 1fr min-content
    min-height: inherit
    margin: 0 auto
    .logo
      margin: 0 auto
    .player
      margin: 50px 0
</style>