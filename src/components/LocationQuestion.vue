<template>
  <p> {{LocationQuestion.lq}}</p>
  <div class="container">
    <figure>
      <img
          v-bind:src="LocationQuestion.image">
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
  width: 1000px;
  height: 500px;
  overflow:scroll;
  margin-bottom: 20px;
  border: ridge 3px;
  border-radius: 20px;

}



</style>