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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 6vw;
  gap: 5vw 8vw;
  width: 100%;
  height: 50%;
  background-size: 50%;
  z-index: -1;
  margin-top: 2%;
}
.answer-alternative-size-wrapper {
  border: solid 2px;
  border-color: rgba(82, 77, 77, 0.55);
  width: 40%;
  height: 60%;
  border-radius: 1vw;
  color: #444;
  font-size: 3vw;
  font-weight: bold;
  color: white;
}
.answer-alternative-size-wrapper:nth-child(1){
  background-color:#EFA500;

}

.answer-alternative-size-wrapper:nth-child(2){
  background-color: #43BEE5;
}

.answer-alternative-size-wrapper:nth-child(3){
  background-color: limegreen;
}

.answer-alternative-size-wrapper:nth-child(4){
  background-color: red;
}

@media only screen and (max-width: 600px) {
  .Answer-box-wrapper{
    margin-top: 40vw;
  }
  .answer-alternative-size-wrapper{
    font-size: 5vw;
  }
}




</style>