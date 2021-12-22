<template>

  <section class="format" v-if="displayLocationQuestion===true && displayFollowupQuestion===false" >
    <header class="quiz-questions">
      {{LocationQuestion.lq}}
    </header>
    <p>Click on the map to pinpoint the location</p>

    <div id="map">
      <MapContainer :geojson="geojson" v-bind:correctLocation="LocationQuestion.location" v-on:userLocation="userLocation=$event"> </MapContainer>
    </div>
    <div id="move">
      <button v-on:click="meterDistance()">
        CHECK DISTANCE
      </button>
      <button v-on:click="submitLocationAnswer(), switchQuestionType()">
        Submit answer
      </button>
      distans: {{ distance }}
    </div>

  </section>

  <section class="format" v-if="displayFollowupQuestion===true && displayLocationQuestion===false && displayAnswer===false">
    <header class="quiz-questions">
      {{questions[this.index].q}}
    </header>
    <p id="question-counter">{{index + 1}}/{{questions.length}}</p>
      <Question class="poll-container" v-bind:question="questions[this.index]"
                v-on:answer="submitAnswer"/>
  </section>

  <section class= "format" v-if="displayAnswer===true">
    <div v-if="result === 'true'" >
      <header>KORREKT! Du är typ lika smart som Adrian</header>
      <img src="https://www.clipartmax.com/png/middle/6-61197_green-check-mark-transparent.png">
    </div>
    <div v-if="result === 'false'" >
      <header>INKORREKT! Men draken flyger i motvind</header>
    </div>
    <button v-on:click="switchToWaitingRoom">NEXT</button>
  </section>

  <footer class = "format">
    Poll ID: {{ pollId }}
  </footer>


</template>

<script>
// @ is an alias to /src
import Question from '@/components/Question.vue';
import io from 'socket.io-client';
import MapContainer from "../components/MapContainer";

const socket = io();

export default {
  name: 'Poll',
  components: {
    Question,
    MapContainer
  },
  data: function () {
    return {
      result:"",
      correctans: [],
      questions: [],
      LocationQuestion: {
        lq: "",
        location: {
          x: 0,
          y: 0
        },
      },
      pollId: "inactive poll",
      userLocation: {x: 0,
            y: 0},
      distance: 0,
      index: 0,
      displayLocationQuestion: true,
      displayFollowupQuestion:false,
      displayAnswer: false

    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId)
    socket.on("newQuestion", q =>
        this.createQuestionArray(q),

    )

  },

  methods: {
    createQuestionArray: function (Data) {
      var questionArray = []
      for (let i = 0; i < Data.q.length; i++) {
        questionArray[i] = {q: (Data.q[i])[i], a: (Data.a[i])[i]}
      }
      this.questions = questionArray
      this.LocationQuestion.lq = Data.lq
      this.LocationQuestion.location = Data.location
      this.LocationQuestion.image = Data.image
      this.correctans = Data.correct


    },
    submitAnswer: function (answer, title) {
      this.index += 1
      console.log("Här kommer svaret", answer)
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
      for (let i = 0; i < this.questions.length; i++) {

        if ((this.questions[i]).q === title) {
          console.log("babe", this.correctans[i], "körv", ((this.questions[i]).a).indexOf(answer))
          if ((this.correctans[i])[i][((this.questions[i]).a).indexOf(answer)] === true) {
            this.result = "true"
          } else {
            this.result = "false"
          }
          if(this.displayAnswer===false){
            this.displayAnswer=true}
          else{
            this.displayAnswer=false}
        }
      }
    },

    userSetLocation: function (event) {
      var offset = {
        x: event.currentTarget.getBoundingClientRect().left,
        y: event.currentTarget.getBoundingClientRect().top
      }

      this.UserLocation = {
        x: event.clientX - 10 - offset.x,
        y: event.clientY - 10 - offset.y
      }
    },
    submitLocationAnswer: function () {
      socket.emit("submitLocationAnswer", {pollId: this.pollId, locationAnswer: this.UserLocation})
    },

    meterDistance() {
      var holderX1 = this.LocationQuestion.location.x
      var holderY1 = this.LocationQuestion.location.y
      var x2 = this.userLocation.x
      var y2 = this.userLocation.y
      var R = 6378.137;
      var dLat = x2 * Math.PI / 180 - holderX1 * Math.PI / 180;
      var dLon = y2 * Math.PI / 180 - holderY1 * Math.PI / 180;
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(holderX1 * Math.PI / 180) * Math.cos(x2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      this.distance = d * 1000;
    },

    switchQuestionType: function () {
      if (this.displayLocationQuestion === true && this.displayFollowupQuestion === false) {
        this.displayLocationQuestion = false
        this.displayFollowupQuestion = true
      }
    },

    switchToWaitingRoom: function () {
      if(this.displayAnswer===false){
        this.displayAnswer=true}
        else{
          this.displayAnswer=false}
        }
      }
    }



</script>

<style>

.format{
  background: lightgrey;
  color: #444444;

}
#question-counter{
  position: absolute;
  left: 30px;
  top: 10px;
  font-family: Damascus;
  font-size: 150%;
}


#map {
  position: relative;
  margin: 0;
  padding: 0;
  height: 30em;
  width: 100%;
}
.poll-container{
  height: 100vh;
  width: 100%;
  background: lightgrey;
}

#dots {
  position: absolute;
  background: #f10808;
  color: #f10808;
  border-radius: 15px;
  width: 10px;
  height: 10px;
  text-align: center;
}

#move{
  position:relative;
  margin-top:2em;
}

.quiz-questions{
  text-decoration-line: underline;
  font-size: 200%;
  text-transform: uppercase;
  padding: 20px;

}
#move{
  text-align: center;
  display: inline-flex;
  justify-content: center;
  gap: 10px 10px;
  height: 10vh;
  width: 10vh;
}


</style>