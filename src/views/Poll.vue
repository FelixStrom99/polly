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

  <section class="choose-username" v-if="isChooseusername">
    <div id="choose-username-wrapper">
    <h1> {{ uiLabels.username }}</h1>
    <div>
      <input type="text" v-model="userID" placeholder="Enter username...">
    </div>
    <button v-on:click="displayWaitingroom">
      {{ uiLabels.save }}
    </button>
    </div>
  </section>

  <section class="waitingroom" v-if="isWaitingroom">
    <div id="waitingroom-wrapper">
      <h1 id="waitingroom-text">{{ uiLabels.waitingRoom }}</h1>
      <h2>{{ uiLabels.hostWait }}</h2>
      <div id="waitingroom-item">
        <h1>USERS:</h1>
        <div id="waitingroom-users" v-for="(u,i) in userList.users" v-bind:key="'user'+i" style="  color: white;font-size:20px;">
          <p>{{u}}</p>
        </div>
      </div>
      <button v-on:click="this.skipWaitingroomTemporary()">klicka här ifall du vill komma vidare ändå</button>
    </div>
  </section>

  <main>
    <section class="location-question" v-if="displayLocationQuestion && displayFollowupQuestion===false && displayAnswer===false">
      <header class="quiz-questions">
        {{LocationQuestion.lq}}
      </header>
      <p style="font-weight: bold; color: white">{{ uiLabels.pinLocation }}</p>
      <div id="map-question-wrapper">

        <div class="base-timer" id="timer-location">
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
    <div class="openlayers-map">
      <MapContainer :geojson="geojson" v-bind:key=updateZoom v-bind:correctLocation="LocationQuestion.location" v-bind:mapView="mapView" v-on:userLocation="userLocation=$event"> </MapContainer>
    </div>
    <div class="move">
      <button v-on:click="submitLocationAnswer(),switchToWaitingRoom(),meterDistance()">
        {{ uiLabels.submitLocation }}
      </button>
    </div>
  </div>

  </section>



    <section class="followup-question" v-if="displayFollowupQuestion===true && displayLocationQuestion===false && displayAnswer===false">
      <header class="quiz-questions">
        {{questions[this.index].q}}
      </header>
      <div class="base-timer" id="timer-followup">
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

  <section class="display-answer" v-if="displayAnswer===true">

    <div class="map-result" v-if="displayLocationQuestion===true">
      <header class="waiting-result-room-header">{{ uiLabels.locationResult }}</header>
      <div class="openlayers-map">
        <MapContainerPollResult :geojson="geojson" v-bind:key=updateZoom v-bind:correctLocation="LocationQuestion.location" v-bind:mapView="mapView" v-bind:userLocation="userLocation" v-bind:distance="distance" > </MapContainerPollResult>
      </div>
    </div>

      <div v-if="result === 'true' && displayFollowupQuestion===true && isSubmittedAnswer===true" >
        <header class="waiting-result-room-header"><h1 style="color: #41B853">{{ uiLabels.correctAns}}</h1></header>
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
      </div>
      <div v-if="result === 'false' && displayFollowupQuestion===true" >
        <header v-if="displayRanOutTime===true && isSubmittedAnswer===false" class="waiting-result-room-header" ><h1>{{ uiLabels.timeEnd }}</h1></header>
        <header v-if="displayRanOutTime===false  && isSubmittedAnswer===true" class="waiting-result-room-header"><h1 style="color: #F40058">{{ uiLabels.incorrectAns}} </h1></header>
        <svg class="incorrekt-marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
          <circle class="incorrekt-path-circle" fill="none" stroke="#D06079" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
          <line class="incorrekt-path-line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
          <line class="incorrekt-path-line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
        </svg>
       </div>


    <div class="waiting-result-room-info">
      <div v-if="(index+1)===questions.length">
        <p>{{uiLabels.userWait}}</p>

        <div class="lds-ripple"><div></div><div></div></div>
      </div>
      <div v-if="isQuestionNotWaitingRoom===true && (index+1) !== questions.length">
        <p>{{ uiLabels.answerWait }}</p>
        <div class="lds-ripple"><div></div><div></div></div>
      </div>
      <div v-if="isQuestionNotWaitingRoom===false">
        <div v-if="displayLocationQuestion===true">
          <p>{{ uiLabels.nextQuestion }}: {{questions[this.index].q}} {{ uiLabels.in}}{{timeLeft}}s</p>
        </div>
        <div v-if="displayLocationQuestion===false && (index+1) !== questions.length">
          <p> {{ uiLabels.nextQuestion }}: {{questions[this.index + (1)].q}} {{ uiLabels.in}} {{timeLeft}}s</p>
        </div>
      </div>
    </div>

    </section>

    <footer>
      {{ uiLabels.pollID }} {{ pollId }}
    </footer>


  </main>

