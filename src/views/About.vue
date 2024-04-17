<template>
  <div class="about-page indent">
    {{ lang === 'en' ? 'About | This page is under development' : 'Обо мне | Страница находится в разработке' }}

  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'About',
  computed: {
    ...mapState('common', {
      lang: state => state.lang
    })
  }
}
</script>

<style lang="sass" scoped>
</style>
