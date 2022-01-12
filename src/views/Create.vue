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
  <section v-if="firstStage===true && secondStage===true">
    <div id="wrapper-pollID-header">
      <h1 id="enter-pollID-header">{{ uiLabels.createPoll }}</h1>
      <div style="margin-top:10%">
        <h1> {{uiLabels.enterTitleHead}}</h1>
        <input type="text" v-model="pollId" id="createPollInput" v-bind:placeholder=uiLabels.enterTitle autocomplete="off">
        <p v-if="pollIdErrorMessage===true" style="color: #c01313"> {{ uiLabels.noInput }} </p>
      </div>
      <button v-on:click="createPoll" class="playButtons">
        {{ uiLabels.save}}
      </button>
    </div>
  </section>
  <section class="theme  ChooseMap" v-else-if="firstStage===false && secondStage===true" style="position: relative; bottom: 1em">
    <div>
      <h1>{{ uiLabels.chooseLocation }}</h1>
    </div>
    <div class="maps">
      <div class="map-item" id="background_pic_uppsala" v-on:click="nextSection();chooseUppsala()"
           style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Uppsala</h1>
        </figure>
      </div>
      <div class="map-item"
           id="background_pic_stockholm"
           v-on:click="nextSection();chooseStockholm();">
        <figure>
          <h1 class="city_name_charachter_spec">Stockholm</h1>
        </figure>
      </div>
      <div class="map-item" id="background_pic_sundsvall" v-on:click="nextSection();chooseSundsvall();">
        <figure>
          <h1 class="city_name_charachter_spec">Sundsvall</h1>
        </figure>
      </div>

      <div class="map-item" id="background_pic_västerås" v-on:click="nextSection();chooseVästerås()">
        <figure>
          <h1 class="city_name_charachter_spec">Västerås</h1>
        </figure>
      </div>

      <div class="map-item" id="background_pic_göteborg" v-on:click="nextSection();chooseGöteborg()">
        <figure>
          <h1 class="city_name_charachter_spec">Göteborg</h1>
        </figure>
      </div>

      <div class="map-item" id="background_pic_world" v-on:click="nextSection();chooseWorld()">
        <figure>
          <h1 class="city_name_charachter_spec">{{uiLabels.chooseFree}}</h1>
        </figure>
      </div>
    </div>
    <div style="position: relative; bottom: 1em" v-if="firstStage!=true">
      <p>{{ uiLabels.pollID }}: <span style="color: #43BEE5" >{{ pollId }}</span> </p>
    </div>

  </section>


  <section class="create-the-questions-container theme" v-else-if="secondStage===false && firstStage===false">
    <div class="create overview-left-side">
      <h1>{{uiLabels.overView}}</h1>
      <span>{{ uiLabels.expand }}: </span>
      <div class="question-boxes" v-for="(_,i) in questionSequence" v-bind:key="'boxes'+i">
        <div type="button" class="collapsible" v-on:click="expandAndCollapseBox(i);removeResponse()">
          <div v-if="questionSequence[i][3] == ''">{{this.uiLabels.newQuestion}}</div>
          <div v-else>{{questionSequence[i][3]}}</div>
        </div>
        <div class="content">
          <div class="content-mq" v-for="(_,j) in questionSequence[i][0]" v-bind:key="'answers'+j">
            <button class="content-mq-button" v-on:click="showMultipleQuestion(j)">
              <div v-if="questionSequence[i][0][j][j] == ''">{{ uiLabels.question + " " +(j + 1) }}</div>
              <div v-else>{{questionSequence[i][0][j][j]}}</div>
            </button>
          </div>
          <button v-on:click="addNewMultipleQuestion(i,j); removeResponse()">{{uiLabels.addQuestion}}</button>
          <button v-on:click="deleteMultipleQuestion">{{uiLabels.deleteQuestion}}</button>
        </div>
      </div>
      <div>
        <span>
          <div id="locationQuestion-button1" v-on:click="addNewPollQuestion" style="cursor: pointer;">
            <object data="/svg_files/addLocationQuestionButton-2/addLocationQuestionButton.svg"
                style="pointer-events:none;">
            </object>
          </div>
        </span>
        <span>
          <div id="locationQuestion-button2"  v-on:click="deleteLocationQuestion" style="cursor: pointer;">
            <object data="/svg_files/addLocationQuestionButton-3/addLocationQuestionButton.svg"
              style="pointer-events:none;">
            </object>
          </div>
        </span>
      </div>
    </div>
    <div class="create lq-and-q">
      <div class="location-question" v-if="createLocationQuestion">
        <h1>{{ uiLabels.create }} {{uiLabels.locationQuestion}} {{this.currentLQ+1}}</h1>
        <div>
          <input class="participateInput" style="width: 40%" type="text" v-bind:placeholder=uiLabels.enterLocationQuestion v-model="locationQuestion" autocomplete="off">
        </div>
        <h3>{{uiLabels.createInfo}}</h3>
        <div id="openlayers-map">
          <MapContainerCreate :geojson="geojson"
                              v-on:location="location=$event" v-bind:mapView="mapView" v-bind:location="savedLocation"  id="mapLq-and-q">
          </MapContainerCreate>
        </div>
        <div>
        <span>
        <button v-on:click="editQuestion(this.currentLQ, null); getResponseButton()" class="playButtons">{{ uiLabels.saveLocation }}</button>
        </span>
        <span>
          <p v-if="showResponseButton===true" class="hideMe">{{ uiLabels.locationSaved }}</p>
        </span>
        <div style="bottom: 0" v-if="firstStage!=true">
          <p>{{ uiLabels.pollID }}: <span style="color: #43BEE5" >{{ pollId }}</span> </p>
        </div>
        </div>
      </div>

      <div class="create theme" v-if="createMultipleChoiceQuestion">
        <h1>{{ uiLabels.create }} {{uiLabels.followUpQuestion}} {{this.currentMQ+1}}</h1>
        <input class="participateInput" style="width: 40%" type="text" v-bind:placeholder=uiLabels.enterFollowUp v-model="question">
        <div class="question-multiple">
          <div class="Answer-box-wrapper">
            <div class="answer-alternative-size-wrapper" v-for="(_, i) in answers" v-bind:key="'answers'+i">
              <div id="Answer-Box-symbol-prop"
                   :style="checkBox[i] ? { 'background-color': '#41B853' } : null">
              </div>
              <div class="Answer-Box-textarea">
                <input class="Answer-Box-textarea-prop"
                       v-model="answers[i]" v-bind:placeholder="'Alternative '+(i+1)">
              </div>
              <div class="Answer-Box-checkbox">
                <input type="checkbox"
                       class="Answer-Box-checkbox-prop
                            animation_rubberband"
                       v-model="checkBox[i]"
                       v-bind:key="'checkBox'+i">
              </div>
            </div>
          </div>
        </div>
        <div id="alternative-questions-wrapper">
          <button class="playButtons add-alt" v-on:click="addAnswer">
            {{ uiLabels.addAnswer }}
          </button>
          <button class="playButtons delete-alt" v-on:click="deleteAnswer">
            {{ uiLabels.deleteAnswer }}
          </button>
          <span>
            <button class="playButtons save-button-create"
                    v-on:click="editQuestion(this.currentLQ, currentMQ); getResponseButton() ">{{ uiLabels.save }}</button>

            <span v-if="showResponseButton===true" class="hideMe">Your location is saved!</span>
            </span>
        </div>
        <div style="position: relative; top: 6em" v-if="firstStage!=true">
          <p>{{ uiLabels.pollID }}: <span style="color: #43BEE5" >{{ pollId }}</span> </p>
        </div>
      </div>
    </div>
    <div class=" create alternative-right-side">
      <div>
        <h2>{{uiLabels.settings}}</h2>
        <h3>{{ uiLabels.timerSettings }}</h3>
        <span id="margin-down">{{ uiLabels.questionRunTime }}:</span>
        <select v-model="timer">
          <option disabled value="">{{uiLabels.pleaseSelect}}</option>
          <option value="10">10 {{uiLabels.seconds}}</option>
          <option value="20">20 {{uiLabels.seconds}}</option>
          <option value="40">40 {{uiLabels.seconds}}</option>
          <option value="60">60 {{uiLabels.seconds}}</option>
        </select>
          <div id="finish-button-div">
        <button class="finish-quiz-button" v-on:click="finishQuizFinal">
          {{ uiLabels.finishQuiz }}
        </button>
        </div>
      </div>
    </div>
  </section>


  <section class="host-view" v-if="secondStage===false && firstStage===true">
    <h1>{{uiLabels.hostView}}</h1>

    <div class="playing-info">
      <div class="playing-info-items">
    <p v-if="isUserInGame===true">{{uiLabels.hostTimeLeft}}</p>
    <p v-if="isUserInGame===false">{{uiLabels.hostGameNot}}</p>

    <div v-if="gameStarted===false" class="base-timer" id="timer-location">

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
    </div>