</template>

<script scoped>
//  credit Mateusz Rybczonek modified by STSare
import Question from '@/components/Question.vue';
import io from 'socket.io-client';
import MapContainer from "../components/MapContainer";
import MapContainerPollResult from "../components/MapContainerPollResult";

const socket = io();
const FULL_DASH_ARRAY = 283;
var TIME_LIMIT = 10;
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
    MapContainerPollResult,
    Question,
    MapContainer
  },
  data: function () {
    return {
      lang: "",
      uiLabels: {},
      timePassed:             0,
      timerInterval:          null,
      result:                 "",
      correctans:             [],
      questions:              [],
      LocationQuestion:       {
        lq: "",
        location: {x: 0, y: 0},},
      pollId:                 "inactive poll",
      userID:                 "",
      userList:               [],
      userLocation:           {x: 0, y: 0},
      mapView:                {zoom: 0, center: [0,0]},
      updateZoom:             0,
      distance:               0,
      index:                  0,
      update:                 0,
      displayLocationQuestion:false,
      displayFollowupQuestion:false,
      isWaitingroom:          false,
      isChooseusername:       false,
      displayAnswer:          false,
      displayRanOutTime:      false,
      boolTimerStart:         false,
      isSubmittedAnswer:      false,
      isQuestionNotWaitingRoom:true,

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
    this.pollId = this.$route.params.id;
    this.lang = this.$route.params.lang;

    socket.emit("pageLoaded", {lang: this.lang, id: this.pollId});
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })

    socket.emit('joinPoll', this.pollId)
    socket.on("userMapView",d =>
        this.mapView=d
    )
    socket.on("newQuestion", q =>
        this.createQuestionArray(q),
    )
    socket.on("userUpdate",update => {
      this.userList=update;
    })
    socket.on("checkResult",result => {
      this.sendToResult(result)
    })

    socket.on("checkIfNewGame",newGame => {
      this.checkIfNewGame(newGame)
    })

    socket.on("endWaitingRoom",placeHolder => {
      console.log(placeHolder)
      this.skipWaitingroomTemporary()
    });

  },
  watch: {
    timeLeft(newValue) {
      if (newValue === 0) {
        this.onTimesUp();

      }
    }
  },
  mounted() {
    if(this.boolTimerStart === true) {
      this.startTimer();
    }
  },
  methods: {

    meterDistance() {
      var holderX1 = this.LocationQuestion.location.x
      var holderY1 =  this.LocationQuestion.location.y
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
      this.distance = Math.floor(d * 1000);

    },

    resetTimer(){
      this.displayRanOutTime=false
      this.timePassed = 0
      this.startTimer()
    },

    onTimesUp() {
      clearInterval(this.timerInterval);
      if(this.displayFollowupQuestion===true && this.isQuestionNotWaitingRoom===false){
        this.index += 1}
      if(this.isWaitingroom === false && this.isChooseusername ===false && this.isSubmittedAnswer===false){
        this.result = 'false'
        this.displayRanOutTime=true
        this.displayAnswer=true}
      this.waitingRoomTimer()
    },

    startTimer() {
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    },
    waitingRoomTimer: function(){
      if(this.isQuestionNotWaitingRoom===true){
        this.isQuestionNotWaitingRoom=false
        console.log("this.isQuestionNotWaitingRoom=false")
      }
      else if (this.isQuestionNotWaitingRoom===false) {
        this.isQuestionNotWaitingRoom=true
        console.log("this.isQuestionNotWaitingRoom=true")
      }

      if(TIME_LIMIT===10 && this.isQuestionNotWaitingRoom===false){
        this.timePassed=5
        this.startTimer()

      }
      if(TIME_LIMIT===20 && this.isQuestionNotWaitingRoom===false){
        this.timePassed=15
        this.startTimer()
      }
      if(TIME_LIMIT===40 && this.isQuestionNotWaitingRoom===false){
        this.timePassed=35
        this.startTimer()
      }
      if(TIME_LIMIT===60 && this.isQuestionNotWaitingRoom===false){
        this.timePassed=55
        this.startTimer()
      }

      if(this.isQuestionNotWaitingRoom===true){

        this.isSubmittedAnswer=false
        this.resetTimer()
        this.switchToWaitingRoom()
        this.switchQuestionType()
      }



    },


    createQuestionArray: function (Data) {
      this.index=0
      this.updateZoom+=1

      var questionArray = []
      for (let i = 0; i < Data.q.length; i++) {
        questionArray[i] = {q: (Data.q[i])[i], a: (Data.a[i])[i]}
      }
      TIME_LIMIT=Data.timer
      this.questions = questionArray
      this.LocationQuestion.lq=Data.lq
      this.LocationQuestion.location=Data.location
      this.correctans=Data.correct





    },
    checkIfNewGame: function (newGame) {
      if(newGame){
        this.displayLocationQuestion=false
        this.displayFollowupQuestion=false
        this.displayAnswer          =false
        this.isChooseusername       =true
      }
      else{
        clearInterval(this.timerInterval)
        this.displayLocationQuestion=true
        this.isChooseusername       =false
        this.displayFollowupQuestion=false
        this.displayAnswer          =false
        this.resetTimer()
      }

    },

    submitAnswer: function (answer, title) {
      this.displayRanOutTime = false
      this.switchToWaitingRoom()
      this.isSubmittedAnswer=true
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



    submitLocationAnswer: function () {
      socket.emit("submitLocationAnswer", {pollId: this.pollId, locationAnswer: this.userLocation})
    },

    switchQuestionType: function () {
      if (this.displayLocationQuestion === true && this.displayFollowupQuestion === false) {
        this.displayLocationQuestion = false
        this.displayFollowupQuestion = true
      }
    },
    displayWaitingroom: function (){
      socket.emit("addUser", {pollId: this.pollId, users: this.userID})

      this.isChooseusername = false;
      this.isWaitingroom = true;
    },
    skipWaitingroomTemporary: function() {
      this.displayLocationQuestion = true;
      this.isWaitingroom = false;
      this.boolTimerStart=true;
      this.resetTimer()
      console.log("första start")
    },
    switchToWaitingRoom: function () {
      if(this.displayAnswer===true){
        this.displayAnswer=false}
      else{
        this.displayAnswer=true}
    },
    sendToResult: function () {
      this.$router.push({ path: `/result/${this.pollId}` })
    },

  }
}

