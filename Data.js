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

Data.prototype.createPoll = function (pollId, lang = "en") {
    if (typeof this.polls[pollId] === "undefined") {
        let poll = {};
        poll.lang = lang;
        poll.questions = [];
        poll.answers = [];
        poll.locationAnswer = [];
        poll.correct = [];
        poll.currentQuestion = 0;
        poll.questionSequence = [];
        poll.currentLocationQuestion = 0;
        poll.locations = [];
        this.polls[pollId] = poll;
        console.log("poll created", pollId, poll);
    }
    return this.polls[pollId];
}

Data.prototype.addQuestion = function (pollId, q) {
    const poll = this.polls[pollId];
    console.log("question added to", pollId, q);
    if (typeof poll !== 'undefined') {

        poll.questionSequence.push(q)

    }
}
/*Data.prototype.addLocationQuestion = function (pollId, lq) {
    const poll = this.polls[pollId];
    console.log("locationquestion added to", pollId, lq)
    if (typeof poll !== 'undefined') {
        poll.locations.push(lq)


    }
}*/

Data.prototype.getLocations = function (pollId, qId = null) {
    const poll = this.polls[pollId];
    console.log("question requested for location ", pollId, qId)
    if (typeof poll !== 'undefined') {
        if (qId !== null) {
            poll.currentLocationQuestion = qId;

        }

        if (poll.locations[poll.currentLocationQuestion] !== undefined) {
            return poll.locations[poll.currentLocationQuestion];
        } else {

            return {}
        }


    }

}


Data.prototype.getQuestion = function (pollId, qId = null) {
    const poll = this.polls[pollId];
    console.log("question requested for normal ", pollId, qId);
    if (typeof poll !== 'undefined') {
        if (qId !== null) {
            poll.currentQuestion = qId;
        }
        console.log(poll.questionSequence[poll.currentQuestion])

        if (poll.questionSequence[poll.currentQuestion] !== undefined) {
            return poll.questionSequence[poll.currentQuestion];
        } else {

            return []
        }

    }

}

Data.prototype.submitAnswer = function (pollId, answer) {
    const poll = this.polls[pollId];
    console.log("answer submitted for ", pollId, answer);
    if (typeof poll !== 'undefined') {
        let answers = poll.answers[poll.currentQuestion];
        if (typeof answers !== 'object') {
            answers = {};
            answers[answer] = 1;
            poll.answers.push(answers);
        } else if (typeof answers[answer] === 'undefined')
            answers[answer] = 1;
        else
            answers[answer] += 1
        console.log("answers looks like ", answers, typeof answers);
    }
}
Data.prototype.submitLocationAnswer = function (pollId, answer) {
    const poll = this.polls[pollId];
    console.log("answer submitted for ", pollId, answer);
    if (typeof poll !== 'undefined') {
        poll.locationAnswer.push(answer)

    }
}
Data.prototype.getAnswers = function (pollId) {
    const poll = this.polls[pollId];
    if (typeof poll !== 'undefined') {
        const answers = poll.answers[poll.currentQuestion]
        console.log("hej",answers)

        if (typeof poll.questionSequence[poll.currentQuestion] !== 'undefined') {

            return {q: poll.questionSequence[poll.currentQuestion].q, a: answers};
        }
    }
    return {}
}
Data.prototype.getLocationAnswers = function (pollId) {
    const poll = this.polls[pollId];
    if (typeof poll !== 'undefined') {

        if (typeof poll.questionSequence[poll.currentQuestion] !== 'undefined') {

            return {lq: poll.questionSequence[poll.currentLocationQuestion].lq, la:poll.locationAnswer};
        }
    }
    return {}
}
module.exports = Data;