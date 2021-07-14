<template>
  <div class="home-page indent">
    <PlaylistControl />
  </div>
</template>

<script>
import PlaylistControl from "../components/home/PlaylistControl"
export default {
  name: 'Home',
  components: {
    PlaylistControl
  }
}
</script>
