export default {
  namespaced: true,
  state: {
    theme: '187,18,18',
    isBg: false,
    isPlayerActive: false
  },
  mutations: {
    SET_THEME(state, load) {
      state.theme = load
    },
    SET_BG(state, load) {
      state.isBg = load
    },
    SET_IS_PLAYER_ACTIVE(state, load) {
      state.isPlayerActive = load
    }
  },
  actions: {
    SET_THEME({commit}, load) {
      commit('SET_THEME', load)
    },
    SET_BG({commit}, load) {
      commit('SET_BG', load)
    },
    SET_IS_PLAYER_ACTIVE({commit}, load) {
      commit('SET_IS_PLAYER_ACTIVE', load)
    }
  },
  getters: {
    GET_THEME(state) {
      return state.theme
    },
    GET_BG(state) {
      return state.isBg
    },
    GET_IS_PLAYER_ACTIVE(state) {
      return state.isPlayerActive
    }
  }
}