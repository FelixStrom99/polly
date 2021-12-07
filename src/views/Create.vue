<template>

  <section v-if="firstStage===true">
    <div>
      <h1>Create game</h1>
      <div>
        <input type="text" v-model="pollId" placeholder="Enter title...">
      </div>
      <button v-on:click="createPoll">
        Save
      </button>
    </div>
  </section>


  <section class="theme  ChooseMap" v-else-if="firstStage===false && secondStage===true">
    <div>
      {{ pollId }}
    </div>

    <div class="maps" >

        <div  class="map-item" id="background_pic_uppsala"  v-on:click="nextSection" style="cursor: pointer;">
          <figure >
            <h1 class="city_name_charachter_spec" >Uppsala</h1>
          </figure>
        </div>

      <div  class="map-item"
            id="background_pic_stockholm"
            v-on:click="nextSection" style="cursor: pointer;">
          <figure  >
            <h1 class="city_name_charachter_spec">Stockholm</h1>
          </figure>
      </div>


        <div class="map-item" id="background_pic_sundsvall" v-on:click="nextSection" style="cursor: pointer;">
          <figure >
            <h1 class="city_name_charachter_spec">Sundsvall</h1>
          </figure>
        </div>

      <div class="map-item" id="background_pic_västerås"  v-on:click="nextSection" style="cursor: pointer;">
        <figure >
          <h1 class="city_name_charachter_spec">Västerås</h1>
        </figure>
      </div>

      <div class="map-item" id="background_pic_göteborg"  v-on:click="nextSection" style="cursor: pointer;">
        <figure >
          <h1 class="city_name_charachter_spec">Göteborg</h1>
        </figure>
      </div>

      <div class="map-item" id="background_pic_malmö"  v-on:click="nextSection" style="cursor: pointer;">
        <figure >
          <h1 class="city_name_charachter_spec">Malmö</h1>
        </figure>
      </div>



    </div>
  
  </section>
<section v-else-if="secondStage===false">
  <div>
    Poll link:
    <input type="text" v-model="pollId">
    <button v-on:click="createPoll">
      Create poll
    </button>
    <div>
      Fråga för location:
      <input type="text" v-model="locationQuestion">
    </div>
    <button v-on:click="addLocationQuestion">
      Add locationQuestion
    </button>

  <div id="mapcontainer">
    <div id="map" v-on:click="setLocation">
      <div v-bind:style="{left: location.x-60 + 'px', top: location.y-60 + 'px'}" class="disable">    <!--modifieras i x och y led för att nålen ska prickas rätt -->
        <object data="/svg_files/PinMap/Pin_Map.svg" type="image/svg+xml">
          <img src="yourfallback.jpg" />
        </object>
      </div>
    </div>
  </div>
    <div style="float: right" >
      <input type="range" min="0" max="100" value="50" id="slider" name="range" oninput="document.getElementById('range_from_location').innerHTML = this.value">
      <div id="selector">


      </div>

    </div>
    <div>
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      <div>
        <img src="">
        Answers:
        <input v-for="(_, i) in answers"
               v-model="answers[i]"
               v-bind:key="'answer'+i">
        <input type="checkbox" v-for="(_, i) in checkBox"
               v-model="checkBox[i]"
               v-bind:key="'checkBox'+i">
        {{this.answers.length}}
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
        <button v-on:click="deleteAnswer">
          Delete answer alternative
        </button>
      </div>
    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>

    {{ data }}
    <router-link v-bind:to="'/result/'+pollId">Check result</router-link>
  </div>

 <!-- <button type="button" v-on:click="addLocation">
    Confirm Correct Location
  </button>-->
  {{ location }}

  <section>
    <div>
      <input type="number" v-model="questionNumber">
      <button v-on:click="runQuestion">
        Run Follow-up Question
      </button>
    </div>
    <div>
      <input type="number" v-model="locationQuestionNumber">
      <button v-on:click="runLocationQuestion">
        Run Location-Question
      </button>
    </div>
  </section>

</section>

</template>

<script>
import io from 'socket.io-client';

const socket = io();

