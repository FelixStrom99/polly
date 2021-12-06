<template>
  <main class="theme">

  <header>
    <div class="container"><br>
      <h1 id="headertext">MapQuiz</h1>
      <p>Welcome!</p>
      <button id="LangButton" style  v-on:click="switchLanguage">
        <img src="https://www.pngitem.com/pimgs/m/31-311934_transparent-languages-clipart-language-icon-svg-hd-png.png" style="width:1em" >
        {{uiLabels.changeLanguage}}</button>
    </div>
  </header>

  <section>
    <section>

      <div id="nav">
        <div>
          <div v-if="play">
            <button>
              <router-link class="routerLink" v-bind:to="'/poll/'+id" tag="button">{{ uiLabels.participatePoll }}</router-link>
            </button>
            <label>
              Write poll id:
              <input type="text" v-model="id">
            </label>
          </div>
          <div v-else>
            <button id="test1" v-on:click="showPlay">Play</button>
          </div>
        </div>



        <button>
          <router-link class="routerLink" v-bind:to="'/create/'+lang">{{ uiLabels.createPoll }}</router-link>
        </button>

      </div>
    </section>


    <footer class="buttom">
      please do not sue us Glöggkrök incorperated
    </footer>




  </section>

  </main>
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
.routerLink {
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



.format{
  background-color: rgb(18, 50, 255);
  color: white;
}

.buttom {
  margin-top: 50em;
}

.container {
}
#nav {
  display: flex;
  justify-content: center;
  grid-gap: 10em;
  grid-template-columns: 10em 10em 10em;
  padding: 2em;
}

#headertext {
  font-size: 500%;
  color: white;

}
</style>
