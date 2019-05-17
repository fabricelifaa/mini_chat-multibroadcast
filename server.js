var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io')(server, {origins: "*:*"});

// when client connected
io.sockets.on('connection', function (socket, pseudo) {

    socket.broadcast.emit('broadcast', {message: 'Un autre client vient de se connecter ! '});

    socket.on('name', function(name){
     	socket.pseudo=name;
     });

    socket.on('msg', function (message) {
    	socket.broadcast.emit('new msg', {msg:message, name:socket.pseudo});
    });

    socket.on('disconnect', ()=>{
    	socket.broadcast.emit('user_left', {msg: socket.pseudo+" is deconnected"});
    });
    
});

server.listen(8080);