</div>

    <p>{{uiLabels.pollID}}: <span style="color: #43BEE5" >{{ pollId }}</span></p>



  <div id="host-view-buttons">
    <div v-if="gameStarted===true">
      <button class="hostButtons" v-on:click="startGame">{{ uiLabels.startGame }}</button>
      <button class="hostbuttons" v-on:click="goBackEdit">Go back to editing</button>
    </div>
    <div v-else-if="gameStarted===false">
      <button class="hostButtons" v-on:click="runQuestion" v-if="questionRunning===false">{{uiLabels.runQuestion }}</button>
      <button class="hostButtons" v-on:click="checkResult()" v-else-if="questionRunning===true">{{ uiLabels.checkResult }}  </button>
    </div>

    <button class="hostButtons" v-on:click="updatePlayers">{{uiLabels.updatePlayers }}</button>
  </div>

    <div id="run-question-wrapper">
      <div class="run-question waitingroom">
        <h3>{{ uiLabels.playersConnected }}</h3>
        <div id="run-question-users" v-for="(u,i) in userList.users" v-bind:key="'user'+i"
             style="  color: white;font-size:20px;">
          <p>{{ u }}</p>
        </div>
      </div>

      <!-- <div class="run-question box">
        <h3>{{ uiLabels.runQuestions }}</h3>
        <div id="run-question-item" v-for="(_,i) in questionSequence" v-bind:key="'question'+i">
          <div v-on:click="currentLQ=i; this.previewQuestion()">{{ questionSequence[i][3] }}</div>
        </div>
      </div> -->

      <div class="run-question preview">
        <h3>{{uiLabels.questionPreview}}</h3>
        <div class="preview-question">
          <p>{{uiLabels.locationQuestion}}:</p>
          {{ questionSequence[currentLQ][3] }}
          <p>{{uiLabels.followUpQuestion}}:</p>
          <div v-for="(ans,i) in questionSequence[currentLQ][0]" v-bind:key="'ans'+i">
            {{ ans[i] }}
          </div>
        </div>
        <div v-if="questionSequence.length > 1 && currentLQ+1 !== questionSequence.length">
          <p>Next question</p>
          <div class="preview-question">
            <p>{{uiLabels.locationQuestion}}:</p>
            {{ questionSequence[currentLQ+1][3] }}
            <p>{{uiLabels.followUpQuestion}}:</p>
            <div v-for="(ans,i) in questionSequence[currentLQ+1][0]" v-bind:key="'ans'+i">
              {{ ans[i] }}
            </div>
          </div>
        </div>
      </div>

    </div>

  </section>

