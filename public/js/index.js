var socket = io();
socket.on('connect',function(){
    console.log("connected to server");
});
socket.on('disconnect',function(){
    console.log("disconnected from server");
});
socket.on('newMessage',function(message){
    console.log("Got new message", message);
    var li = jQuery('<li></li>');
    li.text(`${message.from} : ${message.text}`);
    jQuery('#messages').append(li);
});
socket.on('newLocationMessage',function(message){
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="blank">My current Location</a>');
    li.text(`${message.from} : `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery("#message-form").on('submit',function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from :"User",
        text : jQuery("[name=message]").val()
    }, function(){

    });
});

var locationButton = jQuery("#send-location");
locationButton.on('click', function(event){
    if(!navigator.geolocation){
        alert('Geolocation not supported by your browser');
        return;
    }
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });
    }, function(err){
        alert('Unable to fetch location');
    });
});