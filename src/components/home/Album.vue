<template>
  <div
    v-show="!(album.innerTitle === 'playlist' && !this.isPlaylistShow)"
    class="album"
    :class="{ playlist: album.innerTitle === 'playlist' }"
    :style="{ border: `1px solid rgba(${theme}, .3)` }"
  >
    <div class="album__top" :style="{ borderBottom: `1px solid rgba(${theme}, .3)` }">
      <img
        class="album__cover"
        :src="require(`./../../assets/img/home/album_${album.innerTitle}.svg`)"
        alt=""
        title=""
      />
      <div class="album__top-right">
        <div class="album__title">{{ album.title }}</div>
        <div class="album__year">
          {{ lang === 'en' ? 'Release' : 'Дата выхода' }}: {{ album.innerTitle === "playlist" ? lang === 'en' ? 'No date' : 'Отсутствует' : album.date }}
        </div>
      </div>
    </div>
    <div class="album__songs-wrap">
      <div v-bar>
        <div class="album__songs">
          <div
            v-if="album.innerTitle === 'playlist' && album.songs.length === 0"
            class="playlist__tooltip"
          >
            <span>{{ lang === 'en' ? "Click the 'Edit' to select songs" : "Нажмите 'Изменить' для выбора песен" }}</span>
            <span>{{ lang === 'en' ? 'Max' : 'Максимум' }}: {{ playlistLimit }} {{ lang === 'en' ? 'items' : 'штук' }}</span>
          </div>
          <div
            class="album__song-wrapper"
            v-for="(song, index) in album.songs"
            :key="index"
            v-else
          >
            <div
              class="album__song"
              :class="{
                'playlist-changing': isPlaylistChanging,
                move: isPlaylistChanging && album.innerTitle === 'playlist',
              }"
              @mouseover="SONG_OVER([albumIndex, index])"
              @mouseleave="SONG_LEAVE([albumIndex, index])"
              :style="{
                color: getSongColor(song),
                background: getSongBackground(song),
              }"
              @click="songClick(index)"
              @mousedown="songMouseDown(index)"
              @mouseup="songMouseUp(index)"
              @mouseenter="songMouseEnter(index)"
            >
              <div class="album__song-title">
                <span>{{ index + 1 }}.</span>
                <span>{{ song.title }}</span>
              </div>
              <div class="album__song-duration">{{ song.duration }}</div>
            </div>
            <SVGIcon
              class="album__song-download"
              iconName="download"
              :tooltipText="lang === 'en' ? 'Download' : 'Скачать'"
              tooltipLocation="left"
              :classes="[isPlaylistChanging ? 'disabled' : '']"
              @click="songDownload(albumIndex, index)"
              :color="isPlaylistChanging ? `rgba(219,219,219, .5)` : `rgb(${theme})`"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="album.innerTitle === 'playlist'" class="playlist__buttons">
      <Button
        :title="playlistChangeTitle"
        class="playlist__button"
        @btnClick="playlistChange"
      />
      <Button
        :title="btnDownloadTitle[lang]"
        class="playlist__button"
        :isDisabled="isDisabled"
        @btnClick="playlistDownload"
      />
    </div>

    <Button
      :title="btnDownloadTitle[lang]"
      class="album__download"
      @btnClick="downloadAlbum"
      :isDisabled="this.isPlaylistChanging"
      v-else
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import setDownloadParams from "../../mixins/setDownloadParams";
import colorScrollbar from "../../mixins/colorScrollbar";
import Button from "../common/Button";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import JSZipUtils from "jszip-utils";
export default {
  name: "Album",
  props: {
    albumIndex: {
      type: Number,
      required: true,
    },
    album: {
      type: Object,
      required: true,
    },
    fromError: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    btnDownloadTitle: {ru: 'Скачать', en: 'Download'},
    songDrag: false,
    moveFromIndex: null,
    moveToIndex: null,
    moveObj: null,
    moveFlag: false,
    startMove: 0,
    endMove: 0,
  }),
  components: {
    Button,
  },
  computed: {
    ...mapState("common", {
      theme: state => state.theme,
      lang: state => state.lang
    }),
    ...mapState("albums", {
      albums: (state) => state.albums,
      isPlaylistChanging: (state) => state.isPlaylistChanging,
      isPlaylistShow: (state) => state.isPlaylistShow,
    }),
    isDisabled() {
      return this.album.songs.length === 0 || this.isPlaylistChanging;
    },
    playlistChangeTitle() {
      return this.isPlaylistChanging ? this.lang === 'en' ? 'Done' : 'Готово' : this.lang === 'en' ? 'Edit' : 'Изменить';
    },
    playlistLimit() {
      let count = 0;
      this.albums.forEach((album) => {
        if (album.innerTitle !== "playlist") {
          count += album.songs.length;
        }
      });
      return count;
    },
  },
  mixins: [setDownloadParams, colorScrollbar],
  methods: {
    ...mapMutations("albums", [
      "SONG_OVER",
      "SONG_LEAVE",
      "SET_PLAYLIST_CHANGING",
      "SONG_ACTIVE",
      "ADD_TO_PLAYLIST",
      "DELETE_FROM_PLAYLIST",
      "MOVE_SONG",
    ]),
    ...mapGetters("albums", ["GET_PLAYLIST"]),
    checkActiveSongs(albumIndex, songIndex, fromError = false) {
      this.albums.forEach((album, index) => {
        album.songs.forEach((song, index2) => this.SONG_ACTIVE([index, index2, false]));
      });
      !fromError ? this.SONG_ACTIVE([albumIndex, songIndex, true]) : false;
    },
    songClick(i) {
      if (!this.isPlaylistChanging) {
        this.$root.$emit("chooseSong", {
          albumIndex: this.albumIndex,
          songIndex: i,
        });
        this.checkActiveSongs(this.albumIndex, i);
      } else {
        if (this.album.innerTitle !== "playlist") {
          let playlist = this.GET_PLAYLIST();
          let currentItems = playlist.songs.length;
          if (currentItems < this.playlistLimit) {
            let newSong = {
              title: this.album.songs[i].title,
              innerTitle: this.album.songs[i].innerTitle,
              duration: this.album.songs[i].duration,
              songHover: false,
              songActive: false,
              textHover: false,
              textActive: false,
              fromAlbum: this.album.innerTitle,
            };
            this.ADD_TO_PLAYLIST(newSong);
            localStorage.setItem("playlist", JSON.stringify(playlist));
          } else {
            this.SET_PLAYLIST_CHANGING(false);
          }
        } else {
          this.DELETE_FROM_PLAYLIST(i);
          let playlist = this.GET_PLAYLIST();
          localStorage.setItem("playlist", JSON.stringify(playlist));
          if (this.album.songs.length === 0) this.SET_PLAYLIST_CHANGING(false);
        }
      }
    },
    songDownload(albumIndex, songIndex) {
      if (!this.isPlaylistChanging) {
        this.downloadSongSrc = this.setDownloadParams(
          this.albums,
          albumIndex,
          songIndex
        ).downloadSrc;
        this.downloadSongName = this.setDownloadParams(
          this.albums,
          albumIndex,
          songIndex
        ).downloadName;
        this.$emit("downloadSong", {
          src: this.downloadSongSrc,
          name: this.downloadSongName,
        });
      }
    },
    downloadAlbum() {
      if (!this.isPlaylistChanging) {
        this.btnDownloadTitle = {ru: 'Скачиваю...', en: 'Downloading...'};
        let innerAlbum = this.album.innerTitle;
        let album = this.album.title;
        let count = 0;
        let zip = new JSZip();

        this.album.songs.forEach((song) => {
          if (album === "Playlist" || album === "Плейлист") innerAlbum = song.fromAlbum;
          let innerSong = song.innerTitle;
          let src = require(`./../../../public/albums/${innerAlbum}/Incunne_${innerSong}.mp3`);
          JSZipUtils.getBinaryContent(src, (err, data) => {
            zip.file(`Incunne - ${innerSong}.mp3`, data, { binary: true });
            count++;
            if (count === this.album.songs.length) {
              zip.generateAsync({ type: "blob" }).then((cnt) => {
                this.btnDownloadTitle = {ru: 'Скачать', en: 'Download'};
                saveAs(cnt, `Incunne - ${album}.zip`);
              }).catch(err => alert(lang === 'en' ? 'Something went wrong' : 'Что-то пошло не так'))
            }
          });
        });
      }
    },
    playlistChange() {
      this.SET_PLAYLIST_CHANGING(!this.isPlaylistChanging);
    },
    playlistDownload() {
      if (!this.isDisabled) {
        this.downloadAlbum();
      }
    },
    getSongColor(song) {
      if (this.isPlaylistChanging && song.songHover) return `rgb(${this.theme})`;
      else if (this.isPlaylistChanging) return `rgba(219,219,219, .7)`;
      else if (song.songActive) return `rgb(${this.theme})`;
      else if (song.songHover) return `rgb(${this.theme})`;
    },
    getSongBackground(song) {
      if (this.isPlaylistChanging) return `rgba(0, 0, 0, .5)`;
      else if (song.songActive) return `rgba(0, 0, 0, .5)`;
    },
    songMouseDown(index) {
      if (this.album.innerTitle === "playlist" && this.isPlaylistChanging) {
        this.songDrag = true;
        this.moveFromIndex = index;
      }
    },
    songMouseUp() {
      if (this.album.innerTitle === "playlist" && this.isPlaylistChanging) {
        this.songDrag = false;
        this.SONG_LEAVE([this.albumIndex, this.moveToIndex]);
        let playlist = this.GET_PLAYLIST();
        localStorage.setItem("playlist", JSON.stringify(playlist));
      }
    },
    songMouseEnter(index) {
      if (this.album.innerTitle === "playlist" && this.isPlaylistChanging) {
        this.moveToIndex = index;
      }
    },
    moveSong(e) {
      this.startMove = this.endMove;
      this.endMove = e.pageY;
      let down;
      if (this.endMove > this.startMove) down = true;
      else if (this.endMove < this.startMove) down = false;
      else return false;

      this.moveObj = {
        from: this.moveFromIndex,
        to: this.moveToIndex,
        song: this.album.songs[this.moveFromIndex],
      };

      if (this.moveFromIndex !== this.moveToIndex) {
        this.MOVE_SONG(this.moveObj);
        this.album.songs.forEach((item, index) =>
          this.SONG_LEAVE([this.albumIndex, index])
        );
        this.SONG_OVER([this.albumIndex, this.moveObj.to]);
        this.moveFromIndex = this.moveToIndex;
      }
    },
  },
  mounted() {
    if (this.fromError) {
      this.checkActiveSongs(0, 0, true);
    }

    this.$root.$on("checkActiveSongs", (albumIndex, songIndex) => {
      this.checkActiveSongs(albumIndex, songIndex);
    });

    document.addEventListener("mousemove", (e) => {
      if (this.songDrag) this.moveSong(e);
    });

    this.colorScrollbar();
  },
};
</script>

