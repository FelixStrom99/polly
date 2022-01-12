<template>
  <div id="result-followup-container">
    <div style="height: 20%">
  <h6>{{title}}</h6>
    </div>
    <div class="result-Boxes">

      <div class="bar" v-for="(item, key,i) in data" v-bind:key="'item'+key+i">
        <div class="answer-counter" v-bind:style="{height: item*2.3 + 'vh'}">
          <span>{{item}}</span>
        </div>
        <div id="answer-alternative-text">
          <p v-if="correct[i]==true" style="color: #41B853">{{key}}</p>
          <p v-if="correct[i]==false" style="vertical-align: middle">{{key}}</p>
        </div>




      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bars',
  props: {
    title:String,
    data: Object,
    correct:Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#result-followup-container{
  border: solid #EFA500 0.2vw;
  border-radius: 6px;
  width: 48% ;
  height: 50vh;
  font-size: 1.2vw;

}
.answer-counter{
  font-size: 1.5vw;
}

h6{
  display: block;
  font-size: 2vw;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  margin-top: 1vw;
}

.bar {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 23%;
  margin-top: auto;
}

.bar span {
  position: relative;
  top: -1.2em;
}
.bar:nth-child(1) div:nth-child(1) {
  background-color:#F40058;
  border-radius: 6px 6px 0px 0px;

}
.bar:nth-child(2) div:nth-child(1) {
  background-color:#43BEE5;
  border-radius: 6px 6px 0px 0px;

}
.bar:nth-child(3) div:nth-child(1) {
  background-color:#41B853;
  border-radius: 6px 6px 0px 0px;

}
.bar:nth-child(4) div:nth-child(1) {
  background-color:#EFA500;
  border-radius: 6px 6px 0px 0px;

}

.result-Boxes {
  display: flex;
  flex-direction: row;
  height: 80%;
  justify-content: space-evenly;

}

.answer-counter{

}

#answer-alternative-text{
  height: 4vw;
  margin-bottom: 2.5vw;
}

@media only screen and (max-width: 600px) {
  h6{
    font-size: 6vw;
  }

  .answer-counter span{
    font-size: 4vh;
  }

  #result-followup-container{
    width: 90%;
    font-size: 4vw;
  }
  #answer-alternative-text{
    margin-bottom: 15vw;
  }

}

</style>
