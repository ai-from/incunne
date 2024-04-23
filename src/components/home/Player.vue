<template>
  <div class="player indent">
    <div
      class="player__wrapper"
      :style="{ border: `1px solid rgba(${theme}, .3)` }"
      ref="playerWrapper"
      @click="playerClick"
    >
      <SVGIcon
        class="player__indicator"
        cssPosition="absolute"
        iconName="mode"
        :tooltipText="lang === 'en' ? 'Mode | Hot Keys' : 'Режим | Горячие клавиши'"
        :tooltipLocation="tooltipLocation.mode"
        :classes="['player__indicator']"
        :color="isPlayerActive && this.audio && this.audio.duration ? `rgb(${theme})` : `rgba(219, 219, 219, .7)`"
      />

      <div class="player__left">
        <SVGIcon
          class="player__prev"
          :classes="[{default: !songTitle}]"
          iconName="prevSong"
          :tooltipText="lang === 'en' ? 'Previous: Ctrl + ArrowLeft' : 'Предыдущий | Ctrl + Стрелка влево'"
          :tooltipLocation="tooltipLocation.prevSong"
          :color="`rgb(${theme})`"
          @click="prevClick"
        />

        <SVGIcon
          class="player__play"
          :classes="[{default: !songTitle}]"
          iconName="play"
          :tooltipText="lang === 'en' ? 'Play: Space' : 'Воспроизвести | Пробел'"
          :tooltipLocation="tooltipLocation.play"
          :color="`rgb(${theme})`"
          @click="playClick"
          v-if="isPaused"
        />

        <SVGIcon
          class="player__pause"
          :classes="[{default: !songTitle}]"
          iconName="pause"
          :tooltipText="lang === 'en' ? 'Pause: Space' : 'Пауза | Пробел'"
          :tooltipLocation="tooltipLocation.pause"
          :color="`rgb(${theme})`"
          @click="pauseClick"
          v-else
        />

        <SVGIcon
          class="player__next"
          :classes="[{default: !songTitle}]"
          iconName="nextSong"
          :tooltipText="lang === 'en' ? 'Next: Ctrl + ArrowRight' : 'Следующий | Ctrl + Стрелка вправо'"
          :tooltipLocation="tooltipLocation.nextSong"
          :color="`rgb(${theme})`"
          @click="nextClick"
        />
      </div>

      <div class="player__center">
        <div class="player__title" :style="{ color: `rgb(${theme})` }">
          {{ songTitle ? `${songTitle}` : lang === 'en' ? 'Choose a song' : 'Выберите песню' }}
        </div>

        <div class="player__line" @click="lineClick" ref="playerLine">
          <div
            class="player__line-colored"
            ref="playerLineColored"
            :style="{
              background: `rgb(${theme})`,
              width: `${lineColored}%`,
            }"
          >
            <div
              class="player__line-circle"
              :style="{ background: `rgb(${theme})` }"
              ref="playerLineCircle"
              @mousedown="lineCircleMousedown"
            ></div>
          </div>
        </div>

        <div class="player__time" :style="{ color: `rgb(${theme})` }">
          <div class="player__current-time" v-if="!lineDrag">{{ current }}</div>
          <div class="player__changing-time" v-else>{{ changingTime }}</div>

          <div class="player__time-move">
            <SVGIcon
              class="player__time-back"
              :classes="[{default: !songTitle}]"
              iconName="timeBack"
              :tooltipText="lang === 'en' ? 'Time back: ArrowLeft' : 'Время назад: Стрелка влево'"
              :tooltipLocation="tooltipLocation.timeBack"
              :color="`rgb(${theme})`"
              @click="timeBack"
            />

            <SVGIcon
              class="player__time-forward"
              :classes="[{default: !songTitle}]"
              iconName="timeForward"
              :tooltipText="lang === 'en' ? 'Time forward: ArrowRight' : 'Время вперед | Стрелка вправо'"
              :tooltipLocation="tooltipLocation.timeForward"
              :color="`rgb(${theme})`"
              @click="timeForward"
            />
          </div>

          <div class="player__duration">{{ duration }}</div>
        </div>
      </div>

      <div class="player__right">
        <div class="player__right-buttons">
          <SVGIcon
            class="player__repeat"
            :classes="[{default: !songTitle}]"
            iconName="repeat"
            :tooltipText="lang === 'en' ? 'Repeat: A' : 'Повторить: A'"
            :tooltipLocation="tooltipLocation.repeat"
            :color="`${isRepeat ? `rgb(${theme})` : `rgba(219,219,219, .7)`}`"
            @click="repeatClick"
          />

          <SVGIcon
            class="player__mix"
            :classes="[{default: !songTitle}]"
            iconName="mix"
            :tooltipText="lang === 'en' ? 'Mix: S' : 'Перемешать: S'"
            :tooltipLocation="tooltipLocation.mix"
            :color="`${isMix ? `rgb(${theme})` : `rgba(219,219,219, .7)`}`"
            @click="mixClick"
          />

          <SVGIcon
            class="player__queue"
            :classes="[{default: !songTitle}]"
            iconName="queue"
            :tooltipText="lang === 'en' ? 'Queue: Z' : 'По очереди: Z'"
            :tooltipLocation="tooltipLocation.queue"
            :color="`${isQueue ? `rgb(${theme})` : `rgba(219,219,219, .7)`}`"
            @click="queueClick"
          />

          <SVGIcon
            class="player__download"
            :classes="[{default: !songTitle}]"
            iconName="download"
            :tooltipText="lang === 'en' ? 'Download: X' : 'Скачать: X'"
            :tooltipLocation="tooltipLocation.download"
            :color="`rgb(${theme})`"
            @click="downloadClick"
          />

          <a
            :href="downloadSrc"
            :download="downloadName"
            ref="downloadLink"
            v-show="false"
          ></a>

          <div
            class="player__share-wrap"
          >
            <SVGIcon
              class="player__share"
              :class="{player__share_hide: this.isCopied}"
              :classes="[{default: !songTitle}]"
              cssPosition="absolute"
              iconName="share"
              :color="`rgb(${theme})`"
              :tooltipText="lang === 'en' ? 'Copy to clipboard: W' : 'Скопировать ссылку: W'"
              :tooltipLocation="tooltipLocation.share"
              @click="copyLink"
            />
            <SVGIcon
              class="player__copied"
              :class="{player__copied_show: this.isCopied, default: !songTitle}"
              cssPosition="absolute"
              iconName="copied"
              :color="`rgb(${theme})`"
              :tooltipText="mobile ? 
              lang === 'en' ?  tooltipTextCopied.mobile.en : tooltipTextCopied.mobile.ru :
              lang === 'en' ?  tooltipTextCopied.desktop.en : tooltipTextCopied.desktop.ru"
              :tooltipLocation="tooltipLocation.copied"
            /> 
          </div>
        </div>

        <div class="player__volume-wrapper">
          <div
            class="player__volume"
            :class="{default: !songTitle}"
            @click="volumeClick"
            ref="playerVolume"
            v-tooltip="{
              title: {ru: 'Громкость: Стрелка вверх | Стрелка вниз', en: 'Volume: ArrowUp | ArrowDown'},
              location: tooltipLocation.volume
            }"
          >
            <div
              ref="playerVolumeColored"
              class="player__volume-colored"
              :style="{
                background: `rgb(${theme})`,
                height: volumeDir ? `${volumeColored}%` : 'unset',
                width: !volumeDir ? `${volumeColored}%` : 'unset',
              }"
            >
              <div
                class="player__volume-circle"
                :style="{ background: `rgb(${theme})` }"
                ref="playerVolumeCircle"
                @mousedown="volumeCircleMouseDown"
              ></div>
            </div>
          </div>
          <div v-if="false" class="player__volume-percent" :style="{ color: `rgb(${theme})` }">
            {{ this.volumeColored.toFixed() }}%
          </div>
        </div>
      </div>
      <!-- player_right -->
    </div>
    <!-- player__wrapper -->
  </div>
  <!-- player -->
