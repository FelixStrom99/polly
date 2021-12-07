<template>
  <div>
    {{pollId}}
    <Question v-bind:question="question"
              v-on:answer="submitAnswer"/>
    {{question.correct}}
  </div>
  <div  id="map" v-on:click="userSetLocation">
    {{LocationQuestion.location}}
    <LocationQuestion id="mapItem" v-bind:LocationQuestion="LocationQuestion"  />
  </div>
  {{UserLocation}}
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
      question: {
        q: "",
        a: [],
        correct: [],
      },
      LocationQuestion:{
        lq:"",
        location: { x: 0,
          y: 0},
        image: "",
      },
      pollId: "inactive poll",
      UserLocation:
          {x:0, y:0}
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId)
    socket.on("newQuestion", q =>
      this.question = q,
    console.log("test1",this.question)
    )
    socket.on("newLocationQuestion", l =>
       this.LocationQuestion=l,
        console.log("test2",this.LocationQuestion)
    )

  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
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
  }
  }
}
</script>

<style>

#mapItem{

}

</style>