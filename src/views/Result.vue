<template>

  <h1> {{uiLabels.results}}</h1>
 <h1>{{ locationQuestion }} </h1>

  {{locationData}}
  <h3> {{uiLabels.resultsInfo}}</h3>
  <div id="openlayers-map">
    <MapContainerResults :geojson="geojson" v-bind:key=updateZoom  v-bind:locationData="locationData" v-bind:correctLocation="correctLocation" v-bind:mapView="mapView"> </MapContainerResults>
  </div>

  <div v-for="(title,i) in question"
       v-bind:title="title"
       v-bind:key="title[i]">
    {{title[i]}}
  </div>

  <Bars v-bind:data="data"/>


  <!--- <div id="mapcontainer">
    <div id="dots">
    <div v-for="(location,key) in locationData" v-bind:style="{ left: location.x + 'px', top: location.y + 'px'}" v-bind:key="'dots'+ key">
T

    </div>
    </div>
  </div> -->

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
      question: "",
      data: {
      },
        correctLocation: {
          x: 0,
          y: 0
        },
      locationQuestion:"",
      locationData:{},
      mapView: {zoom: 0, center: [0,0]},
      updateZoom:0,

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
      this.data = update.a;
      this.question = update.q;

    });
    socket.on("newQuestion", update => {
      this.question = update.q;
      this.data = {};
      this.locationQuestion=update.lq
      //* this.locationData={}
      this.updateZoom+=1
      this.correctLocation=update.location

    })
    socket.on("userMapView",d =>
        this.mapView=d)

    socket.on("locationDataUpdate", update=>{
      this.locationData=update.la
      this.updateZoom+=1
      });

    socket.on("sendToPoll",lang => {
      this.sendToPoll(lang)


  });


},
methods:{
  sendToPoll: function (lang) {
    console.log(lang)
    this.$router.push({ path: `/poll/${this.pollId}/`+lang })
  },
}
}
</script>
<style>
/*#mapcontainer {
  width: 800px;
  height: 450px;
  overflow: scroll;
  margin-bottom: 20px;
  border: groove
}*/


#openlayers-map {
  position: relative;
  margin: 0;
  padding: 0;
  height: 30em;
  width: 100%;
}
</style>