</template>

<script>
import { mapState, mapMutations } from "vuex";
import setDownloadParams from "../../mixins/setDownloadParams";
export default {
  name: "Player",
  data() {
    return {
      albumIndex: 0,
      songIndex: 0,
      songTitle: "",
      isPaused: true,
      isRepeat: false,
      isQueue: false,
      isMix: false,
      isCopied: false,
      audio: null,
      current: "00:00",
      changingTime: "00:00",
      duration: "00:00",
      lineColored: 0,
      volumeColored: 50,
      downloadSrc: "",
      downloadName: "",
      timeStep: 5,
      volumeStep: 1,
      volumeDir: true,
      lineDrag: false,
      volumeDrag: false,
      lineNewPosition: 0,
      volumeNewPosition: 0,
      tooltipTextCopied: {
        desktop: {
          ru: 'Скопировано',
          en: 'Copied'
        },
        mobile: {
          ru: 'Ссылка скопирована',
          en: 'Link copied'
        }
      },
      mobile: null,
      tooltipLocation: {
        mode: 'right',
        prevSong: 'right',
        nextSong: 'right',
        play: 'right',
        pause: 'right',
        timeBack: 'right',
        timeForward: 'right',
        repeat: 'left',
        mix: 'left',
        queue: 'left',
        download: 'left',
        share: 'left',
        copied: 'left',
        volume: 'left'
      }
    };
  },
  computed: {
    ...mapState("common", {
      theme: (state) => state.theme,
      isPlayerActive: (state) => state.isPlayerActive,
      lang: state => state.lang
    }),
    ...mapState("albums", {
      albums: (state) => state.albums,
    }),
  },
  mixins: [setDownloadParams],
  methods: {
    ...mapMutations("common", ["SET_IS_PLAYER_ACTIVE"]),
    playerClick() {
      this.SET_IS_PLAYER_ACTIVE(true);
    },
    playClick() {
      if (this.audio.duration) {
        this.isPaused = false;
        this.audio.play();
      }
    },
    pauseClick() {
      if (this.audio.duration) {
        this.isPaused = true;
        this.audio.pause();
      }
    },
    prevClick() {
      if (this.audio.duration) {
        if (this.songIndex === 0)
          this.songIndex = this.albums[this.albumIndex].songs.length - 1;
        else this.songIndex--;

        this.siblingSong();
        this.$root.$emit("checkActiveSongs", this.albumIndex, this.songIndex);
        this.downloadSrc = this.setDownloadParams(
          this.albums,
          this.albumIndex,
          this.songIndex
        ).downloadSrc;
        this.downloadName = this.setDownloadParams(
          this.albums,
          this.albumIndex,
          this.songIndex
        ).downloadName;
      }
    },
    nextClick() {
      if (this.audio.duration) {
        if (this.songIndex === this.albums[this.albumIndex].songs.length - 1)
          this.songIndex = 0;
        else this.songIndex++;

        this.siblingSong();
        this.$root.$emit("checkActiveSongs", this.albumIndex, this.songIndex);
        this.downloadSrc = this.setDownloadParams(
          this.albums,
          this.albumIndex,
          this.songIndex
        ).downloadSrc;
        this.downloadName = this.setDownloadParams(
          this.albums,
          this.albumIndex,
          this.songIndex
        ).downloadName;
      }
    },
    lineClick($event) {
      if (this.audio.duration) {
        let width = window
          .getComputedStyle(this.$refs.playerLine)
          .getPropertyValue("width");
        width = width.replace("px", "") * 1;
        let percent;

        if ($event.target.classList.contains("player__line-circle")) {
          let colored = window
            .getComputedStyle(this.$refs.playerLineColored)
            .getPropertyValue("width");
          colored = colored.replace("px", "") * 1;
          percent = (colored / width) * 100;
        } else {
          let curr = $event.layerX;
          percent = (curr / width) * 100;
        }

        this.lineColored = percent;
        this.audio.currentTime = (this.audio.duration / 100) * percent;
      }
    },
    lineCircleMousedown() {
      if (this.audio && this.audio.duration) {
        this.lineDrag = true;
      }
    },
    timeBack() {
      if (this.audio.duration) {
        this.audio.currentTime -= this.timeStep;
      }
    },
    timeForward() {
      if (this.audio.duration) {
        this.audio.currentTime += this.timeStep;
      }
    },
    repeatClick() {
      if (this.audio && this.audio.duration) {
        this.isRepeat = !this.isRepeat;
        this.isQueue = false;
        this.isMix = false;
      }
    },
    mixClick() {
      if (this.audio && this.audio.duration) {
        this.isMix = !this.isMix;
        this.isRepeat = false;
        this.isQueue = false;
      }
    },
    queueClick() {
      if (this.audio && this.audio.duration) {
        this.isQueue = !this.isQueue;
        this.isRepeat = false;
        this.isMix = false;
      }
    },
    downloadClick() {
      if (this.audio && this.audio.duration && this.downloadSrc && this.downloadName) {
        this.$refs.downloadLink.click();
      }
    },
    copyLink() {
      if (this.audio && this.audio.duration) {
        const songName = this.albums[this.albumIndex].songs[
          this.songIndex
        ].innerTitle.toLowerCase()
        const link = `${document.location.origin}?song=${songName}`
        navigator.clipboard
          .writeText(link)
          .then(() => {
            this.isCopied = true;
            setTimeout(() => {
              this.isCopied = false;
            }, 2000);
          })
          .catch((err) => {
            alert("Что-то пошло не так");
          });
      } else {
        return false;
      }
    },
    volumeClick($event) {
      if (this.audio.duration) {
        if (this.volumeDir) {
          let height, colored;
          height = window
            .getComputedStyle(this.$refs.playerVolume)
            .getPropertyValue("height");
          height = height.replace("px", "") * 1;
          colored = window
            .getComputedStyle(this.$refs.playerVolumeColored)
            .getPropertyValue("height");
          colored = colored.replace("px", "") * 1;
          let curr;
          let percent;

          if ($event.target.classList.contains("player__volume-colored")) {
            curr = colored - $event.layerY;
            percent = (curr / height) * 100;
          } else if ($event.target.classList.contains("player__volume-circle")) {
            percent = (colored / height) * 100;
          } else {
            curr = height - $event.layerY;
            percent = (curr / height) * 100;
          }
          this.volumeColored = percent;
          this.audio.volume = percent / 100;
        } else {
          let width, percent;
          width = window
            .getComputedStyle(this.$refs.playerVolume)
            .getPropertyValue("width");
          width = width.replace("px", "") * 1;

          if ($event.target.classList.contains("player__volume-circle")) {
            let colored = window
              .getComputedStyle(this.$refs.playerVolumeColored)
              .getPropertyValue("width");
            colored = colored.replace("px", "") * 1;
            percent = (colored / width) * 100;
          } else {
            let curr = $event.layerX;
            percent = (curr / width) * 100;
          }
          this.volumeColored = percent;
          this.audio.volume = percent / 100;
        }
      }
    },
    volumeCircleMouseDown() {
      if (this.audio && this.audio.duration) {
        this.volumeDrag = true;
      }
    },
    siblingSong() {
      this.songTitle = this.albums[this.albumIndex].songs[this.songIndex].title;
      this.duration = this.albums[this.albumIndex].songs[this.songIndex].duration;
      let album = this.albums[this.albumIndex].innerTitle;
      if (album === "playlist")
        album = this.albums[this.albumIndex].songs[this.songIndex].fromAlbum;
      let song = this.albums[this.albumIndex].songs[this.songIndex].innerTitle;
      this.audio.src = require(`./../../../public/albums/${album}/Incunne_${song}.mp3`);
      this.lineColored = 0;
      this.audio.load();
      this.isPaused = false;
      this.audio.play();
    },
    convertMilliSeconds(num) {
      let total = Math.round(num);
      let minutes = Math.floor(total / 60);
      minutes = minutes > 9 ? minutes : `0${minutes}`;
      let seconds = total - minutes * 60;
      seconds = seconds > 9 ? seconds : `0${seconds}`;
      return `${minutes}:${seconds}`;
    },
    moveCircle(e, container, handler, direction) {
      let scrolled = document.querySelector(".inner-layout > .scroll").scrollTop;
      let playerLeftMargin = document.querySelector(".player__wrapper").offsetLeft;
      let playerTopMargin = document.querySelector(".player__wrapper").offsetTop;
      let limits = {
        top: container.offsetTop,
        bottom: container.offsetHeight + container.offsetTop,
        left: container.offsetLeft,
        right: container.offsetWidth + container.offsetLeft,
      };
      if (direction) {
        let val = 0;
        if (e.pageX - playerLeftMargin < limits.left) {
          val = -handler.offsetWidth / 2;
        } else if (e.pageX - playerLeftMargin <= limits.right) {
          val = e.pageX - playerLeftMargin - limits.left - handler.offsetWidth / 2;
        } else if (e.pageX - playerLeftMargin > limits.right) {
          val = limits.right - limits.left - handler.offsetWidth / 2;
        }
        handler.style.left = val + "px";
        let percent = ((val + handler.offsetWidth / 2) / container.offsetWidth) * 100;
        this.lineColored = percent;
        this.lineNewPosition = (this.audio.duration / 100) * percent;
        this.changingTime = this.convertMilliSeconds(this.lineNewPosition);
      } else {
        let val = 0;
        if (this.volumeDir) {
          if (e.pageY + scrolled - playerTopMargin > limits.bottom) {
            val = -handler.offsetHeight / 2;
          } else if (e.pageY + scrolled - playerTopMargin >= limits.top) {
            val =
              limits.bottom -
              (e.pageY + scrolled - playerTopMargin) -
              handler.offsetHeight / 2;
          } else if (e.pageY + scrolled - playerTopMargin < limits.top) {
            val = container.offsetHeight - handler.offsetHeight / 2;
          }
          handler.style.top = "unset";
          handler.style.bottom = val + "px";
          let percent = ((val + handler.offsetHeight / 2) / container.offsetHeight) * 100;
          this.volumeColored = percent;
          this.volumeNewPosition = percent / 100;
          this.audio.volume = this.volumeNewPosition;
        } else {
          if (e.pageX - playerLeftMargin < limits.left) {
            val = -handler.offsetWidth / 2;
          } else if (e.pageX - playerLeftMargin <= limits.right) {
            val = e.pageX - playerLeftMargin - limits.left - handler.offsetWidth / 2;
          } else if (e.pageX - playerLeftMargin > limits.right) {
            val = limits.right - limits.left - handler.offsetWidth / 2;
          }
          let percent = ((val + handler.offsetWidth / 2) / container.offsetWidth) * 100;
          this.volumeColored = percent;
          this.volumeNewPosition = percent / 100;
          this.audio.volume = this.volumeNewPosition;
        }
      }
    },
    getVolumeDir() {
      let volumeHeight;
      if (this.$refs.playerVolume)
        volumeHeight = window
          .getComputedStyle(this.$refs.playerVolume)
          .getPropertyValue("height");
      if (volumeHeight) {
        volumeHeight = volumeHeight.replace("px", "") * 1;
        this.volumeDir = volumeHeight > 4;
        if (this.volumeDir) {
          this.$refs.playerVolumeCircle.style.left = "50%";
        } else {
          this.$refs.playerVolumeCircle.style.left = "unset";
        }
      }
    },
    isMobile() {
      const width = document.body.clientWidth;
      if(width <= 900) this.mobile = true
      else this.mobile = false
    },
    setTooltipPosition() {
      const width = document.body.clientWidth;
      if(width <= 900) {
        this.tooltipLocation.prevSong = 'bottom';
        this.tooltipLocation.nextSong = 'bottom';
        this.tooltipLocation.play = 'bottom';
        this.tooltipLocation.pause = 'bottom';
        this.tooltipLocation.timeBack = 'bottom';
        this.tooltipLocation.timeForward = 'bottom';
        this.tooltipLocation.repeat = 'bottom';
        this.tooltipLocation.mix = 'bottom';
        this.tooltipLocation.queue = 'bottom';
        this.tooltipLocation.download = 'bottom';
        this.tooltipLocation.share = 'bottom';
        this.tooltipLocation.copied = 'bottom';
        this.tooltipLocation.volume = 'bottom';
      } else {
        this.tooltipLocation.prevSong = 'right';
        this.tooltipLocation.nextSong = 'right';
        this.tooltipLocation.play = 'right';
        this.tooltipLocation.pause = 'right';
        this.tooltipLocation.timeBack = 'right';
        this.tooltipLocation.timeForward = 'right';
        this.tooltipLocation.repeat = 'left';
        this.tooltipLocation.mix = 'left';
        this.tooltipLocation.queue = 'left';
        this.tooltipLocation.download = 'left';
        this.tooltipLocation.share = 'left';
        this.tooltipLocation.copied = 'left';
        this.tooltipLocation.volume = 'left';
      }
    }
  },
  mounted() {
    this.audio = new Audio();

    this.$root.$on("chooseSong", (obj) => {
      this.albumIndex = obj.albumIndex;
      this.songIndex = obj.songIndex;
      this.songTitle = this.albums[this.albumIndex].songs[this.songIndex].title;
      let album = this.albums[this.albumIndex].innerTitle;
      if (album === "playlist")
        album = this.albums[this.albumIndex].songs[this.songIndex].fromAlbum;

      let song = this.albums[this.albumIndex].songs[this.songIndex].innerTitle;
      this.lineColored = 0;

      if (this.audio) {
        this.audio.src = require(`./../../../public/albums/${album}/Incunne_${song}.mp3`);
        this.audio.volume = this.volumeColored / 100;
        this.audio.load();
        if(!obj.url) {
          this.isPaused = false;
          this.audio.play();
        }
        this.downloadSrc = this.setDownloadParams(
          this.albums,
          this.albumIndex,
          this.songIndex
        ).downloadSrc;
        this.downloadName = this.setDownloadParams(
          this.albums,
          this.albumIndex,
          this.songIndex
        ).downloadName;
      }
    });

    this.audio.addEventListener("loadedmetadata", () => {
      this.duration = this.convertMilliSeconds(this.audio.duration);
    });

    this.audio.addEventListener("timeupdate", () => {
      if (this.audio) {
        // current time
        this.current = this.convertMilliSeconds(this.audio.currentTime);

        // lineColored position
        if (this.audio.duration) {
          let all = Math.round(this.audio.duration);
          let curr = Math.round(this.audio.currentTime);
          let percent = (curr / all) * 100;
          if (!this.lineDrag) this.lineColored = percent;
        }
      }
    });

    this.audio.addEventListener("ended", () => {
      this.pauseClick();

      if (this.isRepeat) {
        this.playClick();
      }

      if (this.isQueue) {
        this.nextClick();
      }

      if (this.isMix) {
        let min = 0;
        let max = this.albums[this.albumIndex].songs.length - 1;
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        if (random === this.songIndex) {
          if (random === max) random--;
          else random++;
        }
        this.$root.$emit("chooseSong", {
          albumIndex: this.albumIndex,
          songIndex: random,
        });
        this.$root.$emit("checkActiveSongs", this.albumIndex, random);
        this.downloadSrc = this.setDownloadParams(
          this.albums,
          this.albumIndex,
          random
        ).downloadSrc;
        this.downloadName = this.setDownloadParams(
          this.albums,
          this.albumIndex,
          random
        ).downloadName;
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (this.audio && this.audio.duration) {
        if (this.lineDrag) {
          let line = this.$refs.playerLine;
          let lineCircle = this.$refs.playerLineCircle;
          this.moveCircle(e, line, lineCircle, true);
        }
        if (this.volumeDrag) {
          let volume = this.$refs.playerVolume;
          let volumeCircle = this.$refs.playerVolumeCircle;
          this.moveCircle(e, volume, volumeCircle, false);
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (this.audio && this.audio.duration) {
        let el = this.$refs.playerWrapper;
        if (el !== e.target && !el.contains(e.target)) this.SET_IS_PLAYER_ACTIVE(false);
        else this.SET_IS_PLAYER_ACTIVE(true);
      }
    });

    document.addEventListener("mouseup", () => {
      if (this.audio && this.audio.duration) {
        if (this.lineDrag) {
          this.audio.currentTime = this.lineNewPosition;
          this.current = this.convertMilliSeconds(this.lineNewPosition);
          this.$refs.playerLineCircle.style.left = "unset";
          this.lineDrag = false;
        }
        if (this.volumeDrag) {
          if (this.volumeDir) {
            this.$refs.playerVolumeCircle.style.bottom = "unset";
            let height = window
              .getComputedStyle(this.$refs.playerVolumeCircle)
              .getPropertyValue("height");
            height = height.replace("px", "") * 1;
            this.$refs.playerVolumeCircle.style.top = -height / 2 + "px";
            this.volumeDrag = false;
          } else {
            this.$refs.playerVolumeCircle.style.right = "unset";
            let width = window
              .getComputedStyle(this.$refs.playerVolumeCircle)
              .getPropertyValue("width");
            width = width.replace("px", "") * 1;
            this.$refs.playerVolumeCircle.style.right = -width / 2 + "px";
            this.volumeDrag = false;
          }
        }
      }
    });

    document.addEventListener("keydown", (e) => {
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
      // copy link - W: 87
      if (this.audio && this.audio.duration && this.isPlayerActive) {
        e.preventDefault();

        // play/pause | space
        if (e.keyCode === 32 && this.isPaused) this.playClick();
        else if (e.keyCode === 32 && !this.isPaused) this.pauseClick();
        // time back/forward | arrowLeft / arrowRight
        else if (e.keyCode === 37 && !e.ctrlKey) this.timeBack();
        else if (e.keyCode === 39 && !e.ctrlKey) this.timeForward();
        // volume up/down | arrowUp / arrowDown
        else if (e.keyCode === 38) {
          if (this.audio.volume >= 1 - this.volumeStep / 100) {
            this.audio.volume = 1;
            this.volumeColored = 100;
          } else {
            this.audio.volume += this.volumeStep / 100;
            this.volumeColored += this.volumeStep;
          }
        } else if (e.keyCode === 40) {
          if (this.audio.volume <= this.volumeStep / 100) {
            this.audio.volume = 0;
            this.volumeColored = 0;
          } else {
            this.audio.volume -= this.volumeStep / 100;
            this.volumeColored -= this.volumeStep;
          }
        }

        // song prev/next | Ctrl + arrowLeft / Ctrl + arrowRight
        else if (e.ctrlKey && e.keyCode === 37) this.prevClick();
        else if (e.ctrlKey && e.keyCode === 39) this.nextClick();
        // repeat/mix/queue/download/copy | A / S / Z / X / W
        else if (e.keyCode === 65) this.repeatClick();
        else if (e.keyCode === 83) this.mixClick();
        else if (e.keyCode === 90) this.queueClick();
        else if (e.keyCode === 88) this.downloadClick();
        else if (e.keyCode === 87) this.copyLink();
      }
    });

    this.getVolumeDir();

    this.setTooltipPosition();

    this.isMobile();

    window.addEventListener("resize", () => {
      this.getVolumeDir();
      this.setTooltipPosition();
      this.isMobile();
    });
  },
  beforeDestroy() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio = null;
  },
};
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
    // position: absolute
    // left: 30px
    // top: 15px
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
    position: relative
    top: 3px
  &__queue
    cursor: pointer
  &__mix
    cursor: pointer
    position: relative
    top: 4px
  &__download
    cursor: pointer
  &__share-wrap
    width: 21px
    height: 21px
    position: relative
  &__share
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%) scale(1)
    cursor: pointer
    opacity: 1
    // transition: all linear .25s
    &_hide
      opacity: 0
      transform: translate(-50%, -50%) scale(0)
  &__copied
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%) scale(0)
    opacity: 0
    &_show
      opacity: 1
      transform: translate(-50%, -50%) scale(1)
      // transition: all linear .25s
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
    &.default
      cursor: default
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

::v-deep .svg-icon.player__indicator
  left: 30px
  top: 15px
  @media screen and (max-width: 900px)
    top: 20px
    left: 20px

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
      // top: 20px
      // left: 20px
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
      grid-template-columns: repeat(5, min-content)
      grid-template-rows: min-content
      justify-content: center
</style>
