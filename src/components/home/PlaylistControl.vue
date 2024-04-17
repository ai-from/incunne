<template>
  <div class="playlist-control">
    <div
      class="playlist-control__buttons"
      :class="{two: isShowSecondBtn}"
    >
      <Button
        class="playlist-control__create"
        :title="btnCreateTitle"
        @btnClick="playlistAction()"
      />
      <Button
        class="playlist-control__visible"
        :title="btnVisibleTitle"
        @btnClick="playlistVisible()"
        v-if="isShowSecondBtn"
      />
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import colorScrollbar from "../../mixins/colorScrollbar"
import Button from "../common/Button"
export default {
  name: 'PlaylistControl',
  components: {
    Button
  },
  computed: {
    ...mapState('albums', {
      albums: state => state.albums,
      isPlaylistShow: state => state.isPlaylistShow
    }),
    ...mapState('common', {
      lang: state => state.lang
    }),
    btnCreateTitle: {
      get() {
        if(this.lang === 'en') {
          return this.isCreatingPlaylist ? 'Delete playlist' : 'Create playlist'
        } else {
          return this.isCreatingPlaylist ? 'Удалить плейлист' : 'Создать плейлист'
        }
      }
    },
    btnVisibleTitle: {
      get() {
        if(this.lang === 'en') {
          return this.isPlaylistShow ? 'Hide playlist' : 'Show playlist'
        } else {
          return this.isPlaylistShow ? 'Скрыть плейлист' : 'Показать плейлист'
        }
        
      }
    },
    isCreatingPlaylist: {
      get() {
        return this.albums[0].innerTitle === 'playlist'
      }
    },
    isShowSecondBtn() {
      return this.albums[0].innerTitle === 'playlist' && this.albums[0].songs.length > 0
    }
  },
  mixins: [
    colorScrollbar
  ],
  methods: {
    ...mapMutations('albums', [
      'DELETE_PLAYLIST',
      'SET_PLAYLIST_SHOW'
    ]),
    ...mapActions('albums', [
      'CREATE_PLAYLIST'
    ]),
    playlistAction() {
      if(!this.isCreatingPlaylist) {
        this.CREATE_PLAYLIST()
        let playlist = {
          title: this.lang === 'en' ? 'Playlist' : 'Плейлист',
          innerTitle: 'playlist',
          year: new Date().getFullYear(),
          songs: []
        }
        localStorage.setItem('playlist', JSON.stringify(playlist))
        localStorage.setItem('playlistStatus', 'true')
      }
      else {
        this.DELETE_PLAYLIST()
        localStorage.removeItem('playlist')
      }
    },
    playlistVisible() {
      this.SET_PLAYLIST_SHOW(!this.isPlaylistShow)
      localStorage.setItem('playlistStatus', JSON.stringify(this.isPlaylistShow))
      this.colorScrollbar()
    }
  },
  mounted() {
    if(localStorage.getItem('playlistStatus')) {
      this.SET_PLAYLIST_SHOW(JSON.parse(localStorage.getItem('playlistStatus')))
    } else {
      localStorage.setItem('playlistStatus', JSON.stringify(this.isPlaylistShow))
    }
  }
}
</script>

<style lang="sass" scoped>
.playlist-control
  &__buttons
    display: grid
    grid-template-columns: repeat(2, min-content)
    grid-gap: 10px
    margin-bottom: 50px
  &__create
    white-space: nowrap
  &__visible
    white-space: nowrap

@media screen and (max-width: 400px)
  .playlist-control
    &__buttons
      grid-template-columns: minmax(min-content, 1fr)
      &.two
        grid-template-columns: 1fr
</style>