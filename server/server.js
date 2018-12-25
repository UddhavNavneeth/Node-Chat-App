const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const {generateMessage, generateLocationMessage} = require('./utils/message');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

const port = process.env.PORT || 3000

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');
    
    socket.emit('welcomeMessage', 'Welcome to the chat app');

    socket.broadcast.emit('joiningMessage', 'New user has joined');

    socket.on('createMessage', (message, callback) => {
        console.log('new Message:', message);


        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords, callback) => {
        
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
        callback();
    })


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    

})

server.listen(port, () => {
    console.log(`Server is up on port: ${port}`);
});