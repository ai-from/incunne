<template>
  <button
    @mouseover="opacity = .4"
    @mouseleave="opacity = .3"
    @mousedown="opacity = .2"
    @mouseup="opacity = .3"
    @click="$emit('btnClick')"
    :class="{disabled: isDisabled}"
    :style="{
      border: isDisabled ? `1px solid rgba(0,0,0, .1)` : `1px solid rgba(${theme}, ${opacity})`,
      background: isDisabled ? `rgba(0,0,0, .3)` : `rgba(${theme}, ${opacity})`
    }"
  >
    {{ title }}
  </button>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data: () => ({
    opacity: .3
  }),
  props: {
    title: {
      type: String,
      require: true
    },
    isDisabled: {
      type: Boolean
    }
  },
  computed: {
    ...mapState('common', {
      theme: state => state.theme
    })
  }
}
</script>

<style lang="sass" scoped>
button
  border: none
  cursor: pointer
  padding: 10px 20px
  font-size: 1rem
  color: rgba($grey, .7)
  &.disabled
    cursor: default
</style>
