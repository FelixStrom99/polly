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
        poll.mapView = {};
        poll.users = [];
        poll.newGame = true
        this.polls[pollId] = poll;
        console.log("poll created", pollId, poll);
    }
    return this.polls[pollId];
}

Data.prototype.checkGameStatus = function (pollId) {
    const poll = this.polls[pollId]
    if (typeof poll === 'undefined') {
        return {pollStatus: false, newGame: false, id: pollId}
    } else {
        return {pollStatus: true, newGame: poll.newGame, id: pollId}
    }
}

Data.prototype.startGame = function (pollId) {
    this.polls[pollId].newGame = false
}
Data.prototype.checkIfNewGame = function (pollId) {
    const poll = this.polls[pollId]
    if (typeof poll !== 'undefined') {
        return poll.newGame
    } else {
        return true
    }
}

Data.prototype.addQuestion = function (pollId, q) {
    const poll = this.polls[pollId];
    console.log("question added to", pollId, q);
    if (typeof poll !== 'undefined') {
        poll.questionSequence.push(q)
    }
}
Data.prototype.addToUsers = function (pollId, d) {
    const poll = this.polls[pollId];
    if (typeof poll !== 'undefined') {

        poll.users.push(d)

    }
    console.log("User added to", pollId,poll.users);
}
Data.prototype.setZoom = function (pollId, d) {
    const poll = this.polls[pollId];
    console.log("zoom set to", pollId, d)
    if (typeof poll !== 'undefined') {

        poll.mapView = d

    } else {
        poll.mapview = {zoom: 0, center: [0, 0]}
    }
}

Data.prototype.getZoom = function (pollId) {
    const poll = this.polls[pollId];
    if (typeof poll !== 'undefined') {
        return poll.mapView
    } else {
        return {}
    }

    //* return {lq: locations.lq, location: [locations.location.x, locations.location.y], image: locations.image};


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
Data.prototype.submitQuestions = function (pollId, questions) {
    const poll = this.polls[pollId];
    if (typeof poll !== 'undefined') {
            if (Array.isArray(poll.answers[poll.currentQuestion]) == false) {
                poll.answers.push([])
                for (let i = 0; i < questions.length; i++) {
                    let answer = {question:(questions[i]).q}
                    for (let index = 0; index < (questions[i].a).length; index++) {
                        answer[((questions[i]).a)[index]] = 0
                    }
                    poll.answers[poll.currentQuestion].push(answer)
                }
            console.log("answersfinal",poll.answers[poll.currentQuestion])
        }
    }
}
Data.prototype.submitAnswer = function (pollId, answer,title) {
    const poll = this.polls[pollId];
    console.log("answer submitted for ", pollId, answer);
    if (typeof poll !== 'undefined') {
        let answers = poll.answers[poll.currentQuestion];
            for (let i = 0; i < answers.length; i++) {
                if (answers[i].question == title && answers[i][answer] !=='undefined') {
                    answers[i][answer] += 1
                    break
                }
            }
        }
        console.log("answers looks like",poll.answers[poll.currentQuestion])
}


Data.prototype.submitLocationAnswer = function (pollId, answer) {
    const poll = this.polls[pollId];
    console.log("answer submitted for ", pollId, answer);
    if (typeof poll !== 'undefined') {

        if (typeof poll.locationAnswer[poll.currentQuestion] !== 'undefined') {
            (poll.locationAnswer[poll.currentQuestion]).push(answer)

        } else {
            poll.locationAnswer[poll.currentQuestion] = [];
            (poll.locationAnswer[poll.currentQuestion]).push(answer)

        }
    }
}
Data.prototype.getAnswers = function (pollId) {
    const poll = this.polls[pollId];
    if (typeof poll !== 'undefined') {
        const answers = poll.answers[poll.currentQuestion]
        if (typeof poll.questionSequence[poll.currentQuestion] !== 'undefined') {
            return {answers:answers,correct:(poll.questionSequence[poll.currentQuestion]).correct};
        }
    } else {
        return {}
    }
}
Data.prototype.getLocationAnswers = function (pollId) {
    const poll = this.polls[pollId];
    if (typeof poll !== 'undefined') {

        if (typeof poll.questionSequence[poll.currentQuestion] !== 'undefined') {

            return {lq: poll.questionSequence[poll.currentQuestion].lq, la: poll.locationAnswer[poll.currentQuestion]};
        }
    }
    return {}
}
Data.prototype.getUsers = function (pollId) {
    const poll = this.polls[pollId];
    if (typeof poll !== 'undefined') {

        if (typeof poll.users !== 'undefined') {
            return {users: poll.users};
        }
    }
    return {}
}
module.exports = Data;