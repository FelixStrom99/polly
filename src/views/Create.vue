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




  <section class="ChooseMap" v-else-if="firstStage===false && secondStage===true">
    <div>
      {{ pollId }}
    </div>
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
      <div v-bind:style="{left: location.x-60 + 'px', top: location.y-60 + 'px'}" class="disable">    <!--modifieras i x och y led för att nålen ska prickas rätt -->
        <object data="/svg_files/PinMap/Pin_Map.svg" type="image/svg+xml">
          <img src="yourfallback.jpg" />
        </object>
      </div>
    </div>
  </div>
    <div style="float: right" >
      <input type="range" min="0" max="100" value="50" id="slider" name="range" oninput="document.getElementById('range_from_location').innerHTML = this.value">
      <div id="selector">


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
        <input type="checkbox" v-for="(_, i) in checkBox"
               v-model="checkBox[i]"
               v-bind:key="'checkBox'+i">
        {{this.answers.length}}
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
        <button v-on:click="deleteAnswer">
          Delete answer alternative
        </button>
        <p>Choose which answer is right</p>
        <input type="number" v-model="correctAnswer">
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
      checkBox: [false, false],
      correctAnswer: 0,
      locationQuestion: "",
      location: {
        x: 0,
        y: 0
      },
      questionNumber: 0,
      locationQuestionNumber: 0,
      data: {},
      uiLabels: {},
      range_from_location: "",
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
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers, correct: this.correctAnswer})
    },
    addAnswer: function () {
      if (this.answers.length <= 3) {
        this.answers.push("");
        this.checkBox.push(false);
      }
    },
    deleteAnswer: function () {
      if (this.answers.length >= 3){
        this.answers.pop();
        this.checkBox.pop();
      }
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
.disable{
  pointer-events: none;
}

.maps {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap:5px;
  grid-gap: 10px;
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


}
#slider{
  height: 8px;
  outline: none
}
#selector{
  height: 104px;
  width: 50px;
  position: absolute;
  bottom:-10px ;
  left:50% ;
  transform: translateX(-50%);
  z-index: 2;
}
#selectbutton{
  height: 48px;
  width: 48px;
  border-radius: 50%;
  position:absolute;
  bottom: 0px;
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