</template>

<script>
import io from 'socket.io-client';
import MapContainerCreate from "../components/MapContainerCreate";

const socket = io();
const FULL_DASH_ARRAY = 283;
var TIME_LIMIT = 0;
const WARNING_THRESHOLD = TIME_LIMIT/2;
const ALERT_THRESHOLD = TIME_LIMIT/4;
console.log("hej")


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
  name: 'Create',
  components: {
    MapContainerCreate,
  },
  data: function () {
    return {

      showResponseButton: false,
      lang: "",
      pollId: "",
      pollIdErrorMessage:false,
      title: "",
      question: [""],
      answers: ["", ""],
      finalAnswers: [],
      checkBox: [false, false],
      locationQuestion: "",
      location: {
        x: 0,
        y: 0,
      },
      savedLocation: {
        x: null,
        y: null
      },
      createLocationQuestion: true,
      createMultipleChoiceQuestion: false,
      data: {},
      uiLabels: {},
      range_from_location: "",
      firstStage: true,
      secondStage: true,
      currentLQ: 0,
      currentMQ: 0,
      indexArray: [],
      pollQuestionIndex: 0,
      multipleChoiceQuestions: [],
      finalQuestion: [],
      finalCorrect: [],
      mapView: {
        zoom: 0,
        center: [0, 0]
      },
      questionSequence: [],
      userList: [],
      isPreviewQuestion: false,
      gameStarted:true,
      questionRunning:true,
      timer:10,
      timePassed:             0,
      timerInterval:          null,
      displayRanOutTime:      false,
      boolTimerStart:         false,
      isQuestionNotWaitingRoom:true,
      isUserInGame            :false,
    }
  },
  /*mounted() {
    socket.on("userUpdate",(user) =>{
      console.log("snälla",user)
    } )

  },*/
  computed: {
    circleDasharray() {
      return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
    },

    formattedTimeLeft() {
      const timeLeft = this.timeLeft;
      let seconds = timeLeft;
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      return `${seconds}`;
    },

    timeLeft() {
      console.log(TIME_LIMIT - this.timePassed)
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
  watch: {
    timeLeft (newValue) {
      if (newValue === 0) {
        this.onTimesUp();


      }
    }
  },
  mounted() {
    if(this.boolTimerStart === true) {
      this.startTimer(); /* start timer first time */
    }
  },

  created: function () {
    this.lang = this.$route.params.lang;
    this.addNewPollQuestion()
    socket.emit("pageLoaded", {lang: this.lang, id: this.pollId});
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) =>
        this.data = data
    )
    socket.on("pollCreated", (data) =>
        this.data = data)
    socket.on("brakrök", (user) => {
      this.userList = user
    })
  },

  methods: {
      getResponseButton: function() {
        this.showResponseButton = true
      },
    removeResponse:function (){
      this.showResponseButton = false
    },

    createPoll: function () {
      if (this.pollId !== ""){
        socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      this.firstStage = false
    }
      else {
        this.pollIdErrorMessage=true
      }
    },
    showQuestion: function (firstIndex, secondIndex) {
      if (secondIndex !== null) {
        var title = this.questionSequence[firstIndex][0][secondIndex][secondIndex]
        var answers = this.questionSequence[firstIndex][1][secondIndex][secondIndex]
        var correct = this.questionSequence[firstIndex][2][secondIndex][secondIndex]
        this.answers = answers
        this.question = title
        this.checkBox = correct
      } else {
        this.locationQuestion = this.questionSequence[firstIndex][3]
        this.location.x = this.questionSequence[firstIndex][4].x
        this.location.y = this.questionSequence[firstIndex][4].y
      }
    },
    editQuestion: function (firstIndex, secondIndex) {
      if (secondIndex !== null) {
        this.questionSequence[firstIndex][0][secondIndex][secondIndex] = this.question
        this.questionSequence[firstIndex][1][secondIndex][secondIndex] = this.answers
        this.questionSequence[firstIndex][2][secondIndex][secondIndex] = this.checkBox
      } else {
        this.questionSequence[firstIndex][3] = this.locationQuestion
        this.questionSequence[firstIndex][4].x = this.location.x
        this.questionSequence[firstIndex][4].y = this.location.y
      }
    },

    addNewPollQuestion: function () {
      var newQuestion = []
      this.indexArray.push([0])
      this.finalQuestion.push([])
      this.finalAnswers.push([])
      this.finalCorrect.push([])
      newQuestion.push(this.finalQuestion[this.pollQuestionIndex])
      newQuestion.push(this.finalAnswers[this.pollQuestionIndex])
      newQuestion.push(this.finalCorrect[this.pollQuestionIndex])
      newQuestion.push(this.locationQuestion = "")
      newQuestion.push(this.location = {
        x: 0,
        y: 0

      })
      this.questionSequence.push(newQuestion)
      this.pollQuestionIndex += 1
      this.currentLQ = (this.questionSequence.length - 1)
      this.savedLocation= {
        x: null,
        y: null
      }
      if(this.questionSequence.length > 1) {
        this.showLocationQuestion()
      }
    },
    nextSection: function () {
      console.log(this.showResponseButton)
      this.secondStage = false
    },
    goBackEdit: function () {
      this.firstStage = false
      this.secondStage = false
    },
    finishQuizFinal: function () {
      /*for (var j = 0; j <= this.questionSequence.length; j++) {
        if (this.questionSequence[j][4].x == 0 && this.questionSequence[j][4].y == 0){
          alert(this.questionSequence[j][3]+" doesn't have a location clicked ")
          return
        }
      }*/
      this.firstStage = true
      this.currentLQ = 0
        for (var i = 0; i <= this.questionSequence.length; i++) {
          socket.emit("addQuestion", {
            pollId: this.pollId,
            q: this.questionSequence[i][0],
            a: this.questionSequence[i][1],
            correct: this.questionSequence[i][2],
            lq: this.questionSequence[i][3],
            location: this.questionSequence[i][4],
            timer: this.timer
          })
        }
    },


    addNewMultipleQuestion: function () {
      var index = this.indexArray[this.currentLQ]
      var newAnswer = {[index]: ["", ""]}
      this.finalAnswers[this.currentLQ].push(newAnswer)
      var newQuestion = {[index]: ""}
      this.finalQuestion[this.currentLQ].push(newQuestion)
      var newCorrect = {[index]: [false, false]}
      this.finalCorrect[this.currentLQ].push(newCorrect)
      this.indexArray[this.currentLQ][0] += 1
      this.fixMaxHeightCollapse()
      this.showMultipleQuestion(this.questionSequence[this.currentLQ][0].length - 1)
    },


    addAnswer: function () {
      if (this.answers.length <= 3) {
        this.answers.push("");
        this.checkBox.push(false);

      }
    },
    deleteAnswer: function () {
      if (this.answers.length >= 3) {
        this.answers.pop();
        this.checkBox.pop();
      }
    },
    deleteMultipleQuestion: function () {
      this.finalAnswers[this.currentLQ].pop();
      this.finalQuestion[this.currentLQ].pop()
      this.finalCorrect[this.currentLQ].pop()
      if (this.indexArray[this.currentLQ][0] > 0) {
        this.indexArray[this.currentLQ][0] -= 1
      }
    },
    deleteLocationQuestion: function () {
      if (this.pollQuestionIndex > 1) {
        this.pollQuestionIndex -= 1
        this.questionSequence.pop()
        this.finalAnswers.pop();
        this.finalQuestion.pop()
        this.finalCorrect.pop()
        this.indexArray.pop()
        this.currentLQ = (this.questionSequence.length - 1)
        this.savedLocation = this.questionSequence[this.currentLQ][4]
        this.showLocationQuestion()

      }
    },
    showLocationQuestion: function () {
      this.createLocationQuestion = true;
      this.createMultipleChoiceQuestion = false;
      this.showQuestion(this.currentLQ, null)


    },
    showMultipleQuestion: function (j) {
      this.currentMQ = j
      this.createLocationQuestion = false;
      this.createMultipleChoiceQuestion = true;
      this.showQuestion(this.currentLQ, this.currentMQ)

    },
    expandAndCollapseBox: function (imp) {
      this.currentLQ = imp
      this.showLocationQuestion()
      var coll = document.getElementsByClassName("collapsible");
      var content
      var j
      for (j = 0; j < coll.length; j++) {
        content = coll[j].nextElementSibling;
        if (j != this.currentLQ) {
          content.style.maxHeight = null;
          coll[j].classList.remove("active");
        }
      }
      coll[imp].classList.toggle("active");
      content = coll[imp].nextElementSibling;
      if (content.style.maxHeight && !this.currentLQ) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + 40 + "px";
      }

      this.savedLocation = this.questionSequence[this.currentLQ][4]
    },
    previewQuestion: function () {
      this.isPreviewQuestion = true;

    },
    fixMaxHeightCollapse: function () {
      var coll = document.getElementsByClassName("collapsible");
      var content = coll[this.currentLQ].nextElementSibling
      content.style.maxHeight = content.scrollHeight + 40 + "px";
    },

    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.currentLQ,lang:this.lang})
      this.boolTimerStart=true;
      this.isUserInGame = true;
      clearInterval(this.timerInterval);
      this.startTimer()
      this.questionRunning=true


    },

    chooseUppsala: function () {
      this.mapView.zoom = 12;
      this.mapView.center = [1962913.40, 8368442.93]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})
    },
    chooseStockholm: function () {
      this.mapView.zoom = 12;
      this.mapView.center = [2011404.65, 8250860.71]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})
    },
    chooseSundsvall: function () {
      this.mapView.zoom = 12;
      this.mapView.center = [1926648.80, 8952507.82]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})
    },
    chooseVästerås: function () {
      this.mapView.zoom = 12;
      this.mapView.center = [1841990.10, 8314049.85]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})
    },
    chooseGöteborg: function () {
      this.mapView.zoom = 12;
      this.mapView.center = [1332333.15, 7906034.63]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})
    },
    chooseWorld: function () {
      this.mapView.zoom = 0;
      this.mapView.center = [0, 0]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})
    },


    updatePlayers: function () {
      socket.emit('test', {pollId: this.pollId})
    },
    startGame: function () {
      socket.emit('startGame', {pollId: this.pollId})
      TIME_LIMIT=this.timer*(this.finalQuestion[this.currentLQ].length +1) + 5*this.finalQuestion[this.currentLQ].length
      this.boolTimerStart=true;
      this.gameStarted=false;
      this.isUserInGame=true;
      this.startTimer();

    },
    checkResult: function () {
      socket.emit('sendToResult', {pollId: this.pollId})
      clearInterval(this.timerInterval);
      this.questionRunning=false
      this.currentLQ += 1;
      this.previewQuestion()
    },

    onTimesUp() {
        console.log("ska stannaaaaa")
      this.isUserInGame=false;
      clearInterval(this.timerInterval);

    },

    startTimer() {
      this.timePassed=0;
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    },

  }

}

