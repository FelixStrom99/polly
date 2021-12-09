<template>

  <section v-if="firstStage===true" >
    <div>
      <h1> {{ uiLabels.createPoll }}</h1>
      <div>
        <input type="text" v-model="pollId" placeholder="Enter title...">
      </div>
      <button v-on:click="createPoll">
        {{ uiLabels.save }}
      </button>
    </div>
  </section>


  <section class="theme  ChooseMap" v-else-if="firstStage===false && secondStage===true">
    <div>
     <h1> {{ pollId }} </h1>
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


<section class="create-the-questions" v-else-if="secondStage===false">
  <h1>{{pollId}}</h1>
  <div class="create overview-left-side">
    <h1>Här ska överblicken av alternativen vara</h1>
    <img src="data:image/jpeg;base64,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"
         style="width: 200px; height: 200px">
  </div>
  <div class="create lq-and-q">
    <div class="location-question" v-if="createLocationQuestion">
      <div>
        {{ uiLabels.locationQuestion }}:<input type="text" v-model="locationQuestion">
      </div>
      <button v-on:click="addLocationQuestion">
        {{uiLabels.addLocationQuestion }}
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
      </div>
    <div class="create question" v-if="createMultipleChoiceQuestion">
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      <div class="question-multiple">

        <img src="">
        {{ uiLabels.answers}}:
        <input v-for="(_, i) in answers"
               v-model="answers[i]"
               v-bind:key="'answer'+i"
               class="textbox"
                >

        <div>
        <input type="checkbox" v-for="(_, i) in checkBox"
               v-model="checkBox[i]"
               v-bind:key="'checkBox'+i">
        {{this.answers.length}}
        </div>


        <div>
        <button v-on:click="addAnswer">
          {{ uiLabels.addAnswer}}:
        </button>
        <button v-on:click="deleteAnswer">
          {{ uiLabels.deleteAnswer }}:
        </button>
        </div>
      </div>
      <button v-on:click="addQuestion">
        Add question
      </button>


      <div class="answer-alternative-size-wrapper" >

        <div id="Answer-Box-symbol-prop" >

        </div>

        <div class="Answer-Box-textarea"  >

          <input
                  class="Answer-Box-textarea-prop"
                 placeholder="Answer 1"
                 >


        </div>

      <div class="Answer-Box-checkbox"  >

        <input type="checkbox"
                class="Answer-Box-checkbox-prop
                animation_rubberband">
      </div>

      </div>


    </div>



    <button>  <router-link class="routerLink" v-bind:to="'/result/'+pollId">Check result</router-link></button>
  </div>
  <div class=" create alternative-right-side">
    <!-- <input type="range" min="0" max="100" value="50" id="slider" name="range" oninput="document.getElementById('range_from_location').innerHTML = this.value">
    -->
    <h1>Här ska vi ha knappar med lite rolig funktionalitet</h1>
    <button v-on:click="showLocationQuestion">Location question</button>
    <button v-on:click="showMultipleQuestion">Multiple choice question</button>
  </div>
 <!-- <button type="button" v-on:click="addLocation">
    Confirm Correct Location
  </button>-->

  {{ location }}


  <section class="lowerside">
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
      createLocationQuestion: true,
      createMultipleChoiceQuestion: false,
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
    showLocationQuestion: function () {
      this.createLocationQuestion = true;
      this.createMultipleChoiceQuestion = false;
    },
    showMultipleQuestion: function () {
          this.createLocationQuestion = false;
          this.createMultipleChoiceQuestion = true;
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
  },

}
</script>
<style>

.create-the-questions {
  background-color: #1682a8;
}

.create {
  background-color: antiquewhite;
  height: 35em;
}

.overview-left-side {
  display: inline-block;
  float:left;
  left: 150px;
  width: 20%;
  border: 3px solid green;
}

.lq-and-q {
  display: inline-block;
  float:left;
  width: 60%;
  margin: 0;
  padding: 0;
}



.Answer-Box-textarea-prop{

  width: 100%;
  height: 97%;
  margin-left: 2%;
  float: left;
  font-size: 18px;
  font-family: sans-serif;
  font-weight: 600;
  outline: none;
  border: none;






}

.Answer-Box-checkbox-prop{
  margin-right: 15%;
  height: 100%;
   -webkit-transform: scale(2);
  transform: scale(2);
border-radius: 5px;
}


.alternative-right-side {
  display: inline-block;
  float:right;
  right: 200px;
  width: 19%;
  border: 3px solid green;

}
.animation_rubberband{

  animation-iteration-count: infinite;
  animation-timing-function: linear;

  animation: rubberBand  2s infinite;
}
.animation_rubberband:hover{
  animation: 0 ;
}


@keyframes rubberBand {
  0%{
    transform: scale3d(2,2,2);
  }
  15%{
    transform: scale3d(2.15,1.85,2);
  }
  30%{
    transform: scale3d(1.85,2.15,2);
  }
  45%{
    transform: scale3d(2.15,1.85,2);
  }
  65%{
    transform: scale3d(2.05,1.95,2);
  }
  100%{
    transform: scale3d(2,2,2);
  }


}

.lowerside {
  display: block;
}

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

.textbox{
  font-size: large;
  font-weight: bold;
  padding:1.25rem;
  margin:5px;
  background: #ffffff;
  opacity: 90%;
  outline: black;
  border: 2px  ;
  border-radius: 15px;
  transition: border-color .5s;
}
textbox:hover{

}
.answer-alternative-size-wrapper {
  border: solid 2px ;
  border-color: rgba(82, 77, 77, 0.55);
  background-color: white;
  height: 30%;
  width: 35%;
  border-radius: 10px ;
  display: grid;
  color: #444;


}
#Answer-Box-symbol-prop {
  column-width: 40px;
  background-color: rgba(6, 236, 4, 0.73);
  border-radius: 7px 0px 0px 7px ;
  height: 100%;
  width: 100%;
}
.Answer-Box-textarea {
  border-left: solid 2px ;
  border-color: rgba(82, 77, 77, 0.55);
  column-width:auto;
  grid-column: 2 ;
  width: 93%;

}

.Answer-Box-checkbox {
  border-left: solid 2px ;
  border-color: rgba(82, 77, 77, 0.55);
  column-width: 50px;
  height: 100%;
  grid-column: 3 ;


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
  margin: 0;
  padding: 0;
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
  width: 600px;
  height: 450px;
  overflow: scroll;
  margin-bottom: 20px;
  border: groove;
  margin-left: auto;
  margin-right: auto;
  position: center;
}
  .routerLink {
    text-decoration: none;
  }

</style>
