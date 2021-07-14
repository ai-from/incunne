export default {
  methods: {
    setBg() {
      let body = document.querySelector('body')
      let el = document.createElement('div')
      el.setAttribute('id', 'bg')
      body.appendChild(el)
    }
  }
}
