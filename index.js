var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('retrieve-file', function () {
    console.log("HERe");
    retrieveContent(socket);
  });
});

var retrieveContent = function (socket) {
  var spawn = require('child_process').spawn;
  var process = spawn('cat', [ '.travis.yml' ]);
  console.log("HERE AS WELL");
  process.stdout.setEncoding('utf-8');
  process.stdout.on('data', function (data) {
    console.log(data);
    socket.emit('file-content', data);
  });
  process.stderr.setEncoding('utf-8');
  process.stderr.on('data', function (data) {
    socket.emit('error', data);
  });
};

http.listen(3000, function(){
  console.log('listening on *:3000');
});