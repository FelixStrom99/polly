'use strict';

const languages = ["en", "se"];

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.getUILabels = function (lang = "en") {
  const ui = require("./data/labels-" + lang + ".json");
  return ui;
}

Data.prototype.createPoll = function(pollId, lang="en") {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.lang = lang;  
    poll.questions = [];
    poll.answers = [];
    poll.currentQuestion = 0;

    poll.locationQuestions = [];
    poll.currentLocationQuestion=0;
    poll.locations=[];
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
}

Data.prototype.addQuestion = function(pollId, q) {
  const poll = this.polls[pollId];
  console.log("question added to", pollId, q);
  if (typeof poll !== 'undefined') {
    poll.questions.push(q);
  }
}
Data.prototype.addLocationQuestion = function(pollId,lq){
  const poll = this.polls[pollId];
  console.log("locationquestion added to",pollId,lq)
  if (typeof poll !== 'undefined') {
  poll.locations.push(lq)
    console.log("vad är detta",poll.locations)
}}

Data.prototype.getLocations = function(pollId) {
  const poll = this.polls[pollId];
  console.log("question requested for location ", pollId)
  if (typeof poll !== 'undefined') {
    const locations = poll.locations[poll.currentLocationQuestion];
    console.log("crasha den på 1 ", locations)
    if (typeof locations !== 'undefined') {

      return {lq: locations.lq, location: [locations.location.x, locations.location.y]};

    }
    console.log(poll.locationQuestions[poll.currentLocationQuestion])
  }
  return {}
}
/*poll.locationQuestions[poll.currentLocationQuestion]*/
/*{lq: poll.locationQuestions[poll.currentLocationQuestion].lq, location: locations};*/

/*Data.prototype.getLocations = function(pollId,qId=null) {
  const poll = this.polls[pollId];
  console.log("question requested for location ", pollId, qId);
  if (typeof poll !== 'undefined') {
    if (qId !== null) {
      poll.currentLocationQuestion = qId;
    }
    console.log(poll.locationQuestions[poll.currentLocationQuestion])
      return poll.locationQuestions[poll.currentLocationQuestion];
  }
  return []
}*/

Data.prototype.getQuestion = function(pollId, qId=null) {
  const poll = this.polls[pollId];
  console.log("question requested for normal ", pollId, qId);
  if (typeof poll !== 'undefined') {
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    console.log(poll.questions[poll.currentQuestion])
    return poll.questions[poll.currentQuestion];

  }
  return []
}

Data.prototype.submitAnswer = function(pollId, answer) {
  const poll = this.polls[pollId];
  console.log("answer submitted for ", pollId, answer);
  if (typeof poll !== 'undefined') {
    let answers = poll.answers[poll.currentQuestion];
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    else if (typeof answers[answer] === 'undefined')
      answers[answer] = 1;
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
  }
}

Data.prototype.getAnswers = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return {q: poll.questions[poll.currentQuestion].q, a: answers};
    }
  }
  return {}
}
module.exports = Data;
