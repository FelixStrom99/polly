<template>
  <div id="map">
      <MapContainerCreate :geojson="geojson"> </MapContainerCreate>
  </div>
</template>

<script>
import MapContainerCreate from "../components/MapContainerCreate";

export default {
  name: 'TestSite',
  components:{
  MapContainerCreate,
},

  data: function () {
    return {

      // this is the initial GeoJSON data

    }
  }
}
</script>
<style>

#map {
  position: relative;
  margin: 0;
  padding: 0;
  height: 30em;
  width: 99%;
}


</style>