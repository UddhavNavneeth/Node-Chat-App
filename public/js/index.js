let socket = io();

socket.on('connect', function() {
    console.log('connected to the server');
});

socket.on('disconnect', function() {
    console.log('disconnected from the server');
});

socket.on('newMessage', function(newMessage) {
    console.log(newMessage);

    var li = $('<li></li>');
    li.text(`${newMessage.from}: ${newMessage.text}`);

    $('#messages').append(li);
});

socket.on('newLocationMessage', function(newMessage) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My Current Location</a>');

    li.text(`${newMessage.from}: `);
    a.attr(`href`, newMessage.url);
    li.append(a);//adding the address to our list variable of this event
    $('#messages').append(li);//adding our list variable of this event 
                            //to the message board visible on screen
});

socket.on('welcomeMessage', function(welcomeMessage) {
    console.log(welcomeMessage);
})

socket.on('joiningMessage', function(joiningMessage) {
    console.log(joiningMessage);
})

$('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    }, function() {

    });

    //to clear the textfield after pressing send
    $('#message-form').trigger('reset');
});

var locationButton = $('#send-location');
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('geolocation is not available on this browser');
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function() {

        });
    }, function () {
        return alert('Unable to fetch your location');
    });
});



