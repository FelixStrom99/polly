<template>
  <div>
    {{ pollId }}

    <Question v-bind:question="question"
              v-on:answer="submitAnswer"/>

    <!--<Question v-for="(soloQuestion,i) in question"
               v-bind:soloQuestion="soloQuestion"
               v-bind:key="soloQuestion.q[i]"
               v-on:answer="submitAnswer"/> -->

  </div>
{{correctans}}
  <h2> {{ LocationQuestion.lq }}</h2>

  <div id="mapcontainer">
    <div id="map" v-on:click="userSetLocation">

      <LocationQuestion v-bind:LocationQuestion="LocationQuestion"/>
      <div id="dots" v-bind:style="{left: UserLocation.x + 'px', top: UserLocation.y + 'px'}">
        T
      </div>
    </div>
  </div>
  {{ UserLocation }}
  <button v-on:click="submitLocationAnswer(),checkDistance()">
    submit answer
  </button>
  distans: {{ distance }}

  {{ LocationQuestion.location }}

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
      correctans: "",
      question: {
        q: [],
        a: [],
        correct: [],

      },
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
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId)
    socket.on("newQuestion", q =>
            this.question=this.LocationQuestion = q,

    )


    /*  socket.on("newLocationQuestion", l =>

              this.LocationQuestion=l,
          console.log("test2",this.LocationQuestion)

      )*/

  },
  methods: {
    createQuestionArray: function (){
      var questionArray=[]
      for (let i = 0; i < this.question.q.length; i++) {
        questionArray[i]={q:this.question.q[i],a:5}

      }
      console.log("test",questionArray)
    },
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
      this.createQuestionArray()
      if (this.question.correct[this.question.a.indexOf(answer)] === true) {
        this.correctans = "true"
      } else {
        this.correctans = "false"
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
      var holderX1 = this.LocationQuestion.location.x // holder is used to remove the undefined elements .x and .y for some reason
      var holderY1 = this.LocationQuestion.location.y
      var x2 = this.UserLocation.x
      var y2 = this.UserLocation.y
      var distanceSquared = Math.pow(holderX1 - x2, 2) + Math.pow(holderY1 - y2, 2)
      this.distance = Math.sqrt(distanceSquared)
    },
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

#dots {
  position: absolute;
  background: #f10808;
  color: #f10808;
  border-radius: 15px;
  width: 10px;
  height: 10px;
  text-align: center;
}


</style>