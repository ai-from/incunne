<template>
  <div class="inner-layout" v-bar>
    <div class="scroll scroll-up">
      <div class="inner-layout__wrapper common-layout-class">
        <Header @mobileClick="mobileClick" />
        <Logo :mini="isMiniLogo" />
        <BreadCrumbs :class="{hidden: !isVisibleBlock}" />
        <MenuIcons :class="{hidden: !isVisibleBlock}" />
        <div>
          <Player :class="{hidden: !isVisibleBlock || !isHomePage}" />
          <router-view :class="{hidden: !isVisibleBlock}" />
        </div>
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
import BreadCrumbs from '../components/common/BreadCrumbs.vue'
import MenuIcons from '../components/common/MenuIcons.vue'
import Player from "../components/home/Player"
import Footer from "../components/common/Footer"
export default {
  name: 'Inner',
  data() {
    return {
      isVisibleBlock: true,
      isMiniLogo: false,
      isHomePage: false,
    }
  },
  components: {
    Header,
    Logo,
    BreadCrumbs,
    MenuIcons,
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
    },
    isPlayerShow() {
      const homePage = document.querySelector('.home-page')
      this.isHomePage = !!homePage
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

    this.isPlayerShow()
  },
  updated() {
    this.$nextTick(() => {
      this.isPlayerShow()
    })
  },
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
    grid-template-rows: repeat(4, min-content) 1fr min-content
    min-height: inherit
    margin: 0 auto
    .logo
      margin: 0 auto 50px
      position: relative
      z-index: 2
</style>