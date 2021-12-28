<template>

  <section v-if="firstStage===true && secondStage===true">
    <div id="wrapper-pollID-header">
      <h1 id="enter-pollID-header"> {{ uiLabels.createPoll }}</h1>
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
      <div class="map-item" id="background_pic_uppsala" v-on:click="nextSection();chooseUppsala()" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Uppsala</h1>
        </figure>
      </div>

      <div class="map-item"
           id="background_pic_stockholm"
           v-on:click="nextSection();chooseStockholm();" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Stockholm</h1>
        </figure>
      </div>


      <div class="map-item" id="background_pic_sundsvall" v-on:click="nextSection();chooseSundsvall();" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Sundsvall</h1>
        </figure>
      </div>

      <div class="map-item" id="background_pic_västerås" v-on:click="nextSection();chooseVästerås()" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Västerås</h1>
        </figure>
      </div>

      <div class="map-item" id="background_pic_göteborg" v-on:click="nextSection();chooseGöteborg()" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Göteborg</h1>
        </figure>
      </div>

      <div class="map-item" id="background_pic_malmö" v-on:click="nextSection();chooseWorld()" style="cursor: pointer;">
        <figure>
          <h1 class="city_name_charachter_spec">Välj fritt</h1>
        </figure>
      </div>
    </div>

  </section>


  <section class="create-the-questions-container theme" v-else-if="secondStage===false && firstStage===false">
    <div class="create overview-left-side">
      <h1>Här ska överblicken av alternativen vara</h1>
      <div class="question-boxes" v-for="(_,i) in questionSequence" v-bind:key="'boxes'+i">
        <div type="button" class="collapsible" v-on:click="expandAndCollapseBox(i)"  >{{questionSequence[i][3]}}</div>
        <div class="content"> <!--{{"Fråga "+(i+1)}}  v-bind:placeholder="'Fråga '+(i+1)"-->
          <div class="content-mq" v-for="(_,j) in questionSequence[i][0]" v-bind:key="'answers'+j">
            <button class="content-mq-button" v-on:click="showMultipleQuestion(j)">{{"Fråga "+(j+1)}}</button>
          </div>
          <button v-on:click="addNewMultipleQuestion(i,j)">Add Question</button>
          <button v-on:click="deleteMultipleQuestion">Delete question</button>
        </div>
      </div>
      <div id="add-locationQuestion-button" v-on:click="addNewPollQuestion" style="cursor: pointer;">

        <object data="/svg_files/addLocationQuestionButton-2/addLocationQuestionButton.svg" style="pointer-events:none;">

        </object>

      </div>
    </div>
    <div class="create lq-and-q" >
      <h1>{{ pollId }}</h1>
      <div class="location-question" v-if="createLocationQuestion">
        <div>
          {{ uiLabels.locationQuestion }}:<input type="text" placeholder="Enter question..." v-model="locationQuestion">
        </div>
        <button v-on:click="editQuestion(this.currentLQ, null)">save</button>
        <div id="openlayers-map">
          <MapContainerCreate :geojson="geojson"
            v-on:location="location=$event" v-bind:mapView="mapView">
          </MapContainerCreate>
        </div>
      </div>

      <div class="create theme" v-if="createMultipleChoiceQuestion">
        {{ uiLabels.question }}:
        <input type="text" placeholder="Enter question..." v-model="question">
        <button v-on:click="editQuestion(this.currentLQ, currentMQ)">save</button>
        <div class="question-multiple">
          {{ uiLabels.answers}}:
          <div class="Answer-box-wrapper">
          <div class="answer-alternative-size-wrapper" v-for="(_, i) in answers" v-bind:key="'answers'+i">
            <div id="Answer-Box-symbol-prop" :style="checkBox[i] ? { 'background-color': 'rgba(6, 236, 4, 0.73)' } : null">
            </div>
            <div class="Answer-Box-textarea"  >
              <input class="Answer-Box-textarea-prop"
                     v-model="answers[i]" v-bind:placeholder="'Alternative '+(i+1)">
            </div>
            <div class="Answer-Box-checkbox" >
              <input type="checkbox"
                     class="Answer-Box-checkbox-prop
                            animation_rubberband"
                     v-model="checkBox[i]"
                     v-bind:key="'checkBox'+i">

            </div>
          </div>
        </div>
          {{questionSequence}}
        </div>
      </div>
      <div class="lowerside">
        <div>

          <button v-on:click="finishQuizFinal()">
     {{uiLabels.finishQuiz}}
          </button>

        </div>
      </div>
    </div>
    <div class=" create alternative-right-side">
      <h1>Här ska vi ha knappar med lite rolig funktionalitet</h1>
      <div class="location-question-settings" v-if="createLocationQuestion">
        <h2>Settings LQ</h2>
        <button>Do some cool stuff</button>
      </div>
      <div class="multiple-choice-question-settings" v-if="createMultipleChoiceQuestion">
        <h2>Settings MQ</h2>
        <button v-on:click="addAnswer">
          {{ uiLabels.addAnswer}}
        </button>
        <button v-on:click="deleteAnswer">
          {{ uiLabels.deleteAnswer }}
        </button>
      </div>
      <div>
        <h2>Overall Settings</h2>
        <h3>Timer settings</h3>
        <button>Ändra sånndär duration boom</button>
        <br>
        <br>
        <button v-on:click="finishQuizFinal">
          {{uiLabels.finishQuiz}}
        </button>
      </div>
    </div>


  </section>


  <section v-if="secondStage===false && firstStage===true">
  <h1>här kör hosten quizet jappi</h1>
    <p>Här är ditt PollID: {{this.pollId}}</p>
    <div>
      <button v-on:click="runQuestion">
        Run Selected Question
      </button>
      <button v-on:click="goBackEdit">
        Go back to editing
      </button>
      <button>  <router-link class="routerLink" v-bind:to="'/result/'+pollId">Check result</router-link></button>
    </div>
    {{currentLQ}}
  <div id="run-question-wrapper">
    <div class="run-question waitingroom">
      <h3>Users connected</h3>
      {{this.userList}}
      <div id="run-question-users" v-for="(u,i) in userList.users" v-bind:key="'user'+i" style="  color: white;font-size:20px;">
        <p>{{u}}</p>
      </div>
    </div>
    <div class="run-question box">
      <h3>Run questions</h3>
      <div id="run-question-item" v-for="(_,i) in questionSequence" v-bind:key="'question'+i">
        <div v-on:click="currentLQ=i; this.previewQuestion()">{{questionSequence[i][3]}} </div>
      </div>
    </div>
    <div class="run-question preview">
      <h3>Preview of question</h3>
      {{this.isPreviewQuestion}}
      <div v-if="isPreviewQuestion" id="preview-question">
        {{questionSequence[currentLQ][3]}}
        <div v-for="(ans,i) in questionSequence[currentLQ][0]" v-bind:key="'ans'+i">
          {{ans}}
        </div>
      </div>
    </div>

  </div>
