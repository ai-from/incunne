<template>
  <div class="video-page indent">
    {{ lang === 'en' ? 'Video | This page is under development' : 'Видео | Страница находится в разработке' }}
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Video',
  computed: {
    ...mapState('common', {
      lang: state => state.lang
    })
  }
}
</script>