<template>
  <main>
<<<<<<< HEAD
   {{displayLocationQuestion}}{{displayFollowupQuestion}} {{displayAnswer}}
=======
>>>>>>> f21ecde4e0020e28780bdfb694db78e5b733f801
  <section class="format" v-if="displayLocationQuestion===true && displayFollowupQuestion===false && displayAnswer===false">
    <header class="quiz-questions">
      {{LocationQuestion.lq}}
    </header>

    <div id="openlayers-map">
      <MapContainer :geojson="geojson" v-bind:key=updateZoom v-bind:correctLocation="LocationQuestion.location" v-bind:mapView="mapView" v-on:userLocation="userLocation=$event"> </MapContainer>
    </div>
    <p style="font-weight: bold; color: white">Click on the map to pinpoint the location</p>
    <p>Click on the map to pinpoint the location</p>
    <div class="base-timer">
      <svg  viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
              :stroke-dasharray="circleDasharray"
              class="base-timer__path-remaining"
              :class="remainingPathColor"
              d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
          ></path>
        </g>
      </svg>
      <span class="base-timer__label">{{ formattedTimeLeft }}</span>
    </div>
    <div id="move">
      <button  v-on:click="meterDistance()">
        CHECK DISTANCE
      </button>
      <button v-on:click="submitLocationAnswer(),switchToWaitingRoom(),meterDistance()">
        Submit answer
      </button>
      distans: {{ distance }}

    </div>

  </section>

  <section class="format" v-if="displayFollowupQuestion===true && displayLocationQuestion===false && displayAnswer===false">
    <header class="quiz-questions">
      {{questions[this.index].q}}
    </header>
    <div class="base-timer">
      <svg  viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
              :stroke-dasharray="circleDasharray"
              class="base-timer__path-remaining"
              :class="remainingPathColor"
              d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
          ></path>

        </g>
      </svg>
      <span class="base-timer__label">{{ formattedTimeLeft }}</span>
    </div>
    <div class="answer-alternative-size-container">
    <p id="question-counter">{{index + 1}} of {{questions.length}}</p>
      <Question class="poll-container" v-bind:question="questions[this.index]"
                v-on:answer="submitAnswer"/>
    </div>
  </section>


  <section class= "format" v-if="displayAnswer===true">
    <div v-if="displayLocationQuestion===true">
      <header class="waiting-room-header">This is the result after the location, inte helt färdig</header>
      <!--
      <div id="map-result">
        <MapContainer :geojson="geojson" v-bind:correctLocation="LocationQuestion.location" v-on:userLocation="userLocation=$event"> </MapContainer>
      </div>
      -->
      <p>Distans: {{distance}}</p>
    </div>

    <div v-if="result === 'true' && displayFollowupQuestion===true" >
      <header class="waiting-room-header">KORREKT! Du är typ lika smart som Adrian</header>
      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
    </div>
    <div v-if="result === 'false' && displayFollowupQuestion===true" >
      <header v-if="displayRanOutTime===false" class="waiting-room-header">INKORREKT! Men draken flyger i motvind</header>
      <header v-if="displayRanOutTime===true" class="waiting-room-header">Ran out of time!</header>
      <svg class="incorrekt-marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
        <circle class="incorrekt-path-circle" fill="none" stroke="#D06079" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
        <line class="incorrekt-path-line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
        <line class="incorrekt-path-line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
      </svg>
    </div>
    <button v-on:click="switchToWaitingRoom();switchQuestionType();resetTimer();startTimer()">NEXT</button>

  </section>

  <footer class = "format">
    Poll ID: {{ pollId }}
  </footer>
  </main>



</template>

<script>
//  credit Mateusz Rybczonek modified by STSare
import Question from '@/components/Question.vue';
import io from 'socket.io-client';
import MapContainer from "../components/MapContainer";

const socket = io();
const FULL_DASH_ARRAY = 283;
const TIME_LIMIT = 10;
const WARNING_THRESHOLD = TIME_LIMIT/2;
const ALERT_THRESHOLD = TIME_LIMIT/4;


const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};