</section>


</template>

<script>
import io from 'socket.io-client';
import MapContainerCreate from "../components/MapContainerCreate";

const socket = io();

export default {
  name: 'Create',
  components: {
    MapContainerCreate,
  },
  data: function () {
    return {
      lang: "",
      pollId: "",
      title: "",
      question: [""],
      answers: ["", ""],
      finalAnswers: [],
      checkBox: [false, false],
      locationQuestion: "",
      location: {
        x: 0,
        y: 0
      },
      createLocationQuestion: true,
      createMultipleChoiceQuestion: false,
      data: {},
      uiLabels: {},
      range_from_location: "",
      firstStage: true,
      secondStage: true,
      currentLQ: 0,
      currentMQ: 0,
      indexArray: [],
      pollQuestionIndex: 0,
      multipleChoiceQuestions: [],
      finalQuestion: [],
      finalCorrect: [],
      mapView: {
        zoom: 0,
        center: [0, 0]
      },
      questionSequence: [],
      userList: [],
      isPreviewQuestion: false,
    }
  },
  created: function () {
    this.lang = this.$route.params.lang;

    this.addNewPollQuestion()
    socket.emit("pageLoaded", {lang: this.lang, id: this.pollId});
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) =>
        this.data = data
    )
    socket.on("pollCreated", (data) =>
        this.data = data)

    socket.on("userUpdate",(user) =>{
      this.userList=user
  } )
  },

  methods: {

    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang})
      this.firstStage = false
    },
    showQuestion: function (firstIndex, secondIndex) {
      if (secondIndex !== null) {
        var title = this.questionSequence[firstIndex][0][secondIndex][secondIndex]
        var answers = this.questionSequence[firstIndex][1][secondIndex][secondIndex]
        var correct = this.questionSequence[firstIndex][2][secondIndex][secondIndex]
        this.answers = answers
        this.question = title
        this.checkBox = correct
      } else {
        this.locationQuestion = this.questionSequence[firstIndex][3]
        this.location.x = this.questionSequence[firstIndex][4].x
        this.location.y = this.questionSequence[firstIndex][4].y
      }
    },
    editQuestion: function (firstIndex, secondIndex) {
      if (secondIndex !== null) {
        this.questionSequence[firstIndex][0][secondIndex][secondIndex] = this.question
        this.questionSequence[firstIndex][1][secondIndex][secondIndex] = this.answers
        this.questionSequence[firstIndex][2][secondIndex][secondIndex] = this.checkBox
      } else {
        this.questionSequence[firstIndex][3] = this.locationQuestion
        this.questionSequence[firstIndex][4].x = this.location.x
        this.questionSequence[firstIndex][4].y = this.location.y
      }
    },

    addNewPollQuestion: function () {
      var newQuestion = []
      this.indexArray.push([0])
      this.finalQuestion.push([])
      this.finalAnswers.push([])
      this.finalCorrect.push([])
      newQuestion.push(this.finalQuestion[this.pollQuestionIndex])
      newQuestion.push(this.finalAnswers[this.pollQuestionIndex])
      newQuestion.push(this.finalCorrect[this.pollQuestionIndex])
      newQuestion.push(this.locationQuestion = this.uiLabels.newQuestion)
      newQuestion.push(this.location = {
        x: 0,
        y: 0

      })
      this.questionSequence.push(newQuestion)
      this.pollQuestionIndex += 1
    },
    nextSection: function () {
      this.secondStage = false
    },
    goBackEdit: function (){
      this.firstStage = false
      this.secondStage = false
    },
    finishQuizFinal: function () {
      console.log("här kommer det")
      this.firstStage = true
      this.currentLQ=0
      for (var i = 0; i <= this.questionSequence.length; i++) {

        socket.emit("addQuestion", {
          pollId: this.pollId,
          q: this.questionSequence[i][0],
          a: this.questionSequence[i][1],
          correct: this.questionSequence[i][2],
          lq: this.questionSequence[i][3],
          location: this.questionSequence[i][4]
        })
      }

    },



    addNewMultipleQuestion: function () {
      var index = this.indexArray[this.currentLQ]
      var newAnswer = {[index]: ["", ""]}
      this.finalAnswers[this.currentLQ].push(newAnswer)
      var newQuestion = {[index]: ""}
      this.finalQuestion[this.currentLQ].push(newQuestion)
      var newCorrect = {[index]: [false, false]}
      this.finalCorrect[this.currentLQ].push(newCorrect)
      this.indexArray[this.currentLQ][0] += 1
      this.fixMaxHeightCollapse()
      this.questionSequence.length
      this.showMultipleQuestion(this.questionSequence[this.currentLQ][0].length-1)
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
    deleteMultipleQuestion: function () {
      this.finalAnswers[this.currentLQ].pop();
      this.finalQuestion[this.currentLQ].pop()
      this.finalCorrect[this.currentLQ].pop()
      if (this.indexArray[this.currentLQ][0]>0) {
        this.indexArray[this.currentLQ][0] -= 1
      }
    },
    showLocationQuestion: function () {
      this.createLocationQuestion = true;
      this.createMultipleChoiceQuestion = false;
      this.showQuestion(this.currentLQ, null)

    },
    showMultipleQuestion: function (j) {
      this.currentMQ = j
      this.createLocationQuestion = false;
      this.createMultipleChoiceQuestion = true;
      this.showQuestion(this.currentLQ, this.currentMQ)

    },
    expandAndCollapseBox: function (imp) {
      this.currentLQ = imp
      this.showLocationQuestion()
      var coll = document.getElementsByClassName("collapsible");
      var content
      var j
      for (j = 0; j < coll.length; j++) {
        content = coll[j].nextElementSibling;
        if (j != this.currentLQ) {
          content.style.maxHeight = null;
          coll[j].classList.remove("active");
        }
      }
      coll[imp].classList.toggle("active");
      content = coll[imp].nextElementSibling;
      if (content.style.maxHeight && !this.currentLQ) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + 20 + "px";
      }
    },
    previewQuestion: function () {
      this.isPreviewQuestion = true;

    },
    fixMaxHeightCollapse: function () {
      var coll = document.getElementsByClassName("collapsible");
      var content = coll[this.currentLQ].nextElementSibling
      content.style.maxHeight = content.scrollHeight + 20 + "px";
    },

    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.currentLQ})
    },

    chooseUppsala: function () {
      this.mapView.zoom = 14;
      this.mapView.center = [1962289.773825233, 8368555.335845293]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})
    },
    chooseStockholm: function () {
      this.mapView.zoom = 14;
      this.mapView.center = [2011404.65, 8250860.71]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})
    },
    chooseSundsvall: function () {
      this.mapView.zoom = 14;
      this.mapView.center = [1924771.41, 8951774.11]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})
    },
    chooseVästerås: function () {
      this.mapView.zoom = 14;
      this.mapView.center = [1841990.10, 8314049.85]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})
    },
    chooseGöteborg: function () {
      this.mapView.zoom = 14;
      this.mapView.center = [1332333.15, 7906034.63]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})
    },
    chooseWorld: function () {
      this.mapView.zoom = 0;
      this.mapView.center = [0, 0]
      socket.emit("mapView", {pollId: this.pollId, zoom: this.mapView.zoom, center: this.mapView.center})


    }
  }
}

