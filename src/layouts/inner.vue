<template>
  <div class="inner-layout" v-bar>
    <div class="scroll scroll-up">
      <div class="inner-layout__wrapper common-layout-class">
        Inner layout <br>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import setBg from "../mixins/setBg"
import colorScrollbar from "../mixins/colorScrollbar"
export default {
  name: 'Inner',
  mixins: [
    setBg,
    colorScrollbar
  ],
  computed: {
    ...mapState('common', {
      isBg: state => state.isBg,
      theme: state => state.theme
    })
  },
  methods: {
    ...mapMutations('common', [
      'SET_BG'
    ])
  },
  mounted() {
    if(!this.isBg) {
      this.setBg()
      this.SET_BG(true)
    }

    this.colorScrollbar()
    this.$root.$on('setTheme', () => this.colorScrollbar())
  }
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