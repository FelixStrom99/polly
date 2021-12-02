<template>
  <section v-if="firstStage===true">
    <div>
      <h1>Create game</h1>
      <div>
        <input type="text" v-model="pollId" placeholder="Enter title...">
      </div>
      <button v-on:click="createPoll">
        Save
      </button>
    </div>
  </section>

<<<<<<< HEAD
  <section class="ChooseMap" v-else-if="firstStage===false">
=======

  <section class="ChooseMap" v-else-if="firstStage===false && secondStage===true">

>>>>>>> f2f2cdedb6b081dfab560204e86ad753a0b64d04
    <div>
      {{ pollId }}
    </div>
<<<<<<< HEAD
    <div class="maps" >
        <div  class="map-item">
          <figure>
            <h1>Uppsala</h1>
            <img url="https://upload.wikimedia.org/wikipedia/commons/0/0c/Uppsala_Anteckningar_om_staden_och_dess_omgifning_-_karta.jpg"
                 style="height:200px; width:200px;">
          </figure>
        </div>
        <div  class="map-item">
          <figure>
            <h1>Stockholm</h1>
            <img url="https://upload.wikimedia.org/wikipedia/commons/0/0c/Uppsala_Anteckningar_om_staden_och_dess_omgifning_-_karta.jpg"
                 style="height:200px; width:200px;">
          </figure>
        </div >
        <div class="map-item">
          <figure>
            <h1>Sundsvall</h1>
            <img url="https://upload.wikimedia.org/wikipedia/commons/0/0c/Uppsala_Anteckningar_om_staden_och_dess_omgifning_-_karta.jpg"
                 style="height:200px; width:200px;">
          </figure>
        </div>
=======
    <div class="maps">

      <div>
        <figure class="maps a">
          <h1>Uppsala</h1>
          <img
              url="https://upload.wikimedia.org/wikipedia/commons/0/0c/Uppsala_Anteckningar_om_staden_och_dess_omgifning_-_karta.jpg"
              style="height:200px; width:200px;">
        </figure>
        <figure class="maps b">
          <h1>Stockholm</h1>
          <img
              url="https://upload.wikimedia.org/wikipedia/commons/0/0c/Uppsala_Anteckningar_om_staden_och_dess_omgifning_-_karta.jpg"
              style="height:200px; width:200px;">
        </figure>
        <figure class="maps c">
          <h1>Sundsvall</h1>
          <img
              url="https://upload.wikimedia.org/wikipedia/commons/0/0c/Uppsala_Anteckningar_om_staden_och_dess_omgifning_-_karta.jpg"
              style="height:200px; width:200px;">
        </figure>
      </div>
>>>>>>> f2f2cdedb6b081dfab560204e86ad753a0b64d04
    </div>
    <button v-on:click="nextSection">
      Go forward bitch
    </button>
  </section>
<section v-else-if="secondStage===false">
  <div>
    Poll link:
    <input type="text" v-model="pollId">
    <button v-on:click="createPoll">
      Create poll
    </button>

    <div>
      Fråga för location:
      <input type="text" v-model="locationQuestion">
    </div>
    <div>
      <input type="number" v-model="locationQuestionNumber">
    </div>
    <button v-on:click="addLocationQuestion">
      Add locationQuestion
    </button>
    <div id="mapcontainer">

      <div id="map" v-on:click="setLocation">

        <div v-bind:style="{left: location.x + 'px', top: location.y + 'px'}">
          X
        </div>
      </div>
    </div>
    <div>
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      <div>
        <img src="">
        Answers:
        <input v-for="(_, i) in answers"
               v-model="answers[i]"
               v-bind:key="'answer'+i">
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>
    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>
    <input type="number" v-model="questionNumber">
    <button v-on:click="runQuestion">
      Run question
    </button>
    {{ data }}
    <router-link v-bind:to="'/result/'+pollId">Check result</router-link>
  </div>

  <button type="button" v-on:click="addLocation">
    Confirm Correct Location
  </button>
  {{ location }}
</section>
</template>

<script>
import io from 'socket.io-client';

const socket = io();

export default {
  name: 'Create',
  data: function () {
    return {
      lang: "",
      pollId: "",
      title: "",
      question: "",
      answers: ["", ""],
      locationQuestion: "",
      location: {
        x: 0,
        y: 0
      },
      questionNumber: 0,
      locationQuestionNumber: 0,
      data: {},
      uiLabels: {},
      firstStage: true,
      secondStage:true

    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) =>
        this.data = data
    )
    socket.on("pollCreated", (data) =>
        this.data = data)
  },
  methods: {
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      this.firstStage = false
    },
    nextSection: function () {
      this.secondStage = false
    },
    addLocationQuestion: function () {
      socket.emit("addLocationQuestion", {pollId: this.pollId, lq: this.locationQuestion, location: this.location})
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers})
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    },
    setLocation: function (event) {
      var offset = {
        x: event.currentTarget.getBoundingClientRect().left,
        y: event.currentTarget.getBoundingClientRect().top
      };

      this.location = {
        x: event.clientX - 10 - offset.x,
        y: event.clientY - 10 - offset.y
      }

    }
  }
}
</script>
<style>

.maps {
  display: grid;
<<<<<<< HEAD
  grid-template-columns: auto auto auto;
  grid-gap:5px;
=======
  grid-gap: 10px;
>>>>>>> f2f2cdedb6b081dfab560204e86ad753a0b64d04
  background-color: #434241;
  border-radius: 5px;
  padding: 10px;
}

.map-item {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 20px;
  font-size: 30px;
  text-align: center;
  width: 400px;
}

#map {
  position: relative;
  margin: 0;
  padding: 0;
  background: url("https://upload.wikimedia.org/wikipedia/commons/0/0c/Uppsala_Anteckningar_om_staden_och_dess_omgifning_-_karta.jpg");
  background-repeat: no-repeat;
  width: 1133px;
  height: 1382px;
  cursor: crosshair;
}

#map div {
  position: absolute;
  background: black;
  color: white;
  border-radius: 10px;
  width: 20px;
  height: 20px;
  text-align: center;
}

#mapcontainer {
  width: 800px;
  height: 450px;
  overflow: scroll;
  margin-bottom: 20px;
  border: groove
}
</style>