<style lang="sass" scoped>
.album
  display: grid
  grid-template-rows: min-content 1fr min-content
  padding: 8px
  width: 320px
  background: rgba($black, .5)

  &__top
    display: grid
    grid-template-columns: min-content 1fr
    grid-column-gap: 10px
    background: rgba($black, .5)
    //padding: 8px 0
    user-select: none
    padding-bottom: 10px

  &__cover
    width: 100px
    height: auto
    border: 1px solid rgba($grey, .05)

  &__title
    white-space: nowrap
    //text-align: center
    font-size: 1.2rem
    margin-bottom: 5px
    color: $grey

  &__year
    white-space: nowrap
    //text-align: center
    font-size: .9rem
    color: rgba($grey, .7)

  &__songs-wrap
    padding: 10px 0 20px
    .vb
      height: 100%

  &__songs
    white-space: nowrap
    // height: 336px !important
    width: unset !important
    margin-right: -60px !important
    padding-right: 60px !important


  &__song-wrapper
    display: grid
    grid-template-columns: 1fr min-content 2px
    grid-gap: 3px
    align-items: baseline
    padding: 2px 4px
    user-select: none

  &__song
    display: grid
    grid-template-columns: 1fr min-content
    grid-gap: 4px
    align-items: baseline
    padding: 2px
    position: relative

    &:hover
      background: rgba($black, .5)
      cursor: pointer

    &.move
      cursor: move

  &__song-title
    display: grid
    grid-template-columns: min-content 1fr
    grid-column-gap: 4px
    span
      &:first-of-type
        text-align: right
        opacity: .5
        min-width: 20px
      &:last-of-type
        white-space: normal

  &__song-duration
    opacity: .5

  &__song-download
    // opacity: .7
    // cursor: pointer
    // position: relative
    // top: 2px
    
    &.disabled
      cursor: default

  &__download
    display: grid
    margin: 0 auto 10px
    width: 100%
    user-select: none

  .playlist
    &__buttons
      display: grid
      grid-template-columns: 1fr 1fr
      grid-gap: 10px
      margin: 0 auto 10px
      width: 100%
      user-select: none

    &__tooltip
      white-space: normal
      height: 100%
      display: grid
      text-align: center
      align-content: center
      padding: 5px
      grid-column-gap: 5px
      span
        padding: 2px 0

::v-deep .svg-icon.album__song-download
  top: 2px
  cursor: pointer
  svg
    opacity: .7

@media screen and (max-width: 400px)
  .album
    width: 100%
    padding: 8px 4px
    &__song
      grid-gap: 3px
    &__song-title
      grid-column-gap: 3px
</style>