</script>
<style>
/* Put everything in alphabetical order */

/* General for create*/

/* Section PollID */
#enter-pollID-header {
  font-size: 500%;
  color: white;
  margin-bottom: 1em;
}

/* Section Choose map */


/* Section Create quiz */
.create {
  height: 99vh;
}

.create-the-questions-container {
  display: flex;
  height: 100%;
  width: 100%;
}

/* Section Create quiz // Left Bar */
.overview-left-side {
  background-color: #2d3572;
  border: 0.3em solid #EFA500;
  flex-basis: 15%;
  justify-content: space-evenly;
  overflow: scroll;
}

/* Section Create quiz // Middle */
.lq-and-q {
  justify-content: space-evenly;
  flex-basis: 70%;
  clear: both;
}

#alternative-questions-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap:2%;
  position: relative;
  width: 80%;
  top: 7em;
  margin-left: 10%;
  margin-right: 10%;
}

.add-alt delete-alt {
  width: 60%;
  justify-content: space-evenly;
}

.add-alt {
  border-color: #41B853;
  font-size: 150%
}
.add-alt:hover {
  background-color: #41B853;
}
.delete-alt{
  border-color: #F40058;
  font-size: 150%
}
.delete-alt:hover{
  background-color: #F40058;
}
.save-button-create {
  font-size: xx-large;
}
/* Section Create quiz // Right Bar */
.finish-quiz-button {
  background-color: #EFA500;
  font-size: larger;
  color: white;
  font-weight: bolder;
  position: relative;
  height:18vh;
}
.finish-quiz-button:hover {
  background-color: #ffc544;
}
#finish-button-div{
  position:relative;
  width:100%;
  height:25vh;
  margin-top:58vh;
}

