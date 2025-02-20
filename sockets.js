function sockets(io, socket, data) {
    socket.emit('init', data.getUILabels());

    socket.on('pageLoaded', function (d) {
        socket.emit('init', data.getUILabels(d.lang));
    });

    socket.on('switchLanguage', function (lang) {
        socket.emit('init', data.getUILabels(lang));
    });

    socket.on('createPoll', function (d) {
        socket.emit('pollCreated', data.createPoll(d.pollId, d.lang));
    });
    socket.on('checkGame', function (d){
        socket.emit('gameChecked', data.checkGameStatus(d.id));
    });


    socket.on('addQuestion', function (d) {
        data.addQuestion(d.pollId, {q: d.q, a: d.a, correct: d.correct, lq: d.lq, location: d.location,timer:d.timer});
        socket.emit('dataUpdate', data.getLocationAnswers(d.pollId));
    });

    socket.on('startGame',function (d){
        data.startGame(d.pollId)
        io.to(d.pollId).emit('endWaitingRoom', null)
    });


    socket.on('joinPoll', function (pollId) {
        socket.join(pollId);
        socket.emit('checkIfNewGame', data.checkIfNewGame(pollId));
        socket.emit("userMapView", data.getZoom(pollId))
        socket.emit('newQuestion', data.getQuestion(pollId))
        socket.emit('locationDataUpdate', data.getLocationAnswers(pollId));
        socket.emit('dataUpdate', data.getAnswers(pollId))

    });
    socket.on('retrievePlayers', function (d) {
        socket.emit('playersUpdate', data.getUsers(d.pollId))
    })
    socket.on('addUser', function (d) {
        data.addToUsers(d.pollId, d.users);
        io.to(d.pollId).emit('userUpdate', data.getUsers(d.pollId))
    });
  socket.on('sendToResult', function (d) {
    io.to(d.pollId).emit('checkResult',true)
  });
    socket.on('sendToFinish', function (d) {
        io.to(d.pollId).emit('finishGame',true)
    });
    socket.on('runQuestion', function (d) {
        io.to(d.pollId).emit('sendToPoll',d.lang)
        io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    });
    socket.on('submitQuestions', function (d) {
        data.submitQuestions(d.pollId, d.questions);
       
    });

    socket.on('submitAnswer', function (d) {
        data.submitAnswer(d.pollId, d.answer,d.title);

    });

    socket.on('submitLocationAnswer', function (d) {
        data.submitLocationAnswer(d.pollId, d.locationAnswer);
        io.to(d.pollId).emit('locationDataUpdate', data.getLocationAnswers(d.pollId));
    });
    socket.on('mapView', function (d) {
        data.setZoom(d.pollId, {zoom: d.zoom, center: d.center});

    });

    socket.on('resetAll', () => {
        data = new Data();
        data.initializeData();
    })

}

module.exports = sockets;