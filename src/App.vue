<template>
  <div id="app">
    <component :is="layout" />
  </div>
</template>

<script>
import inner from './layouts/inner'
import error from "./layouts/error"
import {mapState} from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      albumIndex: null,
      songIndex: null
    }
  },
  components: {
    inner,
    error
  },
  computed: {
    ...mapState('albums', {
      albums: state => state.albums
    }),
    layout() {
      return this.$route && this.$route.meta && this.$route.meta.layout ?
        this.$route.meta.layout : ''
    }
  },
  mounted() {
    const search = document.location.search;
    if(search) {
      const regExp = /^\?song\=[a-z\d-]{1,100}$/g;
      const isSearching = regExp.test(search)
      if(isSearching) {
        const searchingSong = search.slice(6)
        let isFound = false
        this.albums.forEach((album, albumIndex) => {
          album.songs.forEach((song, songIndex) => {
            if(song.innerTitle.toLowerCase() === searchingSong) {
              isFound = true
              this.albumIndex = albumIndex
              this.songIndex = songIndex
            }
          })
        })
        if(isFound) {
          this.$router.push({name: 'Home'})
          this.$root.$emit('chooseSong', {
            url: true,
            albumIndex: this.albumIndex,
            songIndex: this.songIndex
          })
          this.$root.$emit('checkActiveSongs', this.albumIndex, this.songIndex)
        } else {
          this.$router.push({name: 'Error'})
        }
      } else {
        this.$router.push({name: 'Error'})
      }
    }
  }
}
</script>

<style lang="sass">
@font-face
  font-family: PTSans
  src: url("./assets/fonts/ptsans.ttf")
@font-face
  font-family: Calibri
  src: url("./assets/fonts/calibri.ttf")

html, body
  font-family: PTSans, Arial, sans-serif
  font-size: 16px
  color: $grey
  background: $black
  position: relative
  z-index: -2

#bg
  position: fixed
  top: 0
  right: 0
  bottom: 0
  left: 0
  z-index: -1
  background: url("./assets/img/bg.jpg") no-repeat center top
  background-size: cover

a
  text-decoration: none
  color: $grey

.indent
  padding-left: 50px
  padding-right: 50px

.common-layout-class
  max-width: $maxWidth
  min-width: $minWidth

// scrollbar
@mixin vb-dragger
  z-index: 5
  width: 8px
  right: 0

@mixin vb-dragger-styler
  border-radius: 20px
  //margin: 10px 0 0 0
  margin: 0 auto 0
  //height: calc(100% - 20px)
  height: 100%
  display: block
  width: 4px
  cursor: pointer

::v-deep .vb > .vb-dragger
  @include vb-dragger

::v-deep .vb > .vb-dragger > .vb-dragger-styler
  @include vb-dragger-styler

.vb > .vb-dragger
  @include vb-dragger

.vb > .vb-dragger > .vb-dragger-styler
  @include vb-dragger-styler

.scroll-up
  overflow: auto scroll !important

@media screen and (max-width: 700px)
  .indent
    padding-left: 15px
    padding-right: 15px
</style>
