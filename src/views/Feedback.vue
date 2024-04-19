<template>
  <div class="feedback-page indent">

    <div class="feedback">

      <div class="feedback__links">
        <a
          class="feedback__link"
          v-for="(link, index) in links.filter(item => !removeList.includes(item.innerName))"
          :key="index"
          :href="link.href"
          :alt="link.alt"
          :title="link.title"
          target="_blank"
          @mouseover="link.isHover = true"
          @mouseleave="link.isHover = false"
          :style="{
            color: link.isHover ? `rgb(${theme})` : '',
            outline: link.isHover ? `1px solid rgba(${theme}, .3)` : ''
          }"
        >
          <span class="feedback__link-name">{{ link.name }}</span>
          <img
            class="feedback__link-img"
            :src="require(`./../assets/img/feedback/${link.innerName}.svg`)"
            :alt="`${link.name}`"
            :title="`${link.name}`"
          >
        </a>
      </div>

    </div>
    
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Feedback',
  data() {
    return {
      links: [
        {name: 'VK page', innerName: 'vk-page', href: 'https://vk.com/code.music', alt: 'Incunne | VK page', title: 'Incunne | VK page', isHover: false},
        {name: 'VK community', innerName: 'vk-community', href: 'https://vk.com/incunne', alt: 'Incunne | VK community', title: 'Incunne | VK community', isHover: false},
        {name: 'SoundCloud', innerName: 'sound-cloud', href: 'https://soundcloud.com/incunne', alt: 'Incunne | SoundCloud', title: 'Incunne | SoundCloud', isHover: false},
        {name: 'RealMusic', innerName: 'real-music', href: 'https://www.realrocks.ru/incunne/', alt: 'Incunne | RealMusic', title: 'Incunne | RealMusic', isHover: false},
        {name: 'PromoDj', innerName: 'promo-dj', href: 'https://promodj.com/incunne', alt: 'Incunne | PromoDj', title: 'Incunne | PromoDj', isHover: false},
        {name: 'YouTube', innerName: 'youtube', href: 'https://www.youtube.com/user/Incunne', alt: 'Incunne | YouTube', title: 'Incunne | YouTube', isHover: false},
        {name: 'Telegram', innerName: 'telegram', href: 'https://t.me/incunne', alt: 'Incunne | Telegram', title: 'Incunne | Telegram', isHover: false},
        {name: 'Instagram', innerName: 'instagram', href: 'https://instagram.com/hughes.stanley?r=nametag', alt: 'Incunne | Instagram', title: 'Incunne | Instagram', isHover: false},
        {name: 'Spotify', innerName: 'spotify', href: 'https://open.spotify.com/artist/3Wv8c01VRYuqn2Cwj02SGK', alt: 'Incunne | Spotify', title: 'Incunne | Spotify', isHover: false}
      ],
      removeList: [
        'promo-dj',
        'instagram',
        'spotify'
      ]
    }
  },
  computed: {
    ...mapState('common', {
      theme: state => state.theme,
      lang: state => state.lang
    })
  }
}
</script>

<style lang="sass">
.feedback-page
  .feedback
    display: grid
    grid-template-rows: 1fr min-content
    &__links
      display: grid
      grid-template-columns: repeat(auto-fill, minmax(200px, min-content))
      grid-template-rows: repeat(5, min-content)
      grid-gap: 50px
      align-content: space-between
    &__link
      width: 200px
      padding: 8px 10px
      background: rgba($black, .5)
      display: grid
      grid-template-columns: 1fr min-content
      grid-gap: 10px
      align-items: center
      outline: 1px solid rgba($grey, .1)
      &-name
      &-img
        display: block
        width: 34px

@media screen and (max-width: 576px)
  .feedback-page
    .feedback
      &__links
        grid-gap: 20px
        grid-template-columns: 1fr
      &__link
        width: 100%
        max-width: 400px
</style>