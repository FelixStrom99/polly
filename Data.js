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
        poll.correctLocation=[]
        poll.mapView={};
        poll.users = [];
        this.polls[pollId] = poll;
        console.log("poll created", pollId, poll);
    }
    return this.polls[pollId];
}

Data.prototype.addQuestion = function (pollId, q) {
    const poll = this.polls[pollId];
    console.log("question added to", pollId, q, "Här kommer questions arrayen", poll.questions);
    if (typeof poll !== 'undefined') {

        poll.questionSequence.push(q)
        poll.correctLocation.push(q.location)
      //*  poll.locations.push(q.lq)


    }
}
Data.prototype.addToUsers = function (pollId, d) {
    const poll = this.polls[pollId];
    if (typeof poll !== 'undefined') {

        poll.users.push(d)

    }
    console.log("User added to", pollId, "Här kommer Userarrayen", poll.users);
}
Data.prototype.setZoom = function (pollId, d) {
    const poll = this.polls[pollId];
    console.log("zoom set to", pollId, d)
    if (typeof poll !== 'undefined') {

        poll.mapView=d
        console.log("glöggkrök",poll.mapView)

    }
    else{
        poll.mapview={zoom:0,center:[0,0]}
    }
}

Data.prototype.getZoom = function (pollId) {
    const poll = this.polls[pollId];
    if (typeof poll !== 'undefined') {
        return poll.mapView
    }
    else {
        return {}
        }

        //* return {lq: locations.lq, location: [locations.location.x, locations.location.y], image: locations.image};


}

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

            return {lq: poll.questionSequence[poll.currentLocationQuestion].lq, la:poll.locationAnswer, correct:poll.correctLocation[poll.currentQuestion]};
        }
    }
    return {}
}
Data.prototype.getUsers = function (pollId) {
    const poll = this.polls[pollId];
    if (typeof poll !== 'undefined') {

        if (typeof poll.users !== 'undefined') {
            console.log("Hämtad")
            return {users: poll.users, lang: poll.lang};
        }
    }
    return {}
}
module.exports = Data;