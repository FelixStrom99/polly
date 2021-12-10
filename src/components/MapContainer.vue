<template>
  <div ref="map-root"
       style="width: 100%; height: 100%">
  </div>
  <button type="button" v-on:click="submitLocation"> SUBMIT LOCATION</button>
</template>

<script>
import View from 'ol/View'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { transform } from 'ol/proj'
/*import {Fill, Style} from 'ol/style' */



// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import 'ol/ol.css'

export default {
  name: 'MapContainer',
  components: {},

  data: function () {
    return {
    // store OL objects on the component instance
    olMap: null,
    vectorLayer: null,
    evt_coordinate:{x:0,
    y:0},
    userPoint: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: []
      }
    },
    lineString:{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: []
      }
    },
    correctPoint: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: []
      },

    }

  }},
  mounted() {
    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [], // the vector layer is now created empty
      }),
    })

    this.olMap = new Map({
      target: this.$refs['map-root'],
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vectorLayer
      ],
      view: new View({
        zoom: 14,
        center: [1962289.773825233,8368555.335845293],
        constrainResolution: true
      }),
    }),


    this.olMap.on('click', (event) => {
      let myTarget = JSON.parse(JSON.stringify(transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')));

      this.evt_coordinate.x= myTarget[0];
      this.evt_coordinate.y= myTarget[1];
      console.log(this.evt_coordinate.x)
      console.log(this.evt_coordinate.y)
      this.userPoint.geometry.coordinates=[this.evt_coordinate.x,this.evt_coordinate.y]
      this.addPoint(this.userPoint)

    });

  },

  methods: {
    addPoint(geojson) {

      const source = this.vectorLayer.getSource()

      const features = new GeoJSON({
        featureProjection: 'EPSG:3857',
      }).readFeatures(geojson)

      source.clear();
      source.addFeatures(features);

    },
      updateSource(geojson) {

      const source = this.vectorLayer.getSource()

      const features = new GeoJSON({
        featureProjection: 'EPSG:3857',
      }).readFeatures(geojson)

      source.addFeatures(features);

    },
    submitLocation(){
      this.lineString.geometry.coordinates=[[this.evt_coordinate.x,this.evt_coordinate.y],[17.62696027384439,59.86043406543544]]
      this.updateSource(this.lineString)
      this.correctPoint.geometry.coordinates=[17.62696027384439,59.86043406543544]
      this.updateSource(this.correctPoint)
    }
  }
}

</script>