<template>
  <div class="player indent">
    <div class="player__wrapper"
         :style="{border: `1px solid rgba(${theme}, .3)`}"
         ref="playerWrapper"
         @click="playerClick"
    >

      <svg
        class="player__indicator"
        width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>Mode</title>
        <path d="M11.9497 2.05025C12.9287 3.02922 13.5954 4.2765 13.8655 5.63437C14.1356 6.99223 13.997 8.3997 13.4672 9.67878C12.9373 10.9579 12.0401 12.0511 10.889 12.8203C9.73785 13.5895 8.38447 14 7 14C5.61553 14 4.26215 13.5895 3.11101 12.8203C1.95986 12.0511 1.06266 10.9579 0.532843 9.67878C0.00302947 8.3997 -0.135594 6.99223 0.134503 5.63437C0.4046 4.2765 1.07129 3.02922 2.05025 2.05025L3.45927 3.45927C2.75898 4.15956 2.28208 5.05178 2.08887 6.02311C1.89566 6.99444 1.99482 8.00125 2.37381 8.91623C2.75281 9.8312 3.39461 10.6132 4.21807 11.1635C5.04152 11.7137 6.00964 12.0073 7 12.0073C7.99036 12.0073 8.95848 11.7137 9.78193 11.1635C10.6054 10.6132 11.2472 9.8312 11.6262 8.91623C12.0052 8.00126 12.1043 6.99444 11.9111 6.02311C11.7179 5.05178 11.241 4.15956 10.5407 3.45927L11.9497 2.05025Z" :fill="isPlayerActive && this.audio && this.audio.duration ? `rgb(${theme})` : `rgba(219, 219, 219, .7)`"/>
        <line x1="7" y1="3.6655e-08" x2="7" y2="7" :stroke="isPlayerActive && this.audio && this.audio.duration ? `rgb(${theme})` : `rgba(219, 219, 219, .7)`" stroke-width="2"/>
      </svg>

      <div class="player__left">

        <svg
          class="player__prev"
          @click="prevClick"
          :fill="`rgb(${theme})`"
          width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
          <title>Previous: Ctrl + ArrowLeft</title>
          <path d="M7 8.5L14.5 15.8612V1.13878L7 8.5Z" />
          <path d="M0 8.5L7.5 15.8612L7.5 1.13878L0 8.5Z" />
        </svg>

        <svg
          class="player__play"
          v-if="isPaused"
          @click="playClick"
          :fill="`rgb(${theme})`"
          width="21" height="36" viewBox="0 0 21 36" xmlns="http://www.w3.org/2000/svg">
          <title>Play: Space</title>
          <path d="M21 18L0 35.3205L0 0.679491L21 18Z" />
        </svg>

        <svg
          class="player__pause"
          v-else
          @click="pauseClick"
          :fill="`rgb(${theme})`"
          width="15" height="34" viewBox="0 0 15 34" xmlns="http://www.w3.org/2000/svg">
          <title>Pause: Space</title>
          <rect width="4" height="34" />
          <rect x="11" width="4" height="34" />
        </svg>

        <svg
          class="player__next"
          @click="nextClick"
          :fill="`rgb(${theme})`"
          width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
          <title>Next: Ctrl + ArrowRight</title>
          <path d="M10 8.5L2.5 15.8612L2.5 1.13878L10 8.5Z" />
          <path d="M17 8.5L9.5 15.8612V1.13878L17 8.5Z" />
        </svg>

      </div>

      <div class="player__center">

        <div
          class="player__title"
          :style="{color: `rgb(${theme})`}"
        >
          {{ songTitle ? `${songTitle}` : 'Choose a song' }}
        </div>

        <div class="player__line"
             @click="lineClick"
             ref="playerLine">
          <div
            class="player__line-colored"
            ref="playerLineColored"
            :style="{
              background: `rgb(${theme})`,
              width: `${lineColored}%`
          }">
            <div
              class="player__line-circle"
              :style="{background: `rgb(${theme})`}"
              ref="playerLineCircle"
              @mousedown="lineCircleMousedown"
            ></div>
          </div>
        </div>

        <div
          class="player__time"
          :style="{color: `rgb(${theme})`}"
        >
          <div class="player__current-time" v-if="!lineDrag">{{ current }}</div>
          <div class="player__changing-time" v-else>{{ changingTime }}</div>

          <div class="player__time-move">
            <svg
              class="player__time-back"
              :fill="`rgb(${theme})`"
              @click="timeBack"
              width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
              <title>Time back: ArrowLeft</title>
              <path d="M5.77856 7.48304L11.97 13.5599V1.40617L5.77856 7.48304Z" />
              <path d="M0 7.48304L6.19144 13.5599L6.19144 1.40617L0 7.48304Z" />
            </svg>

            <svg
              class="player__time-forward"
              :fill="`rgb(${theme})`"
              @click="timeForward"
              width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
              <title>Time forward: ArrowRight</title>
              <path d="M9.22137 7.48304L3.02994 13.5599L3.02994 1.40617L9.22137 7.48304Z" />
              <path d="M15 7.48304L8.80856 13.5599V1.40617L15 7.48304Z" />
            </svg>

          </div>

          <div class="player__duration">{{ duration }}</div>
        </div>

      </div>

      <div class="player__right">

        <div class="player__right-buttons">

          <svg
            class="player__repeat"
            @click="repeatClick"
            width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>Repeat: A</title>
            <path d="M1 4.99999V20H19V5.99999H13.6562" :stroke="`${isRepeat ? `rgb(${theme})` : `rgba(219,219,219, .7`}`" stroke-width="2"/>
            <path d="M13.6623 2.49839L6.65301 6.00304L13.6623 9.50768L13.6623 2.49839Z" :fill="`${isRepeat ? `rgb(${theme})` : `rgba(219,219,219, .7`}`"/>
          </svg>

          <svg
            class="player__mix"
            @click="mixClick"
            width="23" height="26" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>Mix: S</title>
            <path d="M1 20H15" :stroke="`${isMix ? `rgb(${theme})` : `rgba(219,219,219, .7`}`" stroke-width="2"/>
            <path d="M0.999989 6L15 6" :stroke="`${isMix ? `rgb(${theme})` : `rgba(219,219,219, .7`}`" stroke-width="2"/>
            <path d="M9 7V19" :stroke="`${isMix ? `rgb(${theme})` : `rgba(219,219,219, .7`}`" stroke-width="2"/>
            <path d="M14.9977 2.49839L22.007 6.00304L14.9977 9.50768L14.9977 2.49839Z" :fill="`${isMix ? `rgb(${theme})` : `rgba(219,219,219, .7`}`"/>
            <path d="M14.9977 16.4984L22.007 20.003L14.9977 23.5077L14.9977 16.4984Z" :fill="`${isMix ? `rgb(${theme})` : `rgba(219,219,219, .7`}`"/>
          </svg>


          <svg
            class="player__queue"
            @click="queueClick"
            :stroke="`${isQueue ? `rgb(${theme})` : `rgba(219,219,219, .7`}`"
            width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>Queue: Z</title>
            <path d="M0 1H20" stroke-width="2"/>
            <path d="M0 8H16" stroke-width="2"/>
            <path d="M0 15H12" stroke-width="2"/>
          </svg>

          <svg
            class="player__download"
            @click="downloadClick"
            width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>Download: X</title>
            <path d="M10 6L10 0" :stroke="`rgb(${theme})`" stroke-width="2"/>
            <path d="M0 15L20 15" :stroke="`rgb(${theme})`" stroke-width="2"/>
            <path d="M13.5116 5.99768L10.007 13.007L6.50232 5.99768L13.5116 5.99768Z" :fill="`rgb(${theme})`"/>
          </svg>
          <a :href="downloadSrc" :download="downloadName" ref="downloadLink" v-show="false"></a>

        </div>

        <div class="player__volume-wrapper">
          <div class="player__volume"
               @click="volumeClick"
               ref="playerVolume"
               title="Volume: ArrowUp | ArrowDown"
          >
            <div
              ref="playerVolumeColored"
              class="player__volume-colored"
              :style="{
              background: `rgb(${theme})`,
              height: volumeDir ? `${volumeColored}%` : 'unset',
              width: !volumeDir ? `${volumeColored}%` : 'unset'
          }">
              <div
                class="player__volume-circle"
                :style="{background: `rgb(${theme})`}"
                ref="playerVolumeCircle"
                @mousedown="volumeCircleMouseDown"
              >
              </div>
            </div>

          </div>
          <div class="player__volume-percent"
               :style="{color: `rgb(${theme})`}"
          >
            {{this.volumeColored.toFixed()}}%
          </div>
        </div>

      </div> <!-- player_right -->

    </div> <!-- player__wrapper -->
  </div> <!-- player -->
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import setDownloadParams from "../../mixins/setDownloadParams"
export default {
  name: 'Player',
  data() {
    return {
      albumIndex: 0,
      songIndex: 0,
      songTitle: '',
      isPaused: true,
      isRepeat: false,
      isQueue: false,
      isMix: false,
      audio: null,
      current: '00:00',
      changingTime: '00:00',
      duration: '00:00',
      lineColored: 0,
      volumeColored: 50,
      downloadSrc: '',
      downloadName: '',
      timeStep: 5,
      volumeStep: 1,
      volumeDir: true,
      lineDrag: false,
      volumeDrag: false,
      lineNewPosition: 0,
      volumeNewPosition: 0
    }
  },
  computed: {
    ...mapState('common', {
      theme: state => state.theme,
      isPlayerActive: state => state.isPlayerActive
    }),
    ...mapState('albums',{
      albums: state => state.albums
    }),
  },
  mixins: [
    setDownloadParams
  ],
  methods: {
    ...mapMutations('common', [
      'SET_IS_PLAYER_ACTIVE'
    ]),
    playerClick() {
      this.SET_IS_PLAYER_ACTIVE(true)
    },
    playClick() {
      if(this.audio.duration) {
        this.isPaused = false
        this.audio.play()
      }
    },
    pauseClick() {
      if(this.audio.duration) {
        this.isPaused = true
        this.audio.pause()
      }
    },
    prevClick() {
      if(this.audio.duration) {
        if(this.songIndex === 0) this.songIndex = this.albums[this.albumIndex].songs.length - 1
        else this.songIndex--

        this.siblingSong()
        this.$root.$emit('checkActiveSongs', this.albumIndex, this.songIndex)
        this.downloadSrc = this.setDownloadParams(this.albums, this.albumIndex, this.songIndex).downloadSrc
        this.downloadName = this.setDownloadParams(this.albums, this.albumIndex, this.songIndex).downloadName
      }
    },
    nextClick() {
      if(this.audio.duration) {
        if(this.songIndex === (this.albums[this.albumIndex].songs.length - 1)) this.songIndex = 0
        else this.songIndex++

        this.siblingSong()
        this.$root.$emit('checkActiveSongs', this.albumIndex, this.songIndex)
        this.downloadSrc = this.setDownloadParams(this.albums, this.albumIndex, this.songIndex).downloadSrc
        this.downloadName = this.setDownloadParams(this.albums, this.albumIndex, this.songIndex).downloadName
      }
    },
    lineClick($event) {
      if(this.audio.duration) {

        let width = window.getComputedStyle(this.$refs.playerLine).getPropertyValue('width')
        width = width.replace('px', '') * 1
        let percent

        if($event.target.classList.contains('player__line-circle')) {
          let colored = window.getComputedStyle(this.$refs.playerLineColored).getPropertyValue('width')
          colored = colored.replace('px', '') * 1
          percent = colored / width * 100
        } else {
          let curr = $event.layerX
          percent = curr / width * 100
        }

        this.lineColored = percent
        this.audio.currentTime = this.audio.duration / 100 * percent
      }
    },
    lineCircleMousedown() {
      if(this.audio && this.audio.duration) {
        this.lineDrag = true
      }
    },
    timeBack() {
      if(this.audio.duration) {
        this.audio.currentTime -= this.timeStep
      }
    },
    timeForward() {
      if(this.audio.duration) {
        this.audio.currentTime += this.timeStep
      }
    },
    repeatClick() {
      if(this.audio && this.audio.duration) {
        this.isRepeat = !this.isRepeat
        this.isQueue = false
        this.isMix = false
      }
    },
    mixClick() {
      if(this.audio && this.audio.duration) {
        this.isMix = !this.isMix
        this.isRepeat = false
        this.isQueue = false
      }
    },
    queueClick() {
      if(this.audio && this.audio.duration) {
        this.isQueue = !this.isQueue
        this.isRepeat = false
        this.isMix = false
      }
    },
    downloadClick() {
      if(this.audio && this.audio.duration && this.downloadSrc && this.downloadName) {
        this.$refs.downloadLink.click()
      }
    },
    volumeClick($event) {
      if(this.audio.duration) {
        if(this.volumeDir) {
          let height, colored
          height = window.getComputedStyle(this.$refs.playerVolume).getPropertyValue('height')
          height = height.replace('px', '') * 1
          colored = window.getComputedStyle(this.$refs.playerVolumeColored).getPropertyValue('height')
          colored = colored.replace('px', '') * 1
          let curr
          let percent

          if($event.target.classList.contains('player__volume-colored')) {
            curr = colored - $event.layerY
            percent = curr / height * 100
          } else if($event.target.classList.contains('player__volume-circle')) {
            percent = colored / height * 100
          } else {
            curr = height - $event.layerY
            percent = curr / height * 100
          }
          this.volumeColored = percent
          this.audio.volume = percent / 100
        } else {
          let width, percent
          width = window.getComputedStyle(this.$refs.playerVolume).getPropertyValue('width')
          width = width.replace('px', '') * 1

          if($event.target.classList.contains('player__volume-circle')) {
            let colored = window.getComputedStyle(this.$refs.playerVolumeColored).getPropertyValue('width')
            colored = colored.replace('px', '') * 1
            percent = colored / width * 100
          } else {
            let curr = $event.layerX
            percent = curr / width * 100
          }
          this.volumeColored = percent
          this.audio.volume = percent / 100
        }

      }
    },
    volumeCircleMouseDown() {
      if(this.audio && this.audio.duration) {
        this.volumeDrag = true
      }
    },
    siblingSong() {
      this.songTitle = this.albums[this.albumIndex].songs[this.songIndex].title
      this.duration = this.albums[this.albumIndex].songs[this.songIndex].duration
      let album = this.albums[this.albumIndex].innerTitle
      if(album === 'playlist') album = this.albums[this.albumIndex].songs[this.songIndex].fromAlbum
      let song = this.albums[this.albumIndex].songs[this.songIndex].innerTitle
      this.audio.src = require(`./../../../public/albums/${album}/Incunne_${song}.mp3`)
      this.lineColored = 0
      this.audio.load()
      this.isPaused = false
      this.audio.play()
    },
    convertMilliSeconds(num) {
      let total = Math.round(num)
      let minutes = Math.floor(total / 60)
      minutes = minutes > 9 ? minutes : `0${minutes}`
      let seconds = total - (minutes * 60)
      seconds = seconds > 9 ? seconds : `0${seconds}`
      return `${minutes}:${seconds}`
    },
    moveCircle(e, container, handler, direction) {
      let scrolled = document.querySelector('.inner-layout > .scroll').scrollTop
      let playerLeftMargin = document.querySelector('.player__wrapper').offsetLeft
      let playerTopMargin = document.querySelector('.player__wrapper').offsetTop
      let limits = {
        top: container.offsetTop,
        bottom: container.offsetHeight + container.offsetTop,
        left: container.offsetLeft,
        right: container.offsetWidth + container.offsetLeft
      }
      if(direction) {
        let val = 0
        if(e.pageX - playerLeftMargin < limits.left) {val = -handler.offsetWidth / 2}
        else if (e.pageX - playerLeftMargin <= limits.right) {val = e.pageX - playerLeftMargin - limits.left - handler.offsetWidth / 2}
        else if (e.pageX - playerLeftMargin > limits.right) {val = limits.right - limits.left - handler.offsetWidth / 2}
        handler.style.left = val + 'px'
        let percent = (val + handler.offsetWidth / 2) / container.offsetWidth * 100
        this.lineColored = percent
        this.lineNewPosition = this.audio.duration / 100 * percent
        this.changingTime = this.convertMilliSeconds(this.lineNewPosition)
      } else {
        let val = 0
        if(this.volumeDir) {
          if((e.pageY + scrolled - playerTopMargin) > limits.bottom) {val = -handler.offsetHeight / 2}
          else if((e.pageY + scrolled - playerTopMargin) >= limits.top) {val = limits.bottom - (e.pageY + scrolled - playerTopMargin) - handler.offsetHeight / 2}
          else if ((e.pageY + scrolled - playerTopMargin) < limits.top) {val = container.offsetHeight - handler.offsetHeight / 2}
          handler.style.top = 'unset'
          handler.style.bottom = val + 'px'
          let percent = (val + handler.offsetHeight / 2) / container.offsetHeight * 100
          this.volumeColored = percent
          this.volumeNewPosition = percent / 100
          this.audio.volume = this.volumeNewPosition
        } else {
          if(e.pageX - playerLeftMargin < limits.left) {val = -handler.offsetWidth / 2}
          else if (e.pageX - playerLeftMargin <= limits.right) {val = e.pageX - playerLeftMargin - limits.left - handler.offsetWidth / 2}
          else if (e.pageX - playerLeftMargin > limits.right) {val = limits.right - limits.left - handler.offsetWidth / 2}
          let percent = (val + handler.offsetWidth / 2) / container.offsetWidth * 100
          this.volumeColored = percent
          this.volumeNewPosition = percent / 100
          this.audio.volume = this.volumeNewPosition
        }
      }
    },
    getVolumeDir() {
      let volumeHeight
      if(this.$refs.playerVolume) volumeHeight = window.getComputedStyle(this.$refs.playerVolume).getPropertyValue('height')
      if(volumeHeight) {
        volumeHeight = volumeHeight.replace('px', '') * 1
        this.volumeDir = volumeHeight > 4
        if(this.volumeDir) {
          this.$refs.playerVolumeCircle.style.left = '50%'
        } else {
          this.$refs.playerVolumeCircle.style.left = 'unset'
        }
      }
    }
  },
  mounted() {
    this.audio = new Audio()

    this.$root.$on('chooseSong', obj => {
      this.albumIndex = obj.albumIndex
      this.songIndex = obj.songIndex
      this.songTitle = this.albums[this.albumIndex].songs[this.songIndex].title
      let album = this.albums[this.albumIndex].innerTitle
      if(album === 'playlist') album = this.albums[this.albumIndex].songs[this.songIndex].fromAlbum

      let song = this.albums[this.albumIndex].songs[this.songIndex].innerTitle
      this.lineColored = 0

      if(this.audio) {
        this.audio.src = require(`./../../../public/albums/${album}/Incunne_${song}.mp3`)
        this.audio.volume = this.volumeColored / 100
        this.audio.load()
        this.isPaused = false
        this.audio.play()
        this.downloadSrc = this.setDownloadParams(this.albums, this.albumIndex, this.songIndex).downloadSrc
        this.downloadName = this.setDownloadParams(this.albums, this.albumIndex, this.songIndex).downloadName
      }

    })

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.convertMilliSeconds(this.audio.duration)
    })

    this.audio.addEventListener('timeupdate', () => {
      if(this.audio) {
        // current time
        this.current = this.convertMilliSeconds(this.audio.currentTime)

        // lineColored position
        if(this.audio.duration) {
          let all = Math.round(this.audio.duration)
          let curr = Math.round(this.audio.currentTime)
          let percent = curr / all * 100
          if(!this.lineDrag) this.lineColored = percent
        }
      }
    })

    this.audio.addEventListener('ended', () => {
      this.pauseClick()

      if(this.isRepeat) {
        this.playClick()
      }

      if(this.isQueue) {
        this.nextClick()
      }

      if(this.isMix) {
        let min = 0
        let max = this.albums[this.albumIndex].songs.length - 1
        let random = Math.floor(Math.random() * (max - min + 1)) + min
        if(random === this.songIndex) {
          if(random === max) random--
          else random++
        }
        this.$root.$emit('chooseSong', {albumIndex: this.albumIndex, songIndex: random})
        this.$root.$emit('checkActiveSongs', this.albumIndex, random)
        this.downloadSrc = this.setDownloadParams(this.albums, this.albumIndex, random).downloadSrc
        this.downloadName = this.setDownloadParams(this.albums, this.albumIndex, random).downloadName
      }

    })

    document.addEventListener('mousemove', e => {
      if(this.audio && this.audio.duration) {
        if(this.lineDrag) {
          let line = this.$refs.playerLine
          let lineCircle = this.$refs.playerLineCircle
          this.moveCircle(e, line, lineCircle, true)
        }
        if(this.volumeDrag) {
          let volume = this.$refs.playerVolume
          let volumeCircle = this.$refs.playerVolumeCircle
          this.moveCircle(e, volume, volumeCircle, false)
        }
      }
    })

    document.addEventListener('click', e => {
      if(this.audio && this.audio.duration) {
        let el = this.$refs.playerWrapper
        if(el !== e.target && !el.contains(e.target)) this.SET_IS_PLAYER_ACTIVE(false)
        else this.SET_IS_PLAYER_ACTIVE(true)
      }
    })

    document.addEventListener('mouseup', () => {
      if(this.audio && this.audio.duration) {
        if(this.lineDrag) {
          this.audio.currentTime = this.lineNewPosition
          this.current = this.convertMilliSeconds(this.lineNewPosition)
          this.$refs.playerLineCircle.style.left = 'unset'
          this.lineDrag = false
        }
        if(this.volumeDrag) {
          if(this.volumeDir) {
            this.$refs.playerVolumeCircle.style.bottom = 'unset'
            let height = window.getComputedStyle(this.$refs.playerVolumeCircle).getPropertyValue('height')
            height = height.replace('px', '') * 1
            this.$refs.playerVolumeCircle.style.top = - height / 2 + 'px'
            this.volumeDrag = false
          } else {
            this.$refs.playerVolumeCircle.style.right = 'unset'
            let width = window.getComputedStyle(this.$refs.playerVolumeCircle).getPropertyValue('width')
            width = width.replace('px', '') * 1
            this.$refs.playerVolumeCircle.style.right = - width / 2 + 'px'
            this.volumeDrag = false
          }
        }
      }
    })

    document.addEventListener('keydown', (e) => {
      // space: 32
      // arrowLeft: 37
      // arrowRight: 39
      // arrowUp: 38
      // arrowDown: 40
      // ctrl: 17
      // repeat - A: 65
      // mix - S: 83
      // queue - Z: 90
      // download - X: 88
      if(this.audio && this.audio.duration && this.isPlayerActive) {
        e.preventDefault()

        // play/pause | space
        if(e.keyCode === 32 && this.isPaused) this.playClick()
        else if(e.keyCode === 32 && !this.isPaused) this.pauseClick()

        // time back/forward | arrowLeft / arrowRight
        else if(e.keyCode === 37 && !e.ctrlKey) this.timeBack()
        else if(e.keyCode === 39 && !e.ctrlKey) this.timeForward()

        // volume up/down | arrowUp / arrowDown
        else if(e.keyCode === 38) {
          if(this.audio.volume >= 1 - (this.volumeStep / 100)) {
            this.audio.volume = 1
            this.volumeColored = 100
          } else {
            this.audio.volume += this.volumeStep /100
            this.volumeColored += this.volumeStep
          }
        } else if(e.keyCode === 40) {
          if(this.audio.volume <= this.volumeStep / 100) {
            this.audio.volume = 0
            this.volumeColored = 0
          } else {
            this.audio.volume -= this.volumeStep / 100
            this.volumeColored -= this.volumeStep
          }
        }

        // song prev/next | Ctrl + arrowLeft / Ctrl + arrowRight
        else if(e.ctrlKey && e.keyCode === 37) this.prevClick()
        else if(e.ctrlKey && e.keyCode === 39) this.nextClick()

        // repeat/mix/queue/download | A / S / Z / X
        else if(e.keyCode === 65) this.repeatClick()
        else if(e.keyCode === 83) this.mixClick()
        else if(e.keyCode === 90) this.queueClick()
        else if(e.keyCode === 88) this.downloadClick()
      }
    })

    this.getVolumeDir()

    window.addEventListener('resize', () => this.getVolumeDir())

  },
  beforeDestroy() {
    this.audio.pause()
    this.audio.currentTime = 0
    this.audio = null
  }
}
</script>

