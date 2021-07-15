<template>
  <div class="text-page indent">

    <div class="texts">
      <TextLeft />
      <TextRight />
    </div>

  </div>
</template>

<script>
import TextLeft from "../components/text/TextLeft"
import TextRight from "../components/text/TextRight"
export default {
  name: 'TextBoth',
  components: {
    TextLeft,
    TextRight
  }
}
</script>

<style lang="sass" scoped>
.text-page
  .texts
    display: grid
    grid-template-columns: 1fr 1fr
    grid-gap: 30px

@media screen and (max-width: 900px)
  .text-page
    .texts
      grid-template-columns: 1fr

</style>