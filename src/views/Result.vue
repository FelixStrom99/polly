<template>
  <div>
{{question}}
  </div>
  <Bars v-bind:data="data"/>
  <div>

  </div>
  <div id="mapcontainer">
    <div id="dots">
    <div v-for="(location,key) in locationData" v-bind:style="{ left: location.x + 'px', top: location.y + 'px'}" v-bind:key="'dots'+ key">
T

    </div>
    </div>
  </div>
  {{ locationQuestion }}
  {{ locationData }}
</template>

<script>
// @ is an alias to /src
import Bars from '@/components/Bars.vue';
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'Result',
  components: {
    Bars
  },
  data: function () {
    return {
      question: "",
      data: {
      },
      locationQuestion:"",
      locationData:null

    }
  },
  created: function () {
    this.pollId = this.$route.params.id
    socket.emit('joinPoll', this.pollId)
    socket.on("dataUpdate", (update) => {
      this.data = update.a;
      this.question = update.q;
    });
    socket.on("newQuestion", update => {
      this.question = update.q;
      this.data = {};
    })
    socket.on("locationDataUpdate", update=>{
      this.locationData=update.la
      this.locationQuestion=update.lq
      console.log("babe2",this.locationData)
      console.log("babe",this.locationQuestion)



  })
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
#dots {
  position: relative;
  margin: 0;
  padding: 0;
  background: url("https://upload.wikimedia.org/wikipedia/commons/0/0c/Uppsala_Anteckningar_om_staden_och_dess_omgifning_-_karta.jpg");
  background-repeat: no-repeat;
  width:1920px;
  height: 1078px;
  cursor: crosshair;
}

#dots div {
  position: absolute;
  background: deeppink;
  color: white;
  border-radius: 10px;
  width:20px;
  height:20px;
  text-align: center;
}
</style>