const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
//middleware for geting all the static files
app.use(express.static(publicPath));
//io.on lets you register and handle a particular event
//connection event lets you know for new connection and do something
io.on('connection', (socket)=>{
    console.log("New user connected");
    socket.on('disconnect', (socket)=>{
        console.log("Client disconnected");
    });
    socket.on('join', (params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
           return callback("Name and room name are required");
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUsers(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app"));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage("Admin", `${params.name} has joined`));
        callback();
    });

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
    socket.on('disconnect', ()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage("Admin", `${user.name} has left`))
        }
    });
});

server.listen(port, ()=>{
    console.log(`Server is up at ${port}`);
});