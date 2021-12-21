<template>

  <div ref="map-root"
       style="width: 100%; height: 100%">
  </div>
  <div>
  <button type="button" v-on:click="submitLocation"> SUBMIT LOCATION</button>
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
import {Fill, Style, Stroke,Icon} from 'ol/style'
/*import {Circle} from 'ol/style'*/



// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import 'ol/ol.css'
import io from "socket.io-client";
const socket = io();

export default {
  name: 'MapContainer',
  components: {},
  props:{
    correctLocation:Object

  },
  data: function () {
    return {
      // store OL objects on the component instance
      olMap: null,
      vectorLayer: null,
      evt_coordinate:{x:0,
        y:0},

      mapView:{zoom:0,center:[0,0]},
      userPoint: {
        type: 'Feature',
        properties: {
          radius: 10,
          color: 'red'
        },
        geometry: {
          type: 'Point',
          coordinates: []
        }
      },
      userPointFeature: null,
      lineString:{
        type: 'Feature',
        properties: {
          color: 'black'
        },
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      },
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
  created: function () {
    this.pollId = this.$route.params.id
    socket.on("userMapView", d =>
        console.log(d.pollId)


    )},
  computed: {
    userPointProperties: function () {
      return this.userPoint.properties;
    }
  },
  watch: {
    userPointProperties: {
      handler: function (newVal) {
        this.userPointFeature.getStyle().getImage().setRadius(newVal.radius);
        this.vectorLayer.changed();
      },
      deep: true
    }
  },
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

          this.evt_coordinate.x= myTarget[0]
          this.evt_coordinate.y= myTarget[1]
          this.answer(this.evt_coordinate);
          console.log(this.evt_coordinate.x)
          console.log(this.evt_coordinate.y)
          this.userPoint.geometry.coordinates=[this.evt_coordinate.x,this.evt_coordinate.y]
          this.addPoint(this.userPoint)


        });

  },

  methods: {
    pointStyle({color}) {
      return new Style( {
      /*  image: new Circle({
          radius: radius,           */
        image: new Icon({
          anchor: [0.5, 69],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: '/svg_files/PinMap/Pin_Map.svg',
        }),
          fill: new Fill({
            color: color,
          }),
          stroke: new Stroke({
            color: color,
            width: 2
          })
        })
    },
    lineStyle({color}) {
      return new Style( {
        stroke: new Stroke({
          color: color,
          width: 3,
          lineDash:[17,10]
        })
      })
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

      this.userPointFeature = new GeoJSON({
        featureProjection: 'EPSG:3857',
      }).readFeature(geojson)
      this.userPointFeature.setStyle(this.pointStyle(this.userPointProperties));
      source.clear();
      source.addFeature(this.userPointFeature);

    },
    updateSource(geojson, styleFn) {

      const source = this.vectorLayer.getSource()

      const feature = new GeoJSON({
        featureProjection: 'EPSG:3857',
      }).readFeature(geojson)
      feature.setStyle(styleFn(geojson.properties));
      source.addFeature(feature);

    },
    submitLocation(){
      this.lineString.geometry.coordinates=[[this.evt_coordinate.x,this.evt_coordinate.y],[this.correctLocation.x,this.correctLocation.y]]
      this.updateSource(this.lineString, this.lineStyle)
      this.correctPoint.geometry.coordinates=[this.correctLocation.x,this.correctLocation.y]
      this.updateSource(this.correctPoint, this.correctPointStyle)

    },
    answer: function (mapLocation) {
      this.$emit("userLocation", mapLocation);
    }
  },

}

</script>
