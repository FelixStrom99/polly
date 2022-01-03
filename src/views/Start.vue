<template>

  <main>
  <section style="width: 100% ;height: 45em">

    <button id="LangButton" style  v-on:click="switchLanguage">
      <div>
      <object data="/svg_files/Language_symbol/language-symbol.svg" type="image/svg+xml" style="float: left" >
      </object>
      </div>
      <div style="position: relative;top:20%">
      {{uiLabels.changeLanguage}}
      </div>
    </button>

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
    <section>


      <div id="headertext">
      <span>
	<span style="color:#43BEE5">M</span>
	<span style="color: #EFA500">a</span>
	<span style="color: #F40058">p</span>
	<span style="color:#43BEE5">Q</span>
	<span style="color: #F40058">u</span>
	<span style="color: #EFA500 ">i</span>
	<span style="color: #41B853 ">z</span>
</span>
      </div>

      <div id="nav">
        <div>
          <div v-if="play">
            <div id="pollID">
              <label style="font-size: 20px; font-weight: bold">
                {{ uiLabels.writePollId }}:
                <input class="participateInput" type="text" v-model="id">
              </label>
            </div>
            <p v-if="gameStatus===false" style="color: #c01313"> Game does not exist </p>
            <p v-else-if="gameStatus===true" style="color: #c01313"> Game is already in session </p>
            <button class="playButtons" v-on:click="checkGame()">
              {{ uiLabels.participatePoll }}
            </button>
            </div>
          <div v-else>
            <button class="playButtons" v-on:click="showPlay">{{ uiLabels.play }}</button>
          </div>
          <div id="backToMainButtonCenter">
          <button v-if="play===true" v-on:click="showPlayFalse" class="playButtons"  id="backToMainButton">
            Back to main
          </button>
          </div>
        </div>



        <button v-if="play===false" class="playButtons">
          <router-link class="routerLink" v-bind:to="'/create/'+lang">{{ uiLabels.create }}</router-link> <!-- uiLabels.createPoll-->
        </button>

      </div>
    </section>



  </section>
  </main >

</template>

<script>
import io from 'socket.io-client';

const socket = io();

export default {
  name: 'Start',
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "en",
      play: false,
      gameStatus:null

    }
  },
  created: function () {
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("gameChecked", (status) => {
      this.gameChecked(status)
    })
  },
  methods: {

    switchLanguage: function () {
      if (this.lang === "en")
        this.lang = "sv"
      else
        this.lang = "en"
      socket.emit("switchLanguage", this.lang)

    },

    showPlay: function () {
      this.play = true
    },
    showPlayFalse: function () {
      this.play = false
      this.gameStatus=null
    },
    checkGame: function () {
      socket.emit('checkGame', {id: this.id});
    },

    gameChecked: function (status) {
      if (this.id === status.id) {
        if (status.pollStatus === false) {
          this.gameStatus=false
        } else if (status.pollStatus === true && status.newGame === false) {
          this.gameStatus=true
        } else if (status.pollStatus === true && status.newGame === true) {
          this.$router.push({path: `/poll/${this.id}/` + this.lang})
        }
      }
      else {
        console.log(status.id, this.id)
      }

    }
  }
}



</script>

<style>

/* Colorscheme:
darkblue: #161B40
lightblue: #43BEE5
red: #F40058
Yellow: #EFA500
Green #41B853



*/

* {
  font-family: 'Roboto', sans-serif;;
  font-style: normal;
  font-weight: 400;
  font-weight: bold;
  z-index: 1;
}

body {
  width: 100%;
  height: 90%;
  background: #161B40;
  color: white;
}

.routerLink {
  color:inherit;
  text-decoration: none;
}

input {

  outline: none;
  padding: 1em;
  border: none;
  border-radius: 6px;
}



button {
  display: inline-block;
  padding: 0.35em 1.2em;
  border: 0.1em solid #EFA500;
  border-radius:6px;
  margin: 0 0.3em 0.3em 0;
  box-sizing: border-box;
  text-decoration: none;
  font-weight: bold;
  color: #161B40;
  text-align: center;
  transition: all 0.2s;
  /*background-color: transparent;*/

}

button:hover{
  background-color: #EFA500;
  cursor:pointer;
}

button:active{
  position: relative;
  top: 1px;
}

#LangButton {
  width:8%;
  height: 5%;
  font-size:100%;
  text-align: center;
  border: none;
  border-radius: 6px;
  position: absolute;
  top: 20px;
  right: 20px;
}

.playButtons{
  color: white;
  font-weight: bold;
  background-color: transparent;
  height:auto;
  width:auto;
  font-size:200%;
}
#backToMainButton{
  float: left;
  margin-left: 1%;
  margin-top: 1%;
  font-size: 100%;
  border: 0.2em solid #F40058
}
#backToMainButton:hover{
  background-color: #F40058;
}

#backToMainButtonCenter{
  display: flex;
  align-items: center;
  justify-content: center;
}

#nav {
  display: flex;
  justify-content: center;
  grid-gap: 10em;
  grid-template-columns: 10em 10em 10em;
  padding-top: 10%;
  padding-left: 2em;
  padding-rightright: 2em;
}
.header-prop{
  background: white;
  height: 20%
}

#headertext {
  padding-top: 5%;
  font-size: 700%;
  color: white;
  font-weight: bold;


}
#pollID{
  position:relative;
  top:1em;
  margin-bottom: 10%;
}
@import url('https://fonts.googleapis.com/css?family=Exo:400,700');

.context {
  width: 100%;
  position: absolute;
  top:50vh;
}

.context h1{
  text-align: center;
  color: #fff;
  font-size: 50px;
}
.participateInput{
  text-align: center;
  outline: none;
  border: none;
  font-size: 20px;
  font-weight: bold;
  margin-top: 5%;
  height: 22px;
  width: 85%;
  padding: 1em;
  border: none;
  border-radius: 6px;
}








.circles{
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 97%;
  height: 100%;
  overflow: hidden;
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
  width: 150px;
  height: 150px;
  animation-delay: 0s;
  animation-duration: 11s;
}



@keyframes animate {

  0%{
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }

  100%{
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}
</style>
