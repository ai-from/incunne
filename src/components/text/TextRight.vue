<template>
  <div class="texts__right"
       :style="{border: `1px solid rgba(${theme}, .3)`}"
  >
    <div
      class="song-name"
      :style="{color: `rgb(${theme})`}"
    >
      {{ songName }}
      <div class="player__control">
        <SVGIcon
          v-if="!isPlaying"
          class="song-play"
          iconName="playByText"
          :tooltipText="this.lang === 'en' ? 'Play' : 'Воспроизвести'"
          tooltipLocation="left"
          :color="`rgb(${theme})`"
          @click="playByText"
        />
        <SVGIcon
          v-else
          class="song-pause"
          iconName="pauseByText"
          :tooltipText="this.lang === 'en' ? 'Pause' : 'Пауза'"
          tooltipLocation="left"
          :color="`rgb(${theme})`"
          @click="pauseByText"
        />
      </div>
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
import {mapState} from 'vuex'
import axios from 'axios'

export default {
  data: () => ({
    songName: '',
    songContent: '',
    isPlaying: false,
    playingSong: ''
  }),
  computed: {
    ...mapState('common', {
      theme: state => state.theme,
      lang: state => state.lang,
      currentSong: state => state.currentSong,
    }),
    ...mapState('albums', {
      albums: state => state.albums
    })
  },
  methods: {
    async showCurrentText(albumIndex, songIndex, isScroll = true) {
      if(this.albums[albumIndex].songs.length) {
        this.songName = this.albums[albumIndex].songs[songIndex].title
        let album = this.albums[albumIndex].innerTitle
        if(album === 'playlist') album = this.albums[albumIndex].songs[songIndex].fromAlbum
        let song = this.albums[albumIndex].songs[songIndex].innerTitle
        let src = `./../../../texts/${album}/${song}.txt`
        axios
          .get(src, {responseType: 'text'})
          .then(res => this.songContent = res.data)
          .then(res => {
            if(isScroll) this.scrollText()
          })
          .catch(err => console.log(err))
      }
    },
    up() {
      document.querySelector('.scroll-up').scrollTo({top: 0, left: 0, behavior: 'smooth'});
    },
    scrollText() {
      document.querySelector('.texts__right').scrollIntoView({behavior: 'smooth', block: 'start'});
    },
    checkTextStatus() {
      if(this.currentSong.songTitle === this.songName) {
        if(this.currentSong.isPlaying) this.isPlaying = true;
        else this.isPlaying = false;
      } else this.isPlaying = false;
    },
    playByText() {
      this.$root.$emit('playByText', this.songName);
      this.checkTextStatus();
    },
    pauseByText() {
      this.$root.$emit('pauseByText', this.songName);
      this.checkTextStatus();
    }
  },
  created() {
    let count = 0
    this.albums.forEach((album, index) => {
      if(album.songs.length) {
        album.songs.forEach((song, index2) => {
          if(song.textActive) {
            this.showCurrentText(index, index2, false)
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
    this.checkTextStatus();

    this.$root.$on('chooseText', obj => {
      this.showCurrentText(obj.albumIndex, obj.songIndex)
    })

    if(this.$route.params.chooseText) {
      let obj = this.$route.params.chooseText;
      this.showCurrentText(obj.albumIndex, obj.songIndex)
    }

    this.$root.$on('updateSong', () => {
      this.checkTextStatus();
    })

  },
  watch: {
    songName(oldVal, newVal) {
      this.checkTextStatus();
    }
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
      display: grid
      grid-template-columns: repeat(2, min-content)
      align-items: center
      justify-content: space-between
      white-space: nowrap
    .player__control
      width: 14px
      display: grid
      justify-content: center
      .svg-icon
        cursor: pointer
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
      .song-up-btn
        cursor: pointer

@media screen and (max-width: 400px)
  .texts
    &__right
      padding: 20px 10px
</style>
