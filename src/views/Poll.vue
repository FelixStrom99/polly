<template>

  <section v-if="displayLocationQuestion===true && displayFollowupQuestion===false" class="poll-container">
    <header class="quiz-questions">
      {{LocationQuestion.lq}}
    </header>
    <div id="mapcontainer">
      <div id="map" v-on:click="userSetLocation">
        <LocationQuestion v-bind:LocationQuestion="LocationQuestion"/>
        <div id="dots" v-bind:style="{left: UserLocation.x + 'px', top: UserLocation.y + 'px'}">
          T
        </div>
      </div>
    </div>
    <button v-on:click="submitLocationAnswer(),checkDistance(),switchQuestionType()">
      Submit answer
    </button>


    Distans: {{ distance }}
    {{ LocationQuestion.location }}
    {{ result }}
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
import LocationQuestion from "../components/LocationQuestion";

const socket = io();

export default {
  name: 'Poll',
  components: {
    Question,
    LocationQuestion
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
        image: "",
      },
      pollId: "inactive poll",
      UserLocation:
          {x: 0, y: 0},
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
    checkDistance: function () {
      var holderX1 = this.LocationQuestion.location.x
      var holderY1 = this.LocationQuestion.location.y
      var x2 = this.UserLocation.x
      var y2 = this.UserLocation.y
      var distanceSquared = Math.pow(holderX1 - x2, 2) + Math.pow(holderY1 - y2, 2)
      this.distance = Math.sqrt(distanceSquared)
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
#mapcontainer {
  width: 800px;
  height: 450px;
  overflow: scroll;
  margin-bottom: 20px;
  border: groove
}

#map {
  background-repeat: no-repeat;
  cursor: crosshair;
  position: relative;

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
.quiz-questions{
  font-size: 200%;
  text-transform: uppercase;
}





</style>