/* Section Host View */
#fixedwalla{
  position:fixed;
  top:1vh;
  right:1vm;
}

.hideMe {
   animation: removeResponse  5s forwards;
   animation-fill-mode: forwards;
 }
@keyframes removeResponse {
  to {
    width:0;
    height:0;
    overflow:hidden;
  }
}

.Answer-Box-textarea-prop {

  width: 100%;
  height: 97%;
  margin-left: 2%;
  float: left;
  font-size: 18px;
  font-family: sans-serif;
  font-weight: 600;
  outline: none;
  border: none;
  padding: 0;

}

.Answer-Box-checkbox-prop{
  transform: scale(2);
  border-radius: 5px;
  position: absolute;
  top: 50%;
  text-align: center;
  right: 25%;
}


.alternative-right-side {
  background-color: #2d3572;
  border: 0.3em solid #EFA500;
  justify-content: space-evenly;
  flex-basis: 15%;
}

.animation_rubberband {
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation: rubberBand 2s infinite;
}

.animation_rubberband:hover {
  animation: 0;
}

#locationQuestion-button1 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  float: left;
  margin-left: 24%;
  margin-right: 2%;
}
#locationQuestion-button1:hover {
  background-color: #EFA500;
}
#locationQuestion-button2 {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  float: left;
}
#locationQuestion-button2:hover {
  background-color: #EFA500;
}


