<template>

  <div ref="map-root"
       style="width: 80%; height: 90%; border: groove 5px; border-color: #5862a6; opacity: 0.9;cursor:crosshair;">
  </div>
  <!--<input type="range" v-model="this.userPoint.properties.radius" max="40" min="5">-->

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
import {Style,Icon} from 'ol/style'



// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import 'ol/ol.css'

export default {
  name: 'MapContainerCreate',
  components: {},
  props: {
    mapView: Object,
    location:Object
  },
  watch: {
    location() {
      this.showLocation();
    }
  },

  data: function () {
    return {
      // store OL objects on the component instance
      olMap: null,
      vectorLayer: null,
      evt_coordinate:{x:0,
        y:0},
      correctPointFeature:null,
      correctPoint: {
        type: 'Feature',
        properties: {
          radius: 10,
          color: 'green'
        },
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
    this.showLocation()
    this.olMap = new Map({
      target: this.$refs['map-root'],
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vectorLayer
      ],
      view: new View({
        zoom: this.mapView.zoom,
        center: this.mapView.center,
        constrainResolution: true
      }),
    }),


        this.olMap.on('click', (event) => {
          let myTarget = JSON.parse(JSON.stringify(transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')));
          this.answer(this.evt_coordinate)
          this.evt_coordinate.x= myTarget[0];
          this.evt_coordinate.y= myTarget[1];
          this.answer(this.evt_coordinate);
          console.log(this.evt_coordinate.x)
          console.log(this.evt_coordinate.y)
          this.correctPoint.geometry.coordinates=[this.evt_coordinate.x,this.evt_coordinate.y]
          this.addPoint(this.correctPoint)

        });


  },

  methods: {
    showLocation() {
      this.correctPoint.geometry.coordinates=[this.location.x,this.location.y]
      this.addPoint(this.correctPoint)
    },

    correctPointStyle() {
      return new Style( {

        image: new Icon({
          anchor: [0.5, 69],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: '/svg_files/PinMap/Pin_Map_Green.svg',
        })
      })
    },
    addPoint(geojson) {

      const source = this.vectorLayer.getSource()

      this.correctPointFeature = new GeoJSON({
        featureProjection: 'EPSG:3857',
      }).readFeature(geojson)
      this.correctPointFeature.setStyle(this.correctPointStyle);
      source.clear();
      source.addFeature(this.correctPointFeature);

    },
    answer: function (mapLocation) {
      this.$emit("location", mapLocation);
    },
  }
}

</script>