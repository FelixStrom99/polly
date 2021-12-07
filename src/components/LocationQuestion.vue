<template>

      <img id="map" v-bind:src="LocationQuestion.image">
</template>

<script>
export default {
  name: "LocationQuestion",

  props: {
    LocationQuestion: Object
  },
  methods: {
    answer: function (answer) {
      this.$emit("answer", answer);
    },
    userSetLocation: function (event) {
      var offset = {
        x: event.currentTarget.getBoundingClientRect().left,
        y: event.currentTarget.getBoundingClientRect().top

        }
      return offset
      }
    }

}
</script>

<style scoped>







</style>