@keyframes rubberBand {
  0% {
    transform: scale3d(2, 2, 2);
  }
  15% {
    transform: scale3d(2.15, 1.85, 2);
  }
  30% {
    transform: scale3d(1.85, 2.15, 2);
  }
  45% {
    transform: scale3d(2.15, 1.85, 2);
  }
  65% {
    transform: scale3d(2.05, 1.95, 2);
  }
  100% {
    transform: scale3d(2, 2, 2);
  }


}


.Answer-box-wrapper {
  padding-top: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px 40px;

  height: 40vh;
}

.collapsible {
  background-color: #43BEE5;
  color: #444;
  text-align: center;
  cursor: pointer;
  padding: 18px;
  border-width: thin;
  border-radius: 10px;
  border-color: #444444;
  overflow: hidden;
  text-align: left;
  outline: none;
  font-size: 15px;
}

.active, .collapsible:hover {
  background-color: #7fc5de;
}

.content {
  margin-right: 2%;
  margin-left: 2%;
  margin-bottom: 2%;
  border-radius: 0 0 10% 10%;
  background-color: white;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.header-create-prop {
  height: 10vh;
}

.lowerside {
  display: block;
}

.disable {
  pointer-events: none;
}

.disable {
  pointer-events: none;
}

#createPollInput{
  font-size: 18px;
  font-weight: bold;
  height: 30px;
  width: 20%;
  margin-bottom: 40px;
  text-align: center;
}
.city_name_charachter_spec {
  font-family: sans-serif;
  text-align: center;
  font-weight: bold;
  text-shadow: 0 0 4px black;
}

