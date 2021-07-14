<template>
  <footer class="footer indent">

    <div class="footer__left">
      <Logo :mini="true" />
      <div
        class="footer__phrase"
        :style="{color: `rgb(${theme})`}"
      >
        <div>"Pride is the value of rotten people"</div>
        <div><span>| </span>Incunne</div>
      </div>
    </div>

    <div class="footer__email">
      info<span :style="{color: `rgba(${theme}, .7)`}">@</span>incunne.ru
    </div>

    <div class="footer__rights">
      All rights reserved
    </div>

  </footer>
</template>

<script>
import {mapState} from 'vuex'
import Logo from "./Logo"
export default {
  name: 'Footer',
  components: {
    Logo
  },
  computed: {
    ...mapState('common', {
      theme: state => state.theme
    })
  }
}
</script>

<style lang="sass" scoped>
.footer
  display: grid
  grid-template-columns: repeat(3, 1fr)
  height: 100px
  align-content: center
  margin: 30px 0 0
  &__left
    .logo
      margin: 0 0 10px
  &__phrase
    font-size: 1rem
    background: rgba(0, 0, 0, .5)
    width: max-content
    white-space: nowrap
    padding: 4px
    display: grid
    grid-template-columns: repeat(2, max-content)
    grid-column-gap: 4px
  &__email
    display: grid
    justify-content: center
    align-items: center
    grid-template-columns: repeat(3, min-content)
  &__rights
    display: grid
    justify-content: right
    align-items: center

@media screen and (max-width: 900px)
  .footer
    grid-template-columns: 1fr 1fr
    grid-template-rows: repeat(2, min-content)
    &__left
      grid-column: 1/2
      grid-row: 1/3
    &__email
      grid-column: 2/3
      grid-row: 1/2
      justify-content: right
    &__rights
      grid-column: 2/3
      grid-row: 2/3

@media screen and (max-width: 700px)
  .footer
    grid-template-columns: 1fr
    grid-template-rows: repeat(3, min-content)
    grid-row-gap: 10px
    height: auto
    padding-bottom: 20px
    &__left
      grid-column: 1/2
      grid-row: 3/4
    &__email
      grid-column: 1/2
      grid-row: 1/2
      justify-content: left
    &__rights
      grid-column: 1/2
      grid-row: 2/3
      justify-content: left

@media screen and (max-width: 400px)
  .footer
    &__phrase
      width: 100%
      grid-template-columns: 1fr
      grid-template-rows: repeat(2, min-content)
      div span
        display: none
</style>