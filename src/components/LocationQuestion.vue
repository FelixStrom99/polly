<template>
  <div>
    <figure>
      <p> {{LocationQuestion.lq}}</p>
      <img
          url="https://upload.wikimedia.org/wikipedia/commons/0/0c/Uppsala_Anteckningar_om_staden_och_dess_omgifning_-_karta.jpg"
          style="height:200px; width:200px;">
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

</style>