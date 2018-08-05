var socket = io();
socket.on('connect',function(){
    console.log("connected to server");
});
socket.emit('createMessage',{
    "to" : "amy@gs.com",
    "text" : "hey how are you",
});
socket.on('disconnect',function(){
    console.log("disconnected from server");
});
socket.on('newMessage',function(email){
    console.log("Got new message", email);
});