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

  <h1> {{uiLabels.results}}</h1>
 <h2 style="text-decoration-line: underline"> {{ locationQuestion }} </h2>
  <h3> {{uiLabels.resultsInfo}}</h3>
  <div id="boxResult">
    <div id="openlayers-map-result">
      <MapContainerResults :geojson="geojson" v-bind:key=updateZoom  v-bind:locationData="locationData" v-bind:correctLocation="correctLocation" v-bind:mapView="mapView"> </MapContainerResults>
    </div>
  </div>
  <div class="result-bar-container">
    <h2 style="text-decoration-line: underline"> {{uiLabels.followUpQuestion}}</h2>
    <h3> {{uiLabels.followupInfo}}</h3>
    <div class="result-bar-wrapper">
      <Bars class="result-bar-item" v-for="(title,i) in question"
            v-bind:key="title"
            v-bind:title="title"
            v-bind:correct="correct[i]"
            v-bind:data="followUpData[i]"/>
    </div>
  </div>



</template>

<script>
// @ is an alias to /src
import Bars from '@/components/Bars.vue';
import io from 'socket.io-client';
import MapContainerResults from "../components/MapContainerResults";
const socket = io();

export default {
  name: 'Result',
  components: {
    Bars,
    MapContainerResults
  },
  data: function () {
    return {
      lang: "",
      uiLabels: {},
      question: [],
      correct:[],
      followUpData:[],
      correctLocation: {
        x: 0,
        y: 0
      },
      locationQuestion: "",
      locationData: {},
      mapView: {zoom: 0, center: [0, 0]},
      updateZoom: 0,

    }

  },
  created: function () {
    this.pollId = this.$route.params.id
    this.lang = this.$route.params.lang;
    document.title = "Mapquiz"

    socket.emit("pageLoaded", {lang: this.lang, id: this.pollId});
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.emit('joinPoll', this.pollId)
    socket.on("dataUpdate", (update) => {
      this.createAnswerArray(update)


    });
    socket.on("newQuestion", update => {
      this.question=[]
      this.followUpData = [];
      this.locationQuestion = update.lq
      this.updateZoom += 1
      this.correctLocation = update.location

    })
    socket.on("userMapView", d =>
        this.mapView = d)

    socket.on("locationDataUpdate", update => {
      this.locationData = update.la

      this.updateZoom += 1
    });

    socket.on("sendToPoll", lang => {
      this.sendToPoll(lang)


    });


  },
  methods: {

    createAnswerArray: function (answerData) {
      for (let i = 0; i < (answerData.answers).length; i++) {
        this.question.push((answerData.answers)[i].question)
       let keys=Object.keys((answerData.answers)[i])
        let answers={}
        for (let index = 1; index < keys.length; index++) {
          answers[keys[index]]=(answerData.answers)[i][keys[index]]
        }
        this.followUpData.push(answers)
        this.correct.push((answerData.correct)[i][i])
      }

    },

  sendToPoll: function (lang) {
    console.log(lang)
    this.$router.push({path: `/poll/${this.pollId}/` + lang})
  },
}
}

</script>
<style>

#boxResult{
  display:flex;
  justify-content:space-evenly;
}
#openlayers-map-result {
  position: relative;
  margin: 0;
  padding: 0;
  height: 60vh;
  width: 90%;
}
.result-bar-container {
  margin-top: 3vw;
  height:auto;
}
.result-bar-wrapper{
  display: flex;
  justify-content: space-around;
  gap: 1vw;
  width: 100%;
  flex-wrap: wrap;
}
.result-bar-item {
  height: 100vw;
  background-color: #2d3572;
  opacity: 0.95;

}

@media only screen and (max-width: 600px) {

}
</style>