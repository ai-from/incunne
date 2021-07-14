import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState('common', {
      theme: state => state.theme
    })
  },
  methods: {
    colorScrollbar() {
      if(document.querySelector('.vb-dragger-styler')) {
        let arr = document.querySelectorAll('.vb-dragger-styler')
        arr.forEach(item => item.style.background = `rgba(${this.theme}, .3)`)
      }
    }
  }
}