.textbox {
  font-size: large;
  font-weight: bold;
  padding: 1.25rem;
  margin: 5px;
  background: #ffffff;
  opacity: 0.9;
  outline: black;
  border: 2px;
  border-radius: 15px;
  transition: border-color .5s;
}

textbox:hover {

}

.answer-alternative-size-wrapper {
  display: flex;
  justify-content: space-evenly;
  align-content: center;
  wrap: flex;
  border: solid 2px;
  border-color: rgba(82, 77, 77, 0.55);
  background-color: white;
  height: 60%;
  width: 35%;
  min-width: 35%;
  border-radius: 10px;
  color: #444;


}

#Answer-Box-symbol-prop {
  column-width: 40px;
  background-color: #F40058;
  border-radius: 7px 0px 0px 7px;
  height: 100%;
  width: 20%;
}

.Answer-Box-textarea {
  border-left: solid 2px;
  border-color: rgba(82, 77, 77, 0.55);
  column-width: auto;
  grid-column: 2;
  width: 93%;

}

.Answer-Box-checkbox {
  border-left: solid 2px ;
  border-color: rgba(82, 77, 77, 0.55);
  column-width: 50px;
  height: 100%;
  position: relative;
  grid-column: 3 ;
}


.maps {

  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 5px;
  grid-gap: 10px;
  background: none;
  outline: none;
  border-radius: 5px;
  padding: 10px;

}