export default {
  name: 'Create',
  data: function () {
    return {
      lang: "",
      pollId: "",
      title: "",
      question: "",
      answers: ["", ""],
      checkBox: [false, false],
      locationQuestion: "",
      location: {
        x: 0,
        y: 0
      },
      questionNumber: 0,
      locationQuestionNumber: 0,
      data: {},
      uiLabels: {},
      range_from_location: "",
      imgUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Uppsala_Anteckningar_om_staden_och_dess_omgifning_-_karta.jpg",

      firstStage: true,
      secondStage:true

    }
  },
  created: function () {
    this.lang = this.$route.params.lang;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) =>
        this.data = data
    )
    socket.on("pollCreated", (data) =>
        this.data = data)
  },

  methods: {

    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      this.firstStage = false
    },
    nextSection: function () {
      this.secondStage = false
    },
    addLocationQuestion: function () {
      socket.emit("addLocationQuestion", {pollId: this.pollId, lq: this.locationQuestion, location: this.location,image: this.imgUrl})
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers, correct: this.checkBox})
    },
    addAnswer: function () {
      if (this.answers.length <= 3) {
        this.answers.push("");
        this.checkBox.push(false);
      }
    },
    deleteAnswer: function () {
      if (this.answers.length >= 3){
        this.answers.pop();
        this.checkBox.pop();
      }
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    },
    runLocationQuestion: function () {
      socket.emit("runLocationQuestion", {pollId: this.pollId, locationQuestionNumber: this.locationQuestionNumber})
    },
    setLocation: function (event) {
      var offset = {
        x: event.currentTarget.getBoundingClientRect().left,
        y: event.currentTarget.getBoundingClientRect().top
      };

      this.location = {
        x: event.clientX - 10 - offset.x,
        y: event.clientY - 10 - offset.y
      }

    }
  }
}
</script>
<style>

.disable{
  pointer-events: none;
}

.disable{
  pointer-events: none;
}

.city_name_charachter_spec{
  font-family: sans-serif;
  text-align: center;
  font-weight: bold;


}



.maps {

  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap:5px;
  grid-gap: 10px;
  background: none;
  outline: none;
  border-radius: 5px;
  padding: 10px;
}

.map-item {

  border: 1px solid rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 20px;
  font-size: 30px;
  width: 400px;
  height: 300px;

  margin-left: auto;
  margin-right: auto;

  text-align: center;
}

#background_pic_uppsala{
  background-image: url("https://www.liveit.se/images/std/uppsala-lan.jpg");
  background-size: cover;
  background-position: center;
}
#background_pic_stockholm{
  background-image: url("https://media.istockphoto.com/photos/old-town-in-stockholm-sweden-picture-id521418487?k=20&m=521418487&s=612x612&w=0&h=w820j5TprwQZer-NQhlrJ17c6UT-LFPDXQe3M7jqdks=");
  background-size: cover;
  background-position: center;
}
#background_pic_sundsvall{
  background-image: url("https://www.energi.se/siteassets/artiklar/2020-6/nyheter/sundsvall-219.jpg?w=1440&h=0&quality=100&format=jpg&mode=crop");
  background-size: cover;
  background-position: center;
}

#background_pic_västerås{
  background-image: url("https://www.happydays.nu/storage/img/hotels/stemning/6999/gen/good-morning-vasteras-20.jpg?1601458565 ");
  background-size: cover;
  background-position: center;
}
#background_pic_göteborg{
  background-image: url("https://goteborgco.se/wp-content/uploads/2019/12/tradgardsforeningen_167-11-2048x947.jpg");
  background-size: cover;
  background-position: center;

}
#background_pic_malmö{
  background-image: url("https://diagnostisktcentrumhud.se/wp-content/uploads/2021/04/shutterstock_1456864457.jpg");
  background-size: cover;
  background-position: center;
}


#map {
  position: relative;
  padding: 10px;
  background: url("https://upload.wikimedia.org/wikipedia/commons/0/0c/Uppsala_Anteckningar_om_staden_och_dess_omgifning_-_karta.jpg");
  background-repeat: no-repeat;
  width: 1133px;
  height: 1382px;
  cursor: crosshair;
}

#map div {
  position: absolute;
}
#slider{
  height: 8px;
  outline: none
}
#selector{
  height: 104px;
  width: 50px;
  position: absolute;
  bottom:-10px ;
  left:50% ;
  transform: translateX(-50%);
  z-index: 2;
}
#selectbutton{
  height: 48px;
  width: 48px;
  border-radius: 50%;
  position:absolute;
  bottom: 0px;
  background: black;
  color: white;
  border-radius: 10px;
  width: 20px;
  height: 20px;
  text-align: center;

}

#mapcontainer {
  width: 800px;
  height: 450px;
  overflow: scroll;
  margin-bottom: 20px;
  border: groove
}

</style>
