<template>
  <div id="map">
      <MapContainer :geojson="geojson"> </MapContainer>
  </div>
  <div><p>HELLO</p></div>
</template>

<script>
import MapContainer from "../components/MapContainer";

export default {
  name: 'TestSite',
  components:{
  MapContainer,
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
  width: 100%;
}

</style>