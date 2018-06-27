
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var routes = require('./routes');
var board = require("./routes/board");
var http = require('http').createServer(app);
var path = require('path');
var io = require('socket.io').listen(http);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/public', board.public);

http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on("connection", function (socket) {  
  var cod_sala = null; //valor por defecto

  socket.on("login_sala", function(data){    
    cod_sala = data;
    socket.join(cod_sala);
    console.log("se ha unido a: "+cod_sala);
  });

  socket.on("path_client_server", function (data) {    	
    socket.broadcast.to(cod_sala).emit("path_server_client", data);
  });     

  socket.on("limpiar_client_server", function (data) {
    socket.broadcast.emit("limpiar_server_client", data);
  });     

  socket.on("chat_client_server", function (data) {
    io.sockets.in(cod_sala).emit("chat_server_client", data);
  });    
});