</script>
<style>
/* Put everything in alphabetical order */

/* General for create*/

/* Section PollID */
#enter-pollID-header {
  font-size: 500%;
  color: white;
  text-shadow: 5px 5px 5px black;
  margin-bottom: 1em;
}

/* Section Choose map */


/* Section Create quiz */
.create {
  height: 99vh;
}

.create-the-questions-container {
  display: flex;
  height: 100vh;
  width: 100%;
}
/* Section Create quiz // Left Bar */
.overview-left-side {
  background-color: rgba(255, 255, 255, 0.54);
  flex-basis: 15%;
  justify-content: space-evenly;
}

/* Section Create quiz // Middle */
.lq-and-q {
  justify-content: space-evenly;
  flex-basis: 70%;
  clear:both
}
/* Section Create quiz // Right Bar */

/* Section Host View */



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

#add-locationQuestion-button{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 35%;
  display: flex;
  justify-content: space-evenly;
}
#add-locationQuestion-button:hover {
  background-color: rgba(248, 248, 248, 0.44);
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
  border-radius: 0 0 10% 10%;
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
  text-shadow: 0 0 4px white;
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
  background-color: red;
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
  background-image: url("https://as1.ftcdn.net/v2/jpg/00/67/55/82/1000_F_67558277_XSMpXHfJjW1hSddFXevf2lCmhlme6OVU.jpg");
  background-size: cover;
  background-position: center;
}


