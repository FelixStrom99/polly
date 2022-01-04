<template>

  <div ref="map-root"
       style="width: 90%; height: 100%; border: groove 5px; border-color: #5862a6; cursor:crosshair;">
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
import Overlay from 'ol/Overlay'

/*import {Circle} from 'ol/style'*/



// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import 'ol/ol.css'
/*import io from "socket.io-client";
//*const socket = io();*/

export default {
  name: 'MapContainer',
  components: {},
  props:{
    correctLocation:Object,
    mapView:Object


  },
  data: function () {
    return {
      // store OL objects on the component instance
      olMap: null,
      vectorLayer: null,
      clickable: true,
      distance: 0,
      popup:null,

      evt_coordinate:{x:0,
        y:0},

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

      },
      distanceText: {
        type: 'Feature',
        properties: {
          color: 'green'
        },
        geometry: {
          type: 'Point',
          coordinates: []
        },

      }
    }},
  /*created: function () {
    this.pollId = this.$route.params.id
    socket.on("userMapView", d =>
        console.log(d.pollId)


    )},*/
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
        zoom: this.mapView.zoom,
        center: this.mapView.center,
        constrainResolution: true
      }),
    }),


        this.olMap.on('click', (event) => {
          if (this.clickable==true){
          let myTarget = JSON.parse(JSON.stringify(transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')));
          console.log("g",this.mapView.zoom)
          this.evt_coordinate.x= myTarget[0]
          this.evt_coordinate.y= myTarget[1]
          this.answer(this.evt_coordinate);
          console.log(this.evt_coordinate.x)
          console.log(this.evt_coordinate.y)
          this.userPoint.geometry.coordinates=[this.evt_coordinate.x,this.evt_coordinate.y]
          this.addPoint(this.userPoint)
          }


        });

  },

  methods: {
    meterDistance() {
      var holderX1 = this.correctLocation.x
      var holderY1 =  this.correctLocation.y
      var x2 = this.evt_coordinate.x
      var y2 = this.evt_coordinate.y
      var R = 6378.137;
      var dLat = x2 * Math.PI / 180 - holderX1 * Math.PI / 180;
      var dLon = y2 * Math.PI / 180 - holderY1 * Math.PI / 180;
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(holderX1 * Math.PI / 180) * Math.cos(x2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      this.distance = d * 1000;
    },
    distancePopup(){
      this.popup= new Overlay({
        element: document.getElementById('popup'),
        text: 'wallahi'
      })
      console.log('popup' + this.popup)

      this.popup.coordinates
      this.olMap.addOverlay(this.popup)


    },
    pointStyle({color}) {
      return new Style( {

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
          }),



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
        }),
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

        this.lineString.geometry.coordinates = [[this.evt_coordinate.x, this.evt_coordinate.y], [this.correctLocation.x, this.correctLocation.y]]
        this.updateSource(this.lineString, this.lineStyle)
        this.correctPoint.geometry.coordinates = [this.correctLocation.x, this.correctLocation.y]
        this.updateSource(this.correctPoint, this.correctPointStyle)
        this.clickable=false


    },
    answer: function (mapLocation) {
      this.$emit("userLocation", mapLocation);
    }
  },

}

</script>

