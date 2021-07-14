import Vue from 'vue'
import Vuex from 'vuex'
import common from "./modules/common"
import albums from "./modules/albums"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    common,
    albums
  }
})