<style lang="sass" scoped>
.player
  margin-bottom: 50px
  &.hide
    height: 0
    margin-bottom: 0
    overflow: hidden
  &__wrapper
    width: min-content
    padding: 30px
    background: rgba($black, .5)
    display: grid
    grid-template-columns: repeat(3, min-content)
    grid-column-gap: 30px
    align-items: center
    position: relative
  &__left
    height: 36px
    display: grid
    grid-template-columns: min-content 21px min-content
    grid-column-gap: 30px
    align-items: center
    position: relative
  &__indicator
    position: absolute
    left: 30px
    top: 15px
  &__prev
    cursor: pointer
  &__next
    cursor: pointer
  &__play
    cursor: pointer
    margin: 0 auto
  &__pause
    cursor: pointer
    margin: 0 auto
  &__center
    display: grid
    grid-template-rows: repeat(3, min-content)
    grid-row-gap: 20px
    align-items: center
  &__title
    user-select: none
  &__line
    width: 427px
    height: 4px
    background: rgba($grey, .7)
    position: relative
    cursor: pointer
    user-select: none
  &__line-colored
    position: absolute
    left: 0
    top: 0
    bottom: 0
  &__line-circle
    position: absolute
    right: -5px
    top: 50%
    transform: translateY(-50%)
    width: 10px
    height: 10px
    border-radius: 100%
  &__time
    display: grid
    grid-template-columns: 1fr 1fr 1fr
    user-select: none
  &__time-move
    display: grid
    justify-content: center
    grid-template-columns: repeat(2, min-content)
    grid-gap: 10px
    align-items: center
  &__time-back
    cursor: pointer
  &__time-forward
    cursor: pointer
  &__current-time
  &__duration
    display: grid
    justify-content: right
  &__right
    display: grid
    grid-template-columns: repeat(2, min-content)
    grid-column-gap: 30px
    align-items: center
  &__right-buttons
    display: grid
    grid-template-columns: repeat(2, min-content)
    grid-template-rows: repeat(2, min-content)
    grid-gap: 20px
    align-items: end
  &__repeat
    cursor: pointer
  &__queue
    cursor: pointer
  &__mix
    cursor: pointer
    position: relative
    top: 5px
  &__download
    cursor: pointer
  &__volume-wrapper
    display: grid
    grid-template-rows: repeat(2, min-content)
    grid-gap: 5px
    justify-items: center
    width: 31px
  &__volume
    width: 4px
    height: 70px
    background: rgba($grey, .7)
    position: relative
    cursor: pointer
    user-select: none
  &__volume-colored
    position: absolute
    left: 0
    right: 0
    bottom: 0
  &__volume-circle
    position: absolute
    left: 50%
    transform: translateX(-50%)
    top: -5px
    width: 10px
    height: 10px
    border-radius: 100%
  &__volume-percent
    font-size: .8rem
    user-select: none

@media screen and (max-width: 900px)
  .player
    &__wrapper
      width: 100%
      max-width: 400px
      grid-template-columns: 1fr
      grid-template-rows: repeat(3, min-content)
      padding: 60px 20px 30px
      grid-row-gap: 30px
    &__indicator
      top: 20px
      left: 20px
    &__center
      grid-column: 1/2
      grid-row: 1/2
    &__line
      width: 100%
    &__left
      grid-column: 1/2
      grid-row: 2/3
      justify-content: center
    &__right
      grid-column: 1/2
      grid-row: 3/4
      display: grid
      grid-template-columns: 1fr
      grid-template-rows: repeat(2, min-content)
      grid-row-gap: 30px
    &__volume-wrapper
      width: 100%
      grid-gap: 15px
      grid-column: 1/2
      grid-row: 1/2
    &__volume
      width: 100%
      height: 4px
    &__volume-colored
      top: 0
      bottom: 0
      left: 0
      right: unset
    &__volume-circle
      left: unset
      right: -5px
      top: 50% !important
      transform: translateY(-50%)
    &__right-buttons
      grid-column: 1/2
      grid-row: 2/3
      grid-template-columns: repeat(4, min-content)
      grid-template-rows: min-content
      justify-content: center
</style>