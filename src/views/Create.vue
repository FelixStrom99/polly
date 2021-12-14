<template>

  <section v-if="firstStage===true">
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

    <div class="maps">

      <div class="map-item" id="background_pic_uppsala" v-on:click="nextSection" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Uppsala</h1>
        </figure>
      </div>

      <div class="map-item"
           id="background_pic_stockholm"
           v-on:click="nextSection" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Stockholm</h1>
        </figure>
      </div>


      <div class="map-item" id="background_pic_sundsvall" v-on:click="nextSection" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Sundsvall</h1>
        </figure>
      </div>

      <div class="map-item" id="background_pic_västerås" v-on:click="nextSection" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Västerås</h1>
        </figure>
      </div>

      <div class="map-item" id="background_pic_göteborg" v-on:click="nextSection" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Göteborg</h1>
        </figure>
      </div>

      <div class="map-item" id="background_pic_malmö" v-on:click="nextSection" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Malmö</h1>
        </figure>
      </div>
    </div>

  </section>


  <section class="create-the-questions-container theme" v-else-if="secondStage===false">
    <header class="header-create-prop">
      <h1>{{ pollId }}</h1>

    </header>
    <div class="create overview-left-side">
      <h1>Här ska överblicken av alternativen vara</h1>
      <div class="question-boxes">
        <div type="button" class="collapsible" v-on:click="expandAndCollapseBox">Open Question 1</div>
        <div class="content">
          <p>Här kommer information om frågan fram</p>
        </div>
      </div>
      <object data="/svg_files/addLocationQuestionButton-2/addLocationQuestionButton.svg">

      </object>
    </div>
    <div class="create lq-and-q theme" >
      <div class="location-question" v-if="createLocationQuestion">
        <div>
          {{ uiLabels.locationQuestion }}:<input type="text" v-model="locationQuestion">
        </div>
        <button v-on:click="addLocationQuestion">
          {{ uiLabels.addLocationQuestion }}
        </button>
        <div id="mapcontainer">
          <div id="map" v-on:click="setLocation">
            <div v-bind:style="{left: location.x-60 + 'px', top: location.y-60 + 'px'}" class="disable">
              <!--modifieras i x och y led för att nålen ska prickas rätt -->
              <object data="/svg_files/PinMap/Pin_Map.svg" type="image/svg+xml">

              </object>
            </div>
          </div>
        </div>

        <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
      </div>
    <div class="create theme" v-if="createMultipleChoiceQuestion">
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      <div class="question-multiple">
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



      </div>
      <div class="Answer-box-wrapper">
      <div class="answer-alternative-size-wrapper"   v-for="(_, i) in answers" v-bind:key="'answers'+i">
        <div id="Answer-Box-symbol-prop" >
        </div>
        <div class="Answer-Box-textarea"  >
          <input class="Answer-Box-textarea-prop"
                 placeholder="Answer">
        </div>

      <div class="Answer-Box-checkbox" >
        <input type="checkbox"
                class="Answer-Box-checkbox-prop
                animation_rubberband">
      </div>
      </div>
      </div>

    </div>
      <div class="lowerside">
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
        <button>  <router-link class="routerLink" v-bind:to="'/result/'+pollId">Check result</router-link></button>
      </div>
      </div>
    <div class=" create alternative-right-side">

      <h1>Här ska vi ha knappar med lite rolig funktionalitet</h1>
      <div type="button" class="collapsible" v-on:click="expandAndCollapseBox">Add new question</div>
      <div class="content">
        <button v-on:click="showLocationQuestion">Location question</button>
        <button v-on:click="showMultipleQuestion">Multiple choice question</button>
      </div>
      <div>
        <button v-on:click="addAnswer">
          {{ uiLabels.addAnswer}}
        </button>
        <button v-on:click="deleteAnswer">
          {{ uiLabels.deleteAnswer }}
        </button>
        <button v-on:click="addQuestion">
          Add question
        </button>
      </div>
      <!-- <button v-on:click="showLocationQuestion">Location question</button>
      <button v-on:click="showMultipleQuestion">Multiple choice question</button> -->
    </div>
 <!-- <button type="button" v-on:click="addLocation">
    Confirm Correct Location
  </button>-->

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
      question: [""],
      answers: ["", ""],
      finalAnswers:[],
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
      secondStage: true,
      index:0,
      finalQuestion:[],
      finalCorrect:[]
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
      socket.emit("addQuestion",{pollId: this.pollId, q: this.finalQuestion, a: this.finalAnswers, correct: this.finalCorrect,lq: this.locationQuestion, location: this.location,image: this.imgUrl})
      console.log(this.finalQuestion)
      /*this.finalQuestion=[]
      this.finalAnswers=[]
      this.finalCorrect=[]*/
    },
    addQuestion: function () {
      var index= this.index
      var newAnswer={[index]:this.answers}
      this.finalAnswers.push(newAnswer)
      var newQuestion={[index]:this.question}
      this.finalQuestion.push(newQuestion)
      var newCorrect={[index]:this.checkBox}
      this.finalCorrect.push(newCorrect)
      console.log(this.finalQuestion)
      this.index+=1
      this.answers=["",""]
      this.question=""
      this.checkBox=[false,false]
    },
    addAnswer: function () {
      if (this.answers.length <= 3) {
        this.answers.push("");
        this.checkBox.push(false);
      }
    },
    deleteAnswer: function () {
      if (this.answers.length >= 3) {
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
    expandAndCollapseBox: function () {
      var coll = document.getElementsByClassName("collapsible");
      var i;

      for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
          this.classList.toggle("active");
          var content = this.nextElementSibling;
          if (content.style.maxHeight) {
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
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
  },

}
</script>
<style>


.create-the-questions-container {
  display: flex;
  background-color: #1682a8;
  height: 99vh;
}

.create {
  height: 99vh;

}

.overview-left-side {
  border-radius: 5% 5% 5% 5%;
  background-color: rgba(255, 255, 255, 0.54);
  flex-basis: 15%;
  justify-content: space-evenly;


}

.lq-and-q {

  justify-content: space-evenly;
  flex-basis: 70%;



}


.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
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
  border: none







}

.Answer-Box-checkbox-prop{
  height: 100%;
   -webkit-transform: scale(2);
  transform: scale(2);
border-radius: 5px;
}


.alternative-right-side {
  border-radius: 5% 5% 5% 5%;
  background-color: rgba(255, 255, 255, 0.54);
  justify-content: space-evenly;
  flex-basis: 15%;



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


.Answer-box-wrapper{
  padding-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px 40px;
  justify-content: center;
  height: 40vh;
}
.collapsible {
  background-color: rgba(67, 140, 111, 0.58);
  color: #444;
  text-align: center;
  cursor: pointer;
  padding: 18px;
  border-width:thin;
  border-color: #444444;
  overflow: hidden;
 border-radius: 10%;
  text-align: left;
  outline: none;
  font-size: 15px;
}

.active, .collapsible:hover {
  background-color: rgba(61, 133, 104, 0.38);
}

.content {
  margin-right: 2%;
  margin-left:2% ;
  margin-bottom: 2%;
  border-radius: 10%;
  background-color: white;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}
.header-create-prop{
  height: 10vh;
}

.lowerside {
  display: block;
}

.disable {
  pointer-events: none;
}

.disable {
  pointer-events: none;
}


.city_name_charachter_spec {
  font-family: sans-serif;
  text-align: center;
  font-weight: bold;
}

.textbox {
  font-size: large;
  font-weight: bold;
  padding: 1.25rem;
  margin: 5px;
  background: #ffffff;
  opacity: 90%;
  outline: black;
  border: 2px;
  border-radius: 15px;
  transition: border-color .5s;
}

textbox:hover {

}
.answer-alternative-size-wrapper {
  display: flex;
  justify-content: space-evenly;
  align-content: center;
  wrap: flex;
  border: solid 2px ;
  border-color: rgba(82, 77, 77, 0.55);
  background-color: white;
  height:60%;
  width: 35%;
  min-width: 35%;
  border-radius: 10px ;
  color: #444;


}
#Answer-Box-symbol-prop {
  column-width: 40px;
  background-color: rgba(6, 236, 4, 0.73);
  border-radius: 7px 0px 0px 7px ;
  height: 100%;
  width: 20%;
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
  grid-gap: 5px;
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

#background_pic_uppsala {
  background-image: url("https://www.liveit.se/images/std/uppsala-lan.jpg");
  background-size: cover;
  background-position: center;
}

#background_pic_stockholm {
  background-image: url("https://media.istockphoto.com/photos/old-town-in-stockholm-sweden-picture-id521418487?k=20&m=521418487&s=612x612&w=0&h=w820j5TprwQZer-NQhlrJ17c6UT-LFPDXQe3M7jqdks=");
  background-size: cover;
  background-position: center;
}

#background_pic_sundsvall {
  background-image: url("https://www.energi.se/siteassets/artiklar/2020-6/nyheter/sundsvall-219.jpg?w=1440&h=0&quality=100&format=jpg&mode=crop");
  background-size: cover;
  background-position: center;
}

#background_pic_västerås {
  background-image: url("https://www.happydays.nu/storage/img/hotels/stemning/6999/gen/good-morning-vasteras-20.jpg?1601458565 ");
  background-size: cover;
  background-position: center;
}

#background_pic_göteborg {
  background-image: url("https://goteborgco.se/wp-content/uploads/2019/12/tradgardsforeningen_167-11-2048x947.jpg");
  background-size: cover;
  background-position: center;

}

#background_pic_malmö {
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

#slider {
  height: 8px;
  outline: none
}

#selector {
  height: 104px;
  width: 50px;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;

}

#selectbutton {
  height: 48px;
  width: 48px;
  border-radius: 50%;
  position: absolute;
  bottom: 0px;
  background: black;
  color: white;
  border-radius: 10px;
  width: 20px;
  height: 20px;
  text-align: center;

}

#mapcontainer {
  width: 95%;
  max-width: 600px;
  max-height: 450px;
  height: 100%;
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
