<template>
  <h3>{{title}}</h3>
<div class="answer-alternative-size-wrapper">
  <div class="bar" v-for="(item, key,i) in data" v-bind:key="key">
    <div v-bind:style="{height: item*0.3 + 'vh'}">
      <span> {{item}} </span>
    </div>
    <div> 
      {{key}}
    </div>
    {{correct[i]}}
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
.bar {
  display: inline-block;
  width: 5vw;
  vertical-align: bottom;
}

.bar span {
  position: relative;
  top: -1.2em;
}
.bar:nth-child(1) div:nth-child(1) {
  background-color:#F40058;
}
.bar:nth-child(2) div:nth-child(1) {
  background-color:#43BEE5;
}
.bar:nth-child(3) div:nth-child(1) {
  background-color:#41B853;
}
.bar:nth-child(4) div:nth-child(1) {
  background-color:#EFA500
}
.bar:nth-child(5) div:nth-child(1) {
  background-color:yellow;
}

.answer-alternative-size-wrapper {
  padding:3em;
}
</style>
