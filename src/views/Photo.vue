<template>
  <div class="photo-page indent">
    {{ lang === 'en' ? 'Photo | This page is under development' : 'Фото | Страница находится в разработке' }}
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Photo',
  computed: {
    ...mapState('common', {
      lang: state => state.lang
    })
  }
}
</script>

<style lang="sass" scoped>
</style>