export default {
  name: 'Poll',
  components: {
    Question,
    MapContainer
  },
  data: function () {
    return {
      timePassed: 0,
      timerInterval: null,
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
<<<<<<< HEAD
    mapView: {zoom: 0, center: [0,0]},
=======
      mapView: {zoom: 0, center: [0,0]},
>>>>>>> f21ecde4e0020e28780bdfb694db78e5b733f801
      updateZoom:0,
      displayAnswer: false,
      displayRanOutTime: false

    }

  },
  computed: {
    circleDasharray() {
      return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
    },

    formattedTimeLeft() {
      const timeLeft = this.timeLeft;

      let seconds = timeLeft % 60;

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return `${seconds}`;
    },

    timeLeft() {
      return TIME_LIMIT - this.timePassed;
    },

    timeFraction() {
      const rawTimeFraction = this.timeLeft / TIME_LIMIT;
      return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    },

    remainingPathColor() {
      const { alert, warning, info } = COLOR_CODES;

      if (this.timeLeft <= alert.threshold) {
        return alert.color;
      } else if (this.timeLeft <= warning.threshold) {
        return warning.color;
      } else {
        return info.color;
      }
    }
  },

  created: function () {
    this.pollId = this.$route.params.id

    socket.emit('joinPoll', this.pollId)
    socket.on("userMapView",d =>
        this.mapView=d
    )
    socket.on("newQuestion", q =>
        this.createQuestionArray(q),

    )


  },
  watch: {
    timeLeft(newValue) {
      if (newValue === 0) {
        this.onTimesUp();

      }
    }
  },
  mounted() {
    this.startTimer();
  },
  methods: {

    resetTimer(){
      this.displayRanOutTime=false
      this.timePassed = 0
      return this.timeLeft
    },
    pausTimer(){
      this.timeLeft = -1
    },

    onTimesUp() {
      clearInterval(this.timerInterval);
      if(this.displayFollowupQuestion===true){
      this.index += 1}
      this.result = 'false'
      this.displayRanOutTime=true
      this.displayAnswer=true

    },

    startTimer() {
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    },
    createQuestionArray: function (Data) {
      this.updateZoom+=1
      this.displayLocationQuestion=true
      this.displayFollowupQuestion=false
      this.displayAnswer=false
      var questionArray = []
      for (let i = 0; i < Data.q.length; i++) {
        questionArray[i] = {q: (Data.q[i])[i], a: (Data.a[i])[i]}
      }
      this.questions = questionArray
      this.LocationQuestion.lq=Data.lq
      this.LocationQuestion.location=Data.location
      this.correctans=Data.correct
      this.resetTimer()
      //*this.startTimer()



    },
    submitAnswer: function (answer, title) {
      this.index += 1
      this.displayRanOutTime = false
      this.switchToWaitingRoom()
      this.timePassed = TIME_LIMIT + 1
      console.log(this.timeLeft)
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
      for (let i = 0; i < this.questions.length; i++) {

        if ((this.questions[i]).q === title) {
          if ((this.correctans[i])[i][((this.questions[i]).a).indexOf(answer)] === true) {
            this.result = "true"
          } else {
            this.result = "false"
          }

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
      socket.emit("submitLocationAnswer", {pollId: this.pollId, locationAnswer: this.userLocation})
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
      if(this.displayAnswer===true){
        this.displayAnswer=false}
        else{
          this.displayAnswer=true}
        }

      }
    }

</script>

<style>

main{
}

.format{
  height: 50vh;
  background: #161B40;
  color: #444444;

}
button {
  display: inline-block;
  padding: 0.35em 1.2em;
  border: 0.1em solid #ffffff;
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.9em;
  box-sizing: border-box;
  text-decoration: none;
  font-weight: 300;
  color: #161B40;
  text-align: center;
  transition: all 0.2s;

}

button:hover{
  color:#161B40;
  background-color: #EFA500;
}


#question-counter{
  position: absolute;
  left: 30px;
  top: 10px;
  font-family: Damascus;
  font-size: 150%;
}


#openlayers-map {
  position: relative;
  height: 30em;
  width: 100%;
}
#map-result{
  position: relative;
  margin: 0;
  padding: 0;
  height: 30em;
  width: 100%;
}
.poll-container{
  height: 10%;
  width: 10%;
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
  flex-direction: row;
}

.quiz-questions{
  text-decoration-line: underline;
  font-size: 200%;
  color: white;
  font-weight: bold;
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
.clock_prop {
  font-family: sans-serif;
  display: grid;
  height: 20vh;
  position: absolute;
  right: 15px;
  top: 10px;
}
.answer-alternative-size-container{
  height: 95vh;
}

.base-timer {
  margin-right: 10%;
  float: right;
  position: relative;
  width: 100px;
  height: 100px;
}

.base-timer__circle {
  fill: none;
  stroke: none;
}

.base-timer__path-elapsed {
  stroke-width: 7px;
  stroke: rgba(89, 187, 148, 0.58);
}

.base-timer__path-remaining {
  stroke-width: 7px;
  stroke-linecap: round;
  transform: rotate(90deg);
  transform-origin: center;
  transition: 1s linear all;
  fill-rule: nonzero;
  stroke: currentColor;
}

.base-timer__path-remaining.green {
  color: #41B853;
}

.base-timer__path-remaining.orange {
  color: #EFA500;
}

.base-timer__path-remaining.red {
  color: #F40058;
}

.waiting-room-header{
  color: white;
  font-weight: bold;
  font-size: 200%;
  padding-top: 100px;
}

.base-timer__label {
  color: white;
  position: absolute;
  width: 50%;
  height: 50%;
  margin-left: 25px;
  top: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #7ac142;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}


.checkmark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  margin: 10% auto;
  box-shadow: inset 0px 0px 0px #7ac142;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes scale {
  0%, 100% {
    transform: scale3d(2.5,2.5,2.5);
  }
  50% {
    transform: scale3d(2.75, 2.75, 2.5);
  }
}
@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #7ac142;
  }
}
.incorrekt-marker {
  width: 100px;
  display: block;
  margin: 40px auto 0;
}



@-webkit-keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@-webkit-keyframes dash-check {
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
}

@keyframes dash-check {
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
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