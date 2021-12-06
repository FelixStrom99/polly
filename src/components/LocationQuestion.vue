<template>
  <header>

  </header>
  <p> {{LocationQuestion.lq}}</p>

  <div class="container">
    <figure>
      <img id="map" v-bind:src="LocationQuestion.image">
    </figure>
  </div>
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
    }
  }
}
</script>

<style scoped>
.container{
  width: 500px;
  height: 500px;
  overflow:scroll;

}
#map{
  border: ridge 3px;
  border-radius: 20px;

}



</style>