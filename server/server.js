const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
//middleware for geting all the static files
app.use(express.static(publicPath));
//io.on lets you register and handle a particular event
//connection event lets you know for new connection and do something
io.on('connection', (socket)=>{
    console.log("New user connected");
    socket.on('disconnect', (socket)=>{
        console.log("Client disconnected");
    });
    socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app"));
    socket.broadcast.emit('newMessage',generateMessage("Admin", "New user joined"));

    socket.on('createMessage', (message, callback)=>{
         //it is used to emmit an event to all the connections. // first arguemnt event name second argurment data.
        io.emit('newMessage',generateMessage(message.from, message.text));
        callback();
        /* socket.broadcast.emit('newMessage',{
            from : message.from,
            text : message.text,
            createdAt : new Date().getTime()
        }); */
    });
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage("user", coords.latitude, coords.longitude));

    });
});

server.listen(port, ()=>{
    console.log(`Server is up at ${port}`);
});