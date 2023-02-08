let clientID = setInterval(function () {
  if (NetworkIsSessionStarted()) { // When the user has loaded in to the server, shift the queue
      emitNet('qbQueue:shiftQueue');
      clearInterval(clientID);
  }
}, 500)