#openlayers-map {
  position: relative;
  height: 30em;
  width: 99%;
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
#run-question-wrapper {
  display: flex;
  justify-content: center;
  min-height: 50em;
  height:auto;
}
.run-question {
  background-color: #1682a8;
  height: 50vh;
  border-style: solid;
  border-width: thick;
  border-color: lightgreen;
  border-radius: 10px;
  padding: 2em;
}
.run-question box {
   min-width: 30%;

 }
.run-question waitingroom {
  width: 15%;
}
#preview-question {
  background-color: white;
  color: black;
  min-height: 10em;
  border-radius: 7px;
}
 #run-question-item {
   width: 100%;
   background-color: orange;
   margin: 1em;
 }
#run-question-item:hover, selected {
  cursor: pointer;
  background-color: mediumpurple;
}

   /*background-color: rgba(34, 76, 182, 0.58);
   color: #fcf8f8;
   text-align: center;
   cursor: pointer;
   padding: 18px;
   border-width:thin;
   border-color: #444444;
   overflow: hidden;
   border-radius: 10%;
   text-align: left;
   outline: none;
   font-size: 15px;*/
 #waitingroom-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 50em;
  }
#waitingroom-item {
  background-color: #1682a8;
  height: 50vh;
  width: 30%;
  border-style: solid;
  border-width: thick;
  border-color: lightgreen;
  border-radius: 10px;
  padding: 2em;
}

.routerLink {
  text-decoration: none;
}

</style>