</script>

<style>

/* General CSS for Poll.vue */

/* Choose username */

footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.choose-username{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
}
.choose-username h1{
  font-size: 200%;
}



/* Waiting Room */
#waitingroom-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  min-height: 50em;
  top: -2em;
}
#waitingroom-item {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;

  background-color: #1682a8;
  opacity: 85%;
  height: 50vh;
  width: 50%;
  border-style: solid;
  border-width: 3px;
  border-color: lightgreen;
  border-radius: 10px;
  padding: 2em;
}
#waitingroom-item h1 {
  font-size: 150%;
  color: #EFA500;
}



waitingroom-users p{
  width: 32%;
  padding-bottom: 32%; /* Same as width, sets height */
  margin-bottom: 2%; /* (100-32*3)/2 */
  position: relative;
  color: white;
  font-weight: bold;
  position: relative;
}

#waitingroom-text {
  font-size: 300%;
  color: white;
  text-shadow: 5px 5px 5px black;
}

/* waiting/result room */

.waiting-result-room-header{
  color: white;
  font-weight: bold;
  font-size: 200%;
  padding-top: 100px;
}
.waiting-result-room-info{
  position: relative;
  font-size: 130%;

}
.quiz-questions{
  text-decoration-line: underline;
  font-size: 200%;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  padding: 20px;

}

#question-counter{
  position: absolute;
  left: 30px;
  top: 10px;
  font-size: 150%;
}
.incorrekt-marker {
  position: relative;
  justify-content: center;
  padding: 3em;
  width: 170px;
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
/* Location Question */

#map-question-wrapper{
  display: flex;
  flex-direction: column;
  justify-content: center;

}

.openlayers-map {
  position: relative;
  height: 30em;
  width: 100%;
}

.move{
  gap: 10px 10px;
  padding-top: 1em;
}

#timer-location{
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 100;
}


/* FollowUp Question */

#timer-followup{
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 100;
}


.poll-container{
  height: 10%;
  width: 10%;
}

.answer-alternative-size-container{
  height: 95vh;
}
/* waitingroom result */

.map-result{
  position: relative;
  top: -3em;
}

/* Timer Clock */

.base-timer {
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
/* loading icon*/
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 30px;
  height: 30px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 20px;
    left: 20px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 40px;
    height: 40px;
    opacity: 0;
  }
}
/* loading icon end*/


</style>