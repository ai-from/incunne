<template>
  <div class="inner-layout" v-bar>
    <div class="scroll scroll-up">
      <div class="inner-layout__wrapper common-layout-class">
        <Header @mobileClick="mobileClick" />
        <Logo :mini="isMiniLogo" />
        <BreadCrumbs />
        <Player :class="{hidden: !isVisibleBlock}" />
        <router-view :class="{hidden: !isVisibleBlock}" />
        <Footer :class="{hidden: !isVisibleBlock}" />
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
import BreadCrumbs from '../components/BreadCrumbs.vue'
import Player from "../components/home/Player"
import Footer from "../components/common/Footer"
export default {
  name: 'Inner',
  data() {
    return {
      isVisibleBlock: true,
      isMiniLogo: false
    }
  },
  components: {
    Header,
    Logo,
    BreadCrumbs,
    Player,
    Footer
  },
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
    ]),
    ...mapMutations('albums', [
      'SET_PLAYLIST'
    ]),
    mobileClick() {
      this.isVisibleBlock = !this.isVisibleBlock
    },
    setLogoSize() {
      let w = window.getComputedStyle(document.body).getPropertyValue('width')
      w = w.replace('px', '') * 1
      this.isMiniLogo = w <= 900
    }
  },
  mounted() {
    if(!this.isBg) {
      this.setBg()
      this.SET_BG(true)
    }

    if(localStorage.getItem('playlist')) {
      const playlist = JSON.parse(localStorage.getItem('playlist'))
      this.SET_PLAYLIST(playlist)
    }

    this.colorScrollbar()
    this.$root.$on('setTheme', () => this.colorScrollbar())

    this.setLogoSize()
    window.addEventListener('resize', () => this.setLogoSize())
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