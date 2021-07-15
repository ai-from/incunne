<template>
  <div class="error-layout" v-bar>
    <div class="scroll scroll-up">
      <div class="error-layout__wrapper common-layout-class">
        <Header />
        <Logo />
        <router-view />
        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import setBg from "../mixins/setBg"
import colorScrollbar from "../mixins/colorScrollbar"
import Header from "../components/common/Header"
import Logo from "../components/common/Logo"
import Footer from "../components/common/Footer"
export default {
  name: 'Error',
  components: {
    Header,
    Logo,
    Footer
  },
  computed: {
    ...mapState('common', {
      isBg: state => state.isBg
    })
  },
  mixins: [
    setBg,
    colorScrollbar
  ],
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