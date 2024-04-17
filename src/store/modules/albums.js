export default {
  namespaced: true,
  state: {
    isPlaylistChanging: false,
    isPlaylistShow: true,
    albums: [
      {
        title: "Misanthrope",
        innerTitle: "misanthrope",
        year: 2021,
        date: "01.06.2021",
        songs: [
          {
            title: "Время",
            innerTitle: "Time",
            duration: "04:18",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
          {
            title: "Излом",
            innerTitle: "Break",
            duration: "03:25",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
          {
            title: "Грани",
            innerTitle: "Edges",
            duration: "04:00",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
          {
            title: "Ангел мой",
            innerTitle: "My-angel",
            duration: "03:52",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
          {
            title: "1/2",
            innerTitle: "1-2",
            duration: "11:12",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
          {
            title: "Мятежи пустых сердец",
            innerTitle: "Riots-of-empty-hearts",
            duration: "06:33",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
          {
            title: "Атмосфера",
            innerTitle: "Atmosphere",
            duration: "04:39",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
          {
            title: "Преданный",
            innerTitle: "Betrayed",
            duration: "05:22",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
          {
            title: "Криминальные поступки",
            innerTitle: "Criminal-acts",
            duration: "03:23",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
          {
            title: "Паразит",
            innerTitle: "Parasite",
            duration: "04:25",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
          {
            title: "Мизантроп",
            innerTitle: "Misanthrope",
            duration: "04:42",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
          {
            title: "Прототип",
            innerTitle: "Prototype",
            duration: "04:50",
            songHover: false,
            songActive: false,
            textHover: false,
            textActive: false,
          },
        ],
      },
    ],
  },
  mutations: {
    SET_PLAYLIST(state, load) {
      state.albums.unshift(load);
    },
    CREATE_PLAYLIST(state, lang) {
      state.albums.unshift({
        title: lang === "en" ? "Playlist" : "Плейлист",
        innerTitle: "playlist",
        year: new Date().getFullYear(),
        songs: [],
      });
    },
    DELETE_PLAYLIST(state) {
      state.albums.shift();
      state.isPlaylistChanging = false;
      state.isPlaylistShow = true;
    },
    SET_PLAYLIST_CHANGING(state, load) {
      state.isPlaylistChanging = load;
    },
    ADD_TO_PLAYLIST(state, load) {
      state.albums[0].songs.push(load);
    },
    DELETE_FROM_PLAYLIST(state, index) {
      state.albums[0].songs.splice(index, 1);
    },
    SET_PLAYLIST_SHOW(state, load) {
      state.isPlaylistShow = load;
    },
    MOVE_SONG(state, load) {
      state.albums[0].songs.splice(load.from, 1);
      state.albums[0].songs.splice(load.to, 0, load.song);
    },
    SONG_OVER(state, load) {
      state.albums[load[0]].songs[load[1]].songHover = true;
    },
    SONG_LEAVE(state, load) {
      state.albums[load[0]].songs[load[1]].songHover = false;
    },
    SONG_ACTIVE(state, load) {
      state.albums[load[0]].songs[load[1]].songActive = load[2];
    },
    TEXT_OVER(state, load) {
      state.albums[load[0]].songs[load[1]].textHover = true;
    },
    TEXT_LEAVE(state, load) {
      state.albums[load[0]].songs[load[1]].textHover = false;
    },
    TEXT_ACTIVE(state, load) {
      state.albums[load[0]].songs[load[1]].textActive = load[2];
    },
  },
  actions: {
    SET_PLAYLIST({ commit }, load) {
      commit("SET_PLAYLIST", load);
    },
    CREATE_PLAYLIST({ dispatch, commit, getters, rootGetters }) {
      const lang = rootGetters["common/GET_LANG"];
      commit("CREATE_PLAYLIST", lang);
    },
    DELETE_PLAYLIST({ commit }) {
      commit("DELETE_PLAYLIST");
    },
    SET_PLAYLIST_CHANGING({ commit }, load) {
      commit("SET_PLAYLIST_CHANGING", load);
    },
    ADD_TO_PLAYLIST({ commit }, load) {
      commit("ADD_TO_PLAYLIST", load);
    },
    DELETE_FROM_PLAYLIST({ commit }, index) {
      commit("DELETE_FROM_PLAYLIST", index);
    },
    SET_PLAYLIST_SHOW({ commit }, load) {
      commit("SET_PLAYLIST_SHOW", load);
    },
    MOVE_SONG({ commit }, load) {
      commit("MOVE_SONG", load);
    },
  },
  getters: {
    GET_ALBUMS(state) {
      return state.albums;
    },
    GET_PLAYLIST_CHANGING(state) {
      return state.isPlaylistChanging;
    },
    GET_PLAYLIST_SHOW(state) {
      return state.isPlaylistShow;
    },
    GET_PLAYLIST(state) {
      if (state.albums[0].innerTitle === "playlist") {
        return state.albums[0];
      }
    },
  },
};
