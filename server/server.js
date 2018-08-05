const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

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
    //it is used to emmit an event. // first arguemnt event name second argurment data.
    socket.emit('newMessage',{
        "from" : "amy@gs.com",
        "text" : "hey how are you",
        "createdAt" : 1245
    });
    socket.on('createMessage', (newEmail)=>{
        console.log('create new message', newEmail);
    });
});
server.listen(port, ()=>{
    console.log(`Server is up at ${port}`);
});