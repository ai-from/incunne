<template>
  <header class="header indent"
          :class="{active: mobileMenu}"
  >

    <div class="header__links">
      <router-link
        class="header__link"
        v-for="(item, index) in links"
        :key="index"
        :to="item.to"
        exact
        :style="{color: item.active ? `rgb(${theme})`: ''}"
        @click.native="checkNavLinks(false, index)"
      >
        {{ item.title[lang] }}
      </router-link>
    </div>

    <div
      class="header__menu"
      :class="{active: mobileMenu}"
      @click="menuClick">
      <div :style="{background: `rgb(${theme})`}" class="line"></div>
      <div :style="{background: `rgb(${theme})`}" class="line"></div>
      <div :style="{background: `rgb(${theme})`}" class="line"></div>
    </div>

    <div class="mobile-menu">
      <transition name="mobileMenu">
        <div
          class="header__menu-list indent"
          v-if="mobileMenu"
        >
          <div class="header__menu-items">
            <router-link
              class="header__menu-item"
              v-for="(item, index) in links"
              :key="index"
              :to="item.to"
              exact
              :style="{
                 color: item.active ? `rgb(${theme})`: '',
                 borderBottom: item.active ? `1px solid rgba(${theme}, .5)`: '1px solid transparent',
                 background: item.active ? `rgba(${theme}, .07)` : ''
               }"
              @click.native="checkNavLinks(true, index)"
            >
              {{ item.title[lang] }}
            </router-link>
          </div>
        </div>
      </transition>
    </div>

    <div class="header__right">
      <div class="header__email">
        info<span :style="{color: `rgba(${theme}, .7)`}">@</span>incunne.ru
      </div>
      <div class="header__colors">
        <div class="header__color"
             v-for="(item, index) in colors"
             :key="index"
             :style="{
          background: item.active? `rgba(${item.val}, .7)` : 'transparent',
          outline: `1px solid rgba(${item.val}, .7)`
        }"
             @click="setTheme(index)"
        ></div>
      </div>
      <div class="header__settings">
        <span
          class="header__language"
          @click="changeLanguage"
          :style="{color: `rgb(${theme})`}"
        >
          {{ lang.toUpperCase() }}
        </span>
        <SVGIcon
            width="auto"
            height="16"
            class="header__info"
            iconName="info2"
            :color="isTooltip === 'on' ? `rgba(${theme}, .7)` : 'rgba(219,219,219, .5)'"
            @click="changeTooltipStatus"
          />
      </div>
    </div>

  </header>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  name: 'Header',
  data() {
    return {
      links: [
        {title: {ru: 'Музыка', en: 'Music'}, to: '/', active: false},
        {title: {ru: 'Текст', en: 'Text'}, to: '/text', active: false},
        {title: {ru: 'Фото', en: 'Photo'}, to: '/photo', active: false},
        {title: {ru: 'Видео', en: 'Video'}, to: '/video', active: false},
        {title: {ru: 'Обратная связь', en: 'Feedback'}, to: '/feedback', active: false},
        {title: {ru: 'Обо мне', en: 'About'}, to: '/about', active: false}
      ],
      colors: [
        {val: '187,18,18', active: true},
        {val: '219,190,0', active: false},
        {val: '0,172,0', active: false},
        {val: '0,128,128', active: false},
        {val: '136,53,133', active: false},
        {val: '181,87,29', active: false}
      ],
      mobileMenu: false
    }
  },
  computed: {
    ...mapState('common', {
      theme: state => state.theme,
      lang: state => state.lang,
      isTooltip: state => state.isTooltip
    })
  },
  methods: {
    ...mapMutations('common', [
      'SET_THEME',
      'SET_LANG',
      'SET_TOOLTIP'
    ]),
    checkNavLinks(isMobile, index) {
      let link = document.querySelector('.router-link-exact-active') || false
      if(link) {
        if(index >= 0) {
          this.links.forEach(item => item.active = false)
          this.links[index].active = true
        } else {
          this.links.forEach(item => item.to === this.$route.path ? item.active = true : item.active = false)
        }
      }
      if(isMobile) this.menuClick()
    },
    menuClick() {
      this.mobileMenu = !this.mobileMenu
      this.$emit('mobileClick')
    },
    setTheme(i) {
      let color = this.colors[i].val
      this.SET_THEME(color)
      localStorage.setItem('color', this.theme)
      this.colors.forEach(item => item.active = false)
      this.colors[i].active = true
      this.$root.$emit('setTheme')
    },
    changeLanguage() {
      this.lang === 'en' ? this.SET_LANG('ru') : this.SET_LANG('en');
      localStorage.setItem('lang', this.lang)
    },
    changeTooltipStatus() {
      const newTooltipStatus = this.isTooltip === 'on' ? 'off' : 'on';
      this.SET_TOOLTIP(newTooltipStatus)
      localStorage.setItem('isTooltip', newTooltipStatus)
    }
  },
  mounted() {
    if(localStorage.getItem('color')) {
      let color = localStorage.getItem('color')
      this.SET_THEME(color)
      this.colors.forEach(item => item.active = false)
      this.colors.forEach(item => item.val === color ? item.active = true : false)
    } else {
      localStorage.setItem('color', this.theme)
    }

    if(localStorage.getItem('lang')) {
      let lang = localStorage.getItem('lang')
      this.SET_LANG(lang)
    } else {
      localStorage.setItem('lang', this.lang)
    }

    if(localStorage.getItem('isTooltip')) {
      let isTooltip = localStorage.getItem('isTooltip')
      this.SET_TOOLTIP(isTooltip)
    } else {
      localStorage.setItem('isTooltip', this.isTooltip)
    }

    this.checkNavLinks()

    this.$root.$on('toHome', () => {
      this.links.forEach(item => item.active = false)
      this.links[0].active = true
    })

    this.$root.$on('closeMobileMenu', () => {
      if(this.mobileMenu) this.checkNavLinks(true)
    })
  },
  watch: {
    $route(oldVal, newVal) {
      this.checkNavLinks();
    }
  }
}
</script>

