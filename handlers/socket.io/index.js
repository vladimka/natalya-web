const debug = require('debug')('natalya:socket');
const { Brains, InitializationError } = require('../../brains/core');
let natalya;

try{
    natalya = new Brains();
}catch(err){
    if(err instanceof InitializationError){
        debug(err.message);
        process.exit(-1);
    }
}

let connections = 0;
module.exports = socket => {
    connections++;
    socket.id = connections;
    natalya.addSession(socket.id);
    debug('Новый сокет №%i', connections);

    socket.on('natalya-getsid', () => socket.emit('natalya-sid', socket.id));
    socket.on('natalya-query', data => socket.emit('natalya-answer', { text : natalya.getAnswer(data) }));

    socket.on('disconnect', () => {
        debug('Сокет №%i отключился', socket.id);
        natalya.removeSession(socket.id);
        connections--;
    });
}