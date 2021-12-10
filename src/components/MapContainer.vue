<template>
  <div ref="map-root"
       style="width: 100%; height: 100%">
  </div>
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


// importing the OpenLayers stylesheet is required for having
// good looking buttons!
import 'ol/ol.css'

/*data: function () {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [17.634533732789, 59.858428961541]
      }
    }
var mapdata = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [17.634533732789, 59.858428961541]
  }
}*/

export default {
  name: 'MapContainer',
  components: {},
  props: {
    // the GeoJSON data is now taken as an input
    geojson: Object
  },
  data: function () {
    return {
    // store OL objects on the component instance
    olMap: null,
    vectorLayer: null,
    evt_coordinate:{x:0,
    y:0}

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
        zoom: 0,
        center: [0, 0],
        constrainResolution: true
      }),
    })

    this.olMap.on('click', (event) => {
      let myTarget = JSON.parse(JSON.stringify(transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')));

      this.evt_coordinate.x= myTarget[0];
      this.evt_coordinate.y= myTarget[1];
      console.log(this.evt_coordinate.x)
      console.log(this.evt_coordinate.y)
    });

    // we’re calling `updateSource` to show the object initially
    this.updateSource(this.geojson)
  },
  watch: {
    geojson(value) {
      // call `updateSource` whenever the input changes as well
      this.updateSource(value)
    }
  },
  methods: {
    // this will parse the input data and add it to the map
    updateSource(geojson) {
      const view = this.olMap.getView()
      const source = this.vectorLayer.getSource()

      const features = new GeoJSON({
        featureProjection: 'EPSG:3857',
      }).readFeatures(geojson)


      source.clear();
      source.addFeatures(features);

      // this zooms the view on the created object
      view.fit(source.getExtent())
    }
  }
}

</script>