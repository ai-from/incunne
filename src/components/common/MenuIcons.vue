<template>
  <div class="menu-icons indent">
    <SVGIcon
        v-for="(svgIcon, index) in menuIcons"
        :key="index"
        :width="width"
        :height="height"
        class="menu-icon"
        :iconName="svgIcon.icon"
        :tooltipText="lang === 'en' ? svgIcon.tooltip.en : svgIcon.tooltip.ru"
        tooltipLocation="bottom"
        :color="svgIcon.isActive ? `rgba(${theme}, 1)` : color"
        @click="clickMenu(svgIcon)"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MenuIcons",
  data() {
    return {
        menuIcons: [
            {icon: 'music', tooltip: {ru: 'Музыка', en: 'Music'}, to: '/', isActive: false},
            {icon: 'text', tooltip: {ru: 'Текст', en: 'Text'}, to: '/text', isActive: false},
            {icon: 'photo', tooltip: {ru: 'Фото', en: 'Photo'}, to: '/photo', isActive: false},
            {icon: 'video', tooltip: {ru: 'Видео', en: 'Video'}, to: '/video', isActive: false},
            {icon: 'mail', tooltip: {ru: 'Обратная связь', en: 'Feedback'}, to: '/feedback', isActive: false},
            {icon: 'ava', tooltip: {ru: 'Обо мне', en: 'About'}, to: '/about', isActive: false}
        ],
        width: "auto",
        height: "20",
        color: "rgba(219, 219, 219, 0.5)",
    };
  },
  computed: {
    ...mapState("common", {
        theme: state => state.theme,
        lang: (state) => state.lang,
    }),
  },
  methods: {
    checkMenu() {
        let path = this.$route.path;
        this.menuIcons.forEach(item => {
            if(item.to === this.$route.path) item.isActive = true
            else item.isActive = false
        });
    },
    clickMenu(item) {
        if(item.to !== this.$route.path) {
            this.$router.push(item.to)
        }
    }
  },
  mounted() {
    this.checkMenu();
  },
  watch: {
    $route() {
        this.checkMenu();
    }
  }
};
</script>

<style lang="sass" scoped>
.menu-icons
    display: grid
    grid-template-columns: repeat(6, min-content)
    grid-gap: 10px
    padding-top: 10px
    padding-bottom: 10px
    display: none
    ::v-deep .svg-icon svg
        cursor: pointer
.menu-icons
    @media screen and (max-width: 900px)
        display: grid
</style>
