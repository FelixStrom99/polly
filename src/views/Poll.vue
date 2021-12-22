<template>

  <section v-if="displayLocationQuestion===true && displayFollowupQuestion===false" class="poll-container">
    <header class="quiz-questions">
      {{LocationQuestion.lq}}
    </header>

    <div id="map">
      <MapContainer :geojson="geojson" v-bind:correctLocation="LocationQuestion.location" v-on:userLocation="userLocation=$event"> </MapContainer>
    </div>
    <div id="move">
      {{ userLocation }}
      <button v-on:click="meterDistance()">
        CHECK DISTANCE
      </button>
      <button v-on:click="submitLocationAnswer(),">
        Submit answer
      </button>
      distans: {{ distance }}
    </div>

  </section>

  <section v-if="displayFollowupQuestion===true && displayLocationQuestion===false" class="backgroundConatiner">
    <div class="clock_prop">
      <div id="app" style="float: right"><div class="base-timer" v-if="switchQuestionType()">

        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${remainingPathColor}"
                d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
            ></path>
          </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">{{timeleft}}</span>
      </div>
      </div>
    </div>
    <header class="quiz-questions">
      {{questions[this.index].q}}
    </header>
    <div class="poll-container">

      <Question v-bind:question="questions[this.index]"
                v-on:answer="submitAnswer"/>
    </div>
  </section>

  <footer>
    Poll ID: {{ pollId }}
  </footer>


</template>

<script>
// @ is an alias to /src
import Question from '@/components/Question.vue';
import io from 'socket.io-client';
import MapContainer from "../components/MapContainer";

const socket = io();

// Credit: Mateusz Rybczonec modified by STS-ARE


const TIME_LIMIT = 40;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = TIME_LIMIT/2;
const ALERT_THRESHOLD =TIME_LIMIT/4;

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

startTimer();

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;

    document.getElementById("base-timer-label").innerHTML = formatTime(
        timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {

  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const {alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
        .getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
    document
        .getElementById("base-timer-path-remaining")
        .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
        .getElementById("base-timer-path-remaining")
        .classList.remove(info.color);
    document
        .getElementById("base-timer-path-remaining")
        .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}


function setCircleDasharray() {
  const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
}



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
      displayFollowupQuestion:false
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
      this.LocationQuestion.lq=Data.lq
      this.LocationQuestion.location=Data.location
      this.LocationQuestion.image=Data.image
      this.correctans=Data.correct


    },
    submitAnswer: function (answer,title) {
      this.index += 1
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
      for (let i = 0; i < this.questions.length; i++) {

        if ((this.questions[i]).q===title){
          console.log("babe",this.correctans[i],"körv",((this.questions[i]).a).indexOf(answer))
          if ((this.correctans[i])[i][((this.questions[i]).a).indexOf(answer)]===true){
            this.result ="true"
          }
          else{
            this.result="false"
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

    switchQuestionType:function (){
      if (this.displayLocationQuestion===true && this.displayFollowupQuestion===false){
        this.displayLocationQuestion = false
        this.displayFollowupQuestion = true
      }
}

  }
}
</script>

<style>


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
  background: #22d999;
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
  font-size: 200%;
  text-transform: uppercase;
}

.clock_prop {
  font-family: sans-serif;
  display: grid;
  height: 100vh;
  place-items: center;
}

.base-timer {
  position: relative;
  width: 150px;
  height: 150px;
}

.base-timer__svg {
  transform: scaleX(-1);
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
  color: rgb(65, 184, 131);
}

.base-timer__path-remaining.orange {
  color: orange;
}

.base-timer__path-remaining.red {
  color: red;
}

.base-timer__label {
  position: absolute;
  width: 150px;
  height: 150px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

</style>