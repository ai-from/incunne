export default {
  methods: {
    setDownloadParams(albums, albumIndex, songIndex) {
      let album = albums[albumIndex].innerTitle
      if(albums[albumIndex].innerTitle === 'playlist') album = albums[albumIndex].songs[songIndex].fromAlbum
      let song = albums[albumIndex].songs[songIndex].innerTitle
      let downloadSrc = `albums/${album}/Incunne_${song}.mp3`

      let songName = albums[albumIndex].songs[songIndex].title
      let downloadName = `Incunne - ${songName}.mp3`

      return {downloadSrc, downloadName}
    }
  }
}
