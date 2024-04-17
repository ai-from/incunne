<template>
  <div class="texts__left"
       :style="{border: `1px solid rgba(${theme}, .3)`}"
  >
    <div class="texts__album"
         v-for="(album, index) in albums"
         :key="index"
    >
      <div class="texts__album-title"
           :style="{color: `rgb(${theme})`}"
           v-if="album.songs.length"
      >{{ album.title }}</div>
      <div class="texts__songs">
        <div class="texts__song-title"
             v-for="(song, index2) in album.songs"
             :key="index2"
             @click="textClick(index, index2)"
             @mouseover="TEXT_OVER([index, index2])"
             @mouseleave="TEXT_LEAVE([index, index2])"
             :style="{
                    color: song.textActive ? `rgb(${theme})` : song.textHover ? `rgb(${theme})` : '',
                    background: song.textActive ? `rgba(0, 0, 0, .5)` : ''
                 }"
        >
          {{ song.title }}
        </div>
      </div>
    </div>
    <div class="song-footer">
      <div class="song-author"
           :style="{color: `rgb(${theme})`}"
      >
        Incunne
      </div>
      <div class="song-up">
        <SVGIcon
          class="song-up-btn"
          iconName="up"
          :tooltipText="this.lang === 'en' ? 'Up' : 'Вверх'"
          tooltipLocation="top"
          :color="`rgb(${theme})`"
          @click="up"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  data: () => ({

  }),
  computed: {
    ...mapState('common', {
      theme: state => state.theme,
      lang: state => state.lang
    }),
    ...mapState('albums', {
      albums: state => state.albums
    })
  },
  methods: {
    ...mapMutations('albums', [
      'TEXT_OVER',
      'TEXT_LEAVE',
      'TEXT_ACTIVE'
    ]),
    textClick(albumIndex, songIndex) {
      this.albums.forEach((album, index) => {
        album.songs.forEach((song, index2) => this.TEXT_ACTIVE([index, index2, false]))
      })
      this.TEXT_ACTIVE([albumIndex, songIndex, true])
      this.$root.$emit('chooseText', {albumIndex, songIndex})
    },
    up() {
      document.querySelector('.scroll-up').scrollTo({top: 0, left: 0, behavior: 'smooth'})
    }
  },
  created() {
    let count = 0
    this.albums.forEach(album => {
      if(album.songs.length) {
        album.songs.forEach(song => {
          if(song.textActive === true) count++
        })
      }
    })
    if(!count) {
      if(this.albums[0].songs.length) this.TEXT_ACTIVE([0, 0, true])
      else this.TEXT_ACTIVE([1, 0, true])
    }
  }
}
</script>

<style lang="sass" scoped>
.texts
  &__left
    padding: 20px
    background: rgba($black, .5)
  &__album
    margin-bottom: 30px
    &:last-child
      margin-bottom: 0
  &__album-title
    margin-bottom: 10px
    padding: 8px
    background: rgba($black, .5)
  &__songs
    padding: 0 0 0 20px
  &__song-title
    padding: 4px 8px
    &:hover
      background: rgba($black, .5)
      cursor: pointer
.song-footer
  display: grid
  align-items: center
  grid-template-columns: 1fr 1fr
  grid-gap: 20px
  background: rgba($black, .5)
  padding: 8px
  .song-author
  .song-up
    display: grid
    justify-content: right
    .song-up-btn
      cursor: pointer

@media screen and (max-width: 400px)
  .texts
    &__left
      padding: 20px 10px
    &__songs
      padding: 0 0 0 10px
</style>
