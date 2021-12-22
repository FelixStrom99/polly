<template>


  <div class="Answer-box-wrapper" >
   <button class="answer-alternative-size-wrapper" v-bind:key="a" v-for="a in question.a" v-on:click="answer(a,question.q)">
       {{ a }}
   </button>
  </div>


</template>
<script>

export default {
  name: "Question",
  props: {
    question: Object


  },

  methods: {
    answer: function (answer,title) {
      this.$emit("answer", answer,title);

    } 
  }
}
</script>
<style scoped>
.Answer-box-wrapper{
  text-align: center;
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 100px;
  gap: 70px 250px;
  height: 80vh;
  width: 120vh;
}
.answer-alternative-size-wrapper {
  border: solid 2px;
  border-color: rgba(82, 77, 77, 0.55);
  min-width: 30%;
  border-radius: 10px;
  color: #444;
  font-size: 300%;
  color: white;
}
.answer-alternative-size-wrapper:nth-child(1){
  background-color:darkred;
}

.answer-alternative-size-wrapper:nth-child(2){
  background-color: darkblue;
}

.answer-alternative-size-wrapper:nth-child(3){
  background-color: darkgreen;
}

.answer-alternative-size-wrapper:nth-child(4){
  background-color: darkgoldenrod;
}




</style>