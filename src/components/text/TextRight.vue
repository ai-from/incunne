<template>
  <div class="texts__right"
       :style="{border: `1px solid rgba(${theme}, .3)`}"
  >
    <div class="song-name"
         :style="{color: `rgb(${theme})`}"
    >
      {{ songName }}
    </div>
    <div class="song-content" v-html="songContent"></div>
    <br>
    <div class="song-footer">
      <div class="song-author"
           :style="{color: `rgb(${theme})`}"
      >
        Incunne
      </div>
      <div class="song-up">
        <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg"
             @click="up"
        >
          <line y1="-1" x2="10.0419" y2="-1" transform="matrix(0.716995 -0.697078 0.528302 0.849057 2 9)" :stroke="`rgb(${theme})`" stroke-width="2"/>
          <line y1="-1" x2="10.0419" y2="-1" transform="matrix(-0.716995 -0.697078 -0.528302 0.849057 13 9)" :stroke="`rgb(${theme})`" stroke-width="2"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import axios from 'axios'

export default {
  data: () => ({
    songName: '',
    songContent: ''
  }),
  computed: {
    ...mapState('common', {
      theme: state => state.theme
    }),
    ...mapState('albums', {
      albums: state => state.albums
    })
  },
  methods: {
    showCurrentText(albumIndex, songIndex) {
      if(this.albums[albumIndex].songs.length) {
        this.songName = this.albums[albumIndex].songs[songIndex].title
        let album = this.albums[albumIndex].innerTitle
        if(album === 'playlist') album = this.albums[albumIndex].songs[songIndex].fromAlbum
        let song = this.albums[albumIndex].songs[songIndex].innerTitle
        let src = `./../../../texts/${album}/${song}.txt`
        axios
          .get(src, {responseType: 'text'})
          .then(res => this.songContent = res.data)
          .catch(err => console.log(err))
      }
    },
    up() {
      document.querySelector('.scroll-up').scrollTo({top: 0, left: 0, behavior: 'smooth'})
    }
  },
  created() {
    let count = 0
    this.albums.forEach((album, index) => {
      if(album.songs.length) {
        album.songs.forEach((song, index2) => {
          if(song.textActive) {
            this.showCurrentText(index, index2)
            count++
          }
        })
      }
    })
    if(!count) {
      if(this.albums[0].songs.length) this.showCurrentText(0, 0)
      else this.showCurrentText(1, 0)
    }
  },
  mounted() {
    this.$root.$on('chooseText', obj => {
      this.showCurrentText(obj.albumIndex, obj.songIndex)
    })
  }
}
</script>

<style lang="sass" scoped>
.texts
  &__right
    padding: 20px
    background: rgba($black, .5)
    .song-name
      padding: 8px
      margin-bottom: 10px
      background: rgba($black, .5)
    .song-content
      padding: 0 8px
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
      svg
        cursor: pointer

@media screen and (max-width: 400px)
  .texts
    &__right
      padding: 20px 10px
</style>
