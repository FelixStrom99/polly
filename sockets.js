function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (d) {
    socket.emit('init', data.getUILabels(d.lang));
    console.log("skickas dethär??")
  });


  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang));
  });


  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a, correct: d.correct,lq:d.lq,location:d.location});
    socket.emit('dataUpdate', data.getLocationAnswers(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('newQuestion', data.getQuestion(pollId))
    socket.emit("userMapView",data.getZoom(pollId))
    socket.emit('dataUpdate', data.getAnswers(pollId))
    socket.emit('locationDataUpdate', data.getLocationAnswers(pollId));
   /* socket.emit('dataUpdate', data.getLocationAnswers(pollId))*/

  });

  socket.on('addUser', function(d) {
  data.addToUsers(d.pollId, d.users);
    io.to(d.pollId).emit('userUpdate',data.getUsers(d.pollId))


  });


  socket.on('runQuestion', function(d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));

  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitLocationAnswer', function(d) {
    data.submitLocationAnswer(d.pollId, d.locationAnswer);
    io.to(d.pollId).emit('locationDataUpdate', data.getLocationAnswers(d.pollId));
  });
  socket.on('mapView', function(d) {
    data.setZoom(d.pollId, {zoom:d.zoom,center:d.center });
    //*io.to(d.pollId).emit('userMapView', d);

    /*   io.to(lq.pollId).emit('dataUpdate', data.getAnswers(lq.pollId));*/
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  })

}

module.exports = sockets;