<style lang="sass" scoped>
.header
  display: grid
  grid-template-columns: 1fr min-content
  height: 100px
  align-content: center
  position: relative
  margin: 0 0 10px
  transition: all linear $time
  &.active
    background: rgba($black, .7)
  &__menu
    display: none
    width: 26px
    grid-template-rows: repeat(3, min-content)
    grid-row-gap: 6px
    align-content: center
    align-self: center
    height: min-content
    cursor: pointer
    position: relative
    .line
      height: 2px
      transform: rotate(0)
      transition: all linear $time
    &.active
      .line
        transform: rotate(-45deg)
    &-list
      position: absolute
      top: 100px
      left: 0
      width: 100%
      min-height: calc(100vh - 100px)
      padding-top: 80px
      background: rgba($black, .7)
      padding-bottom: 50px
      .logo
        margin: 10px auto 30px
    &-items
      display: grid
      grid-template-rows: auto
      grid-row-gap: 10px
    &-item
      padding: 10px 0
      text-align: center
      background: rgba($white, .05)
      &:hover
        background: rgba($white, .04)
  &__links
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(0, min-content))
    grid-column-gap: 40px
    align-items: center
  &__link
    white-space: nowrap
  &__right
    display: grid
    grid-row-gap: 10px
    align-items: center
  &__email
    display: grid
    justify-content: right
    grid-template-columns: repeat(3, min-content)
  &__colors
    display: grid
    grid-template-columns: repeat(6, min-content)
    grid-column-gap: 10px
    justify-content: right
  &__color
    width: 10px
    height: 10px
    cursor: pointer
  &__settings
    display: grid
    grid-template-columns: repeat(2, min-content)
    align-items: center
    grid-gap: 5px
    justify-items: end
    justify-content: end
    font-size: 15px
    cursor: pointer
  &__info

  .mobileMenu-enter, .mobileMenu-leave-to
    opacity: 0
  .mobileMenu-enter-active, .mobileMenu-leave-active
    transition: all linear $time
  .mobileMenu-enter-to, .mobileMenu-leave
    opacity: 1

@media screen and (min-width: 901px)
  .header
    &.active
      background: transparent !important
    .mobile-menu
      display: none

@media screen and (max-width: 900px)
  .header
    .header__links
      display: none
    .header__menu
      display: grid
      grid-column: 2/3
      grid-row: 1/2
    .header__right
      grid-column: 1/2
      grid-row: 1/2
      .header__email
        justify-content: left
      .header__colors
        justify-content: left
      .header__settings
        justify-content: left
        display: grid
      .header__language
        grid-column: 2/3
        grid-row: 1/2
      .header__info
        grid-column: 1/2
        grid-row: 1/2
</style>