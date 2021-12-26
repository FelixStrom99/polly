<template>
  <section class="choose-username" v-if="isChooseusername">
    <h1> Välj användarnamn</h1> <!-- {{ uiLabels.username }}-->
    <div>
      <input type="text" v-model="userID" placeholder="Enter username...">
      {{this.userID}}
    </div>
    <button v-on:click="switchToWaitingroom">
      Spara <!--{{ uiLabels.save }} -->
    </button>
  </section>
  <section class="waitingroom" v-if="isWaitingroom">
    <h1>This is the waiting room bruh</h1>
    <div v-for="(_,i) in userList" v-bind:key="'user'+i"><p>{{userList[i]}}</p></div>
  </section>
  <section v-if="displayLocationQuestion===true && displayFollowupQuestion===false" class="poll-container">
    <header class="quiz-questions">
      {{LocationQuestion.lq}}
    </header>


    <div id="openlayers-map">
      <MapContainer :geojson="geojson" v-bind:key=update v-bind:correctLocation="LocationQuestion.location" v-bind:mapView="mapView" v-on:userLocation="userLocation=$event"> </MapContainer>
    </div>
    <div id="move">
      {{ userLocation }}
      <button v-on:click="meterDistance()">
        CHECK DISTANCE
      </button>
      <button v-on:click="submitLocationAnswer(),switchQuestionType()">
        Submit answer
      </button>
      distans: {{ distance }}
    </div>

  </section>

  <section v-if="displayFollowupQuestion===true && displayLocationQuestion===false" class="backgroundConatiner">
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
      userID: "",
      userList: [],
      userLocation: {x: 0,
            y: 0},
      distance: 0,
      index: 0,
      displayLocationQuestion: false,
      displayFollowupQuestion:false,
      isWaitingroom: false,
      isChooseusername: true,
      mapView: {zoom: 0, center: [0,0]},
      update:0


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
    socket.on("userUpdate",d =>
        this.userList=d
    )





  },

  methods: {

    createQuestionArray: function (Data) {
      this.update+=1
      var questionArray = []
      for (let i = 0; i < Data.q.length; i++) {
        questionArray[i] = {q: (Data.q[i])[i], a: (Data.a[i])[i]}
      }
      this.questions = questionArray
      this.LocationQuestion.lq=Data.lq
      this.LocationQuestion.location=Data.location
      this.correctans=Data.correct


    },
    submitAnswer: function (answer,title) {
      this.index += 1
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
      for (let i = 0; i < this.questions.length; i++) {

        if ((this.questions[i]).q===title){
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
    },
    switchToWaitingroom: function (){
      socket.emit("addUser", {pollId: this.pollId, users: this.userID})
      this.isChooseusername = false;
      this.isWaitingroom = true;
    }


  }
}
</script>

<style>


#openlayers-map {
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


</style>