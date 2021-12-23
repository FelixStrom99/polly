<template>
  <div v-for="(title,i) in question"
       v-bind:title="title"
       v-bind:key="title[i]">
     {{title[i]}}
  </div>
  <Bars v-bind:data="data"/>
  <div>

  </div>
  <!--- <div id="mapcontainer">
    <div id="dots">
    <div v-for="(location,key) in locationData" v-bind:style="{ left: location.x + 'px', top: location.y + 'px'}" v-bind:key="'dots'+ key">
T

    </div>
    </div>
  </div> -->

  <div id="openlayers-map">
    <MapContainerResults :geojson="geojson" v-bind:locationData="locationData" v-bind:correctLocation="correctLocation" v-bind:mapView="mapView"> </MapContainerResults>
  </div>
  <p>locationquestion</p>
  {{ locationQuestion }}
  <p>locationdata</p>
{{locationData}}

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
      question: "",
      data: {
      },
        correctLocation: {
          x: 0,
          y: 0
        },
      locationQuestion:"",
      LocationQuestion: {
        lq: "",
        location: {
          x: 0,
          y: 0
        }
        },
      locationData:null,
      mapView: {zoom: 0, center: [0,0]}
    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId)
    socket.on("dataUpdate", (update) => {
      this.data = update.a;
      this.question = update.q;
      console.log("hej",this.data)
    });
    socket.on("newQuestion", update => {
      this.question = update.q;
      this.data = {};
    })
    socket.on("userMapView",d =>
        this.mapView=d)
    socket.on("locationDataUpdate", update=>{
      this.locationData=update.la
      this.locationQuestion=update.lq

  })
},
methods:{


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