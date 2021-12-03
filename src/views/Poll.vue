<template>
  <div>
    {{pollId}}
    <Question v-bind:question="question"
              v-on:answer="submitAnswer"/>
  </div>
  {{LocationQuestion.location}}
  <div>
    <LocationQuestion v-bind:LocationQuestion="LocationQuestion"  />
  </div>
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
      },
      LocationQuestion:{
        lq:"",
        location: { x: 0,
          y: 0},
        image: "",
      },
      pollId: "inactive poll"
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId)
    socket.on("newQuestion", q =>
      this.question = q
    )
    socket.on("newLocationQuestion", l =>
       this.LocationQuestion=l
    )

  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    }
  }
}
</script>
