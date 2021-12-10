
<template>
  <div id="app">
    <div class="cell cell-map">
      <MapContainer :geojson="geojson"> </MapContainer>
    </div>
    <div class="cell cell-edit">
      <Edit :geojson="geojson" v-on:change="geojson = $event">
      </Edit>
    </div>

  </div>
</template>

<script>
import MapContainer from "../components/MapContainer";
import Edit from "../components/Edit"
export default {
  name: 'TestSite',
  components:{
  MapContainer,
  Edit
},

  data: function () {
    return {

      // this is the initial GeoJSON data
      geojson: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [17.634533732789, 59.858428961541]
        }
      }
    }
  }
}
</script>
<style>
html, body {
  height: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  height: 100%;
  display: grid;
  grid-template-columns: 100vh;
  grid-auto-rows: 1fr;
  grid-gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
}

.cell {
  border-radius: 4px;
  background-color: lightgrey;
}

.cell-map {
  grid-column: 1;
  grid-row-start: 1;
  grid-row-end: 3;
}

.cell-edit {
  grid-column: 2;
  grid-row: 1;
  width:200px;
}

</style>