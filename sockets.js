function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });


  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang));
  });

  socket.on('addLocationQuestion', function(l){
    data.addLocationQuestion(l.pollId,{lq: l.lq, location: l.location, image: l.image} )
   //* socket.emit('dataUpdate',data.getLocations(l.pollId))
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a, correct: d.correct});
    socket.emit('dataUpdate', data.getLocationAnswers(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('newQuestion', data.getQuestion(pollId))
    socket.emit('dataUpdate', data.getAnswers(pollId))
    socket.emit('newLocationQuestion', data.getLocations(pollId));
    socket.emit('dataUpdate', data.getLocationAnswers(pollId))
  });

  socket.on('runQuestion', function(d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('runLocationQuestion', function(lq) {
    io.to(lq.pollId).emit('newLocationQuestion', data.getLocations(lq.pollId, lq.locationQuestionNumber));
 /*   io.to(lq.pollId).emit('dataUpdate', data.getAnswers(lq.pollId));*/
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitLocationAnswer', function(d) {
    data.submitLocationAnswer(d.pollId, d.locationAnswer);
    io.to(d.pollId).emit('locationDataUpdate', data.getLocationAnswers(d.pollId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  })
 
}

module.exports = sockets;