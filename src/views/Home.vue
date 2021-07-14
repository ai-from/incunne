<template>
  <div class="home-page indent">
    <PlaylistControl />
    <div class="albums">
      <Album
        v-for="(album, index) in albums"
        :key="index"
        :album="album"
        :albumIndex="index"
        :fromError="fromError"
        class="albums__album"
        @downloadSong="downloadSong"
      />
      <a :href="downloadSongSrc" :download="downloadSongName" ref="songDownload" v-show="false"></a>
    </div>
  </div>
</template>

<script>
import PlaylistControl from "../components/home/PlaylistControl"
import Album from "../components/home/Album"
import {mapState} from 'vuex'
export default {
  name: 'Home',
  data() {
    return {
      fromError: false,
      downloadSongSrc: '',
      downloadSongName: ''
    }
  },
  components: {
    PlaylistControl,
    Album
  },
  computed: {
    ...mapState('albums', {
      albums: state => state.albums
    })
  },
  methods: {
    downloadSong(obj) {
      new Promise((res, rej) => {
        this.downloadSongSrc = obj.src
        this.downloadSongName = obj.name
        res()
      }).then(res => this.$refs.songDownload.click())
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromError = from.path === '/error'
    })
  }
}
</script>
