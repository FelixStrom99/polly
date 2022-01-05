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
 <h2> {{ locationQuestion }} </h2>

  <h3> {{uiLabels.resultsInfo}}</h3>
  <div id="boxResult">
    <div id="openlayers-map">
      <MapContainerResults :geojson="geojson" v-bind:key=updateZoom  v-bind:locationData="locationData" v-bind:correctLocation="correctLocation" v-bind:mapView="mapView"> </MapContainerResults>
    </div>
  </div>
  <div class="result-bar-container">
    <h2> {{uiLabels.followUpQuestion}}</h2>
    <div class="result-bar-wrapper">
      <Bars class="result-bar-item" v-for="(title,i) in question"
            v-bind:key="title"
            v-bind:title="title"
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

    socket.emit("pageLoaded", {lang: this.lang, id: this.pollId});
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.emit('joinPoll', this.pollId)
    socket.on("dataUpdate", (update) => {
      this.createAnswerArray(update)
      /*  this.data = update.a;
      this.question = update.q;*/

    });
    socket.on("newQuestion", update => {
      this.question=[]
      this.followUpData = [];
      this.locationQuestion = update.lq
      //* this.locationData={}
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
      for (let i = 0; i < answerData.length; i++) {
        this.question.push((answerData[i].q))
       let keys=Object.keys(answerData[i])
        let answers={}
        for (let index = 1; index < keys.length; index++) {
          answers[keys[index]]=answerData[i][keys[index]]
        }
        this.followUpData.push(answers)
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
  justify-content: center;
}
#openlayers-map {
  position: relative;
  margin: 0;
  padding: 0;
  height: 20em;
  width: 90%;
}
.result-bar-container {
  margin-top: 1vw;
  background-color: #2d3572;
  border: 0.3em solid #EFA500;
  height:auto;
}
.result-bar-wrapper{
  display: flex;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;

}
.result-bar-item {

}
</style>