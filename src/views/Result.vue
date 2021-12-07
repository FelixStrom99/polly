<template>
  <div>
    {{question}}
  </div>
  <Bars v-bind:data="data"/>
  {{locationQuestion}}
  {{locationData}}
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
      locationData:[]

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
      this.locationData=update.a
      this.locationQuestion=update.q
      console.log(this.locationQuestion)
        }
    )
  }
}
</script>