.map-item {

  border: 1px solid rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 20px;
  font-size: 2vw;
  width: 25vw;
  height: 18vw;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.map-item:hover{
  opacity: 0.8;
  cursor: pointer;

}
#margin-down{
  margin-bottom:1vh;
}

#background_pic_uppsala {
  background-image: url('/img/uppsalaBild.jpeg');
  background-size: cover;
  background-position: center;
}

#background_pic_stockholm {
  background-image: url('/img/stockholmBild.jpeg');
  background-size: cover;
  background-position: center;
}

#background_pic_sundsvall {
  background-image:url('/img/sundsvallBild.jpeg');
  background-size: cover;
  background-position: center;
}

#background_pic_västerås {
  background-image: url('/img/västeråsBild.jpeg');
  background-size: cover;
  background-position: center;
}

#background_pic_göteborg {
  background-image: url('/img/göteborgBild.jpeg');
  background-size: cover;
  background-position: center;

}

#background_pic_world {
  background-image: url('/img/worldBild.jpeg');
  background-size: cover;
  background-position: center;
}
#mapLq-and-q{
  margin-top: 1%;
  border-radius: 6px;
}


#openlayers-map {
  display: flex;
  border-radius: 6px;
  justify-content: center;
  position: relative;
  height: 25rem;
  width: 100%;

}

#map div {
  position: absolute;
}

#slider {
  height: 8px;
  outline: none
}

#selector {
  height: 104px;
  width: 50px;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;

}

#selectbutton {
  height: 48px;
  width: 48px;
  border-radius: 50%;
  position: absolute;
  bottom: 0px;
  background: black;
  color: white;
  border-radius: 10px;
  width: 20px;
  height: 20px;
  text-align: center;

}
.host-view h1{
  font-size: 250%;
}

#host-view-buttons{
  display: flex;
  position: relative;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
}
.hostButtons{
  flex-shrink: 2;
  color: white;
  font-weight: bold;
  background-color: transparent;
  height:auto;
  width:auto;
  font-size:xx-large;
}


#run-question-wrapper {
  display: flex;
  justify-content: center;
  min-height: 10em;
  height: auto;
  gap: 5%;
}

.run-question {
  background-color: #2d3572;
  height: 60vh;
  border-style: solid;
  border-width: thick;
  border-color:  #EFA500;
  border-radius: 10px;
  padding: 2em;
  min-width: 15%;
}

.run-question box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-width: 10%;

}

#run-question-item {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  margin-top: 1em;
  width: 100%;
  border: solid 0.1em;
  border-radius: 1em;
  background-color: transparent;
  border-color: #EFA500;

}

.run-question waitingroom {
  min-width: 10%;
  margin-left: 5%;
}

.run-question preview{
  min-width: 10%;
  margin-right: 5%;
}


.preview-question {
  background-color: #EFA500;
  color: white;
  min-height: 10em;
  border-radius: 7px;
}


#run-question-item:hover, selected {
  cursor: pointer;
  background-color: #EFA500;
}
.question-boxes{
  margin-top:1vh;
}

/*background-color: rgba(34, 76, 182, 0.58);
color: #fcf8f8;
text-align: center;
cursor: pointer;
padding: 18px;
border-width:thin;
border-color: #444444;
overflow: hidden;
border-radius: 10%;
text-align: left;
outline: none;
font-size: 15px;*/


.routerLink {
  text-decoration: none;
}
/* Timer Clock */

.playing-info{
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: 1vw;
  top: 2vw;



}
.playing-info-items{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: left;
}

.base-timer {
  position: relative;
  left: 4.5vw;
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

@keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
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