<template>
  <div class="feedback-page indent">
    {{ lang === 'en' ? 'Feedback | This page is under development' : 'Обратная связь | Страница находится в разработке' }}
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Feedback',
  computed: {
    ...mapState('common', {
      lang: state => state.lang
    })
  }
}
</script>