<template>
  <div class="inner-layout">
    <div class="scroll scroll-up">
      <div class="inner-layout__wrapper common-layout-class">
        Inner layout
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Inner'
}
</script>

<style lang="sass" scoped>
.inner-layout
  position: relative
  height: 100vh
  .hidden
    display: none
    transition: all linear $time
  > .scroll
    min-height: 100vh
  &__wrapper
    display: grid !important
    grid-template-rows: repeat(3, min-content) 1fr min-content
    min-height: inherit
    margin: 0 auto
    .logo
      margin: 0 auto 50px
      position: relative
      z-index: 2
</style>