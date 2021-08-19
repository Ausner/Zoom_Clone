const Server = require('http');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    options: {
        cors: '*'
    }
});

const port = 3000;


//Socket io -> Cuando un dispositivo se conecta a socket io se pone a la escucha del evento 'join' que se encuentra en el front end
io.on('connection', (socket) => {
    socket.on('join', (data) => {
        const roomName = data.roomName;
        socket.join(roomName);
        socket.to(roomName).broadcast.emit('new-user', data);
        
        socket.on('disconnect', () => {
            socket.to(roomName).broadcast.emit('bye-user', data);
        })
    });
})

server.listen(port, () => {
    console.log('Server running on port 3000');
})


