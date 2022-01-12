<template>
  <ul class="circles">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>

<h1 id="finished"> Thank you for playing this game: <span style="color: #43BEE5" >{{ pollId }}</span> </h1>
  <div>
  <button  class="playButtons">
    <router-link class="routerLink" v-bind:to="'/'">{{uiLabels.backMain}} </router-link>
  </button>
  </div>
  <footer> App created by Addetestar, FilleFellePollish, Zetter, LillKotten</footer>
</template>

<script>
import io from "socket.io-client";

const socket = io();

export default {
  name: "Finished",

data: function () {
  return {
    lang: "",
    uiLabels: {},
    pollId: null
  }
},
  created: function () {
    this.pollId = this.$route.params.id;
    this.lang = this.$route.params.lang;

    socket.emit("pageLoaded", {lang: this.lang, id: this.pollId});
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  }
}
</script>

<style scoped>
#finished{
  margin:8vh;
}
#finished h1{
  font-size: 250%;
}

footer {
  font-size: 125%;
  position: absolute;
  bottom: 3vh;
  width: 100%;
}
.circles{
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin-block-start: 0;
  margin-block-end: 0;
  padding-inline-start: 0;
  padding-left: 0;
}

.circles li{

  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background-color: #41B853;
  animation: animate 25s linear infinite;
  bottom: -150px;

}

.circles li:nth-child(1){
  left: 25%;
  background-color: #EFA500;
  width: 80px;
  height: 80px;
  animation-delay: 0s;
}


.circles li:nth-child(2){
  left: 10%;
  background-color:#43BEE5;
  width: 20px;
  height: 20px;
  animation-delay: 2s;
  animation-duration: 12s;
}

.circles li:nth-child(3){
  left: 70%;
  background-color:#43BEE5;
  width: 20px;
  height: 20px;
  animation-delay: 4s;
}

.circles li:nth-child(4){
  left: 40%;
  width: 60px;
  height: 60px;
  animation-delay: 0s;
  animation-duration: 18s;
}

.circles li:nth-child(5){
  left: 65%;
  background-color: #EFA500;
  width: 20px;
  height: 20px;
  animation-delay: 0s;
}

.circles li:nth-child(6){
  left: 75%;
  width: 110px;
  height: 110px;
  animation-delay: 3s;
}

.circles li:nth-child(7){
  left: 35%;
  width: 150px;
  height: 150px;
  animation-delay: 7s;
}

.circles li:nth-child(8){
  left: 50%;
  background-color: #F40058;
  width: 25px;
  height: 25px;
  animation-delay: 15s;
  animation-duration: 45s;
}

.circles li:nth-child(9){
  left: 20%;
  width: 15px;
  height: 15px;
  background-color: #F40058;
  animation-delay: 2s;
  animation-duration: 35s;
}

.circles li:nth-child(10){
  left: 85%;
  background-color: #43BEE5;
  width: 20px;
  height: 20px;
  animation-delay: 0s;
  animation-duration: 11s;
}
</style>