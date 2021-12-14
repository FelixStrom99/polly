<template>

<p>{{question.q}}</p>
  <div class="Answer-box-wrapper" v-for="a in question.a"  v-bind:key="a" >
    <div class="answer-alternative-size-wrapper" >
      <div id="Answer-Box-symbol-prop" >
      </div>
      <div class="Answer-Box-textarea"  >
            {{a}}
      </div>

      <div class="Answer-Box-checkbox" >
        <input type="checkbox"
               class="Answer-Box-checkbox-prop
                animation_rubberband"
               v-on:click="answer(a,question.q)">
      </div>
    </div>
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
<style>
.Answer-box-wrapper{
  padding-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px 40px;
  justify-content: center;
  height: 40vh;
}
.answer-alternative-size-wrapper {
  display: flex;
  justify-content: space-evenly;
  align-content: center;
  wrap: flex;
  border: solid 2px;
  border-color: rgba(82, 77, 77, 0.55);
  background-color: white;
  height: 60%;
  width: 35%;
  min-width: 35%;
  border-radius: 10px;
  color: #444;
}

#Answer-Box-symbol-prop {
  column-width: 40px;
  background-color: rgba(6, 236, 4, 0.73);
  border-radius: 7px 0px 0px 7px;
  height: 100%;
  width: 20%;
}
.Answer-Box-textarea {
  border-left: solid 2px ;
  border-color: rgba(82, 77, 77, 0.55);
  column-width:auto;
  grid-column: 2 ;
  width: 93%;
}
.Answer-Box-checkbox {
  border-left: solid 2px;
  border-color: rgba(82, 77, 77, 0.55);
  column-width: 50px;
  height: 100%;
  grid-column: 3;
}
.Answer-Box-checkbox-prop{
  height: 100%;
  -webkit-transform: scale(2);
  transform: scale(2);
  border-radius: 5px;
}
.animation_rubberband{

  animation-iteration-count: infinite;
  animation-timing-function: linear;

  animation: rubberBand  2s infinite;
}
.animation_rubberband:hover{
  animation: 0 ;
}


@keyframes rubberBand {
  0%{
    transform: scale3d(2,2,2);
  }
  15%{
    transform: scale3d(2.15,1.85,2);
  }
  30%{
    transform: scale3d(1.85,2.15,2);
  }
  45%{
    transform: scale3d(2.15,1.85,2);
  }
  65%{
    transform: scale3d(2.05,1.95,2);
  }
  100%{
    transform: scale3d(2,2,2);
  }


}
</style>