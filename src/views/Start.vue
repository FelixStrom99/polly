<template>


  <header class="header-prop">
    <div><br>
      <button id="LangButton" style  v-on:click="switchLanguage">
        <object data="/svg_files/Language_symbol/language-symbol.svg" type="image/svg+xml" style="float: left">
        </object>
        {{uiLabels.changeLanguage}}</button>
    </div>
  </header>
  <main class="theme">
  <section>
    <section>
      <h2> {{uiLabels.welcome}} </h2>
      <h1 id="headertext">MapQuiz</h1>
      <div id="nav">
        <div>
          <div v-if="play">
            <button class="playButtons">
              <router-link class="routerLink" v-bind:to="'/poll/'+id" tag="button">{{ uiLabels.participatePoll }}</router-link>
            </button>
              <div id="pollID">
            <label>
              {{ uiLabels.writePollId }}:
              <input type="text" v-model="id">
            </label>
              </div>
            </div>
          <div v-else>
            <button class="playButtons" v-on:click="showPlay">{{ uiLabels.play }}</button>
          </div>
        </div>



        <button class="playButtons">
          <router-link class="routerLink" v-bind:to="'/create/'+lang">{{ uiLabels.createPoll }}</router-link>
        </button>

      </div>
    </section>

    <footer class="bottom">
      please do not sue us Glöggkrök incorperated
    </footer>
    <button >
      <router-link class="routerLink" v-bind:to="'/testsite/'">TESTSITE</router-link>
    </button>
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
      play: false

    }
  },
  created: function () {
    socket.on("init", (labels) => {
      this.uiLabels = labels
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
     this.play=true

    }
  }
}


</script>

<style>
* {
  font-family: Helvetica;
  font-style: normal;
  font-weight: 100;
}

body {
  margin:0;
}

.routerLink {
  color:inherit;
  text-decoration: none;


}

.theme {

  background: linear-gradient(-45deg, #ee9052, #d22736, #1682a8, #22d999);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }

}
button{
  font-size:100%;
  text-align: center;
  border: none;
  border-radius: 12px;
}
button:hover{
  background-color:lightgrey;
  cursor:pointer;
}
button:active{
  position: relative;
  top: 1px;
}
#LangButton {
  width:10%;
  height: 5%;
  font-size:100%;
  text-align: center;
  border: none;
  border-radius: 12px;
  margintop: 10px;
  marginright: 10px;
  position: absolute;
  top: 20px;
  right: 20px;
}

.playButtons{
  height:auto;
  width:auto;
  font-size:200%;
}

.format{
  background-color: rgb(18, 50, 255);
  color: white;
}

.bottom {
  margin-top: 50em;
}


#nav {
  display: flex;
  justify-content: center;
  grid-gap: 10em;
  grid-template-columns: 10em 10em 10em;
  padding: 2em;
}
.header-prop{
  background: white;
  height: 20%
}

#headertext {
  font-size: 500%;
  color: white;
  text-shadow: 10px 10px 10px black;

}
#pollID{
  position:relative;
  top:1em;
}
</style>
