var robot = require("robotjs");
var ip = require("ip");
var IPS = ip.address()+":8080";
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require("path");

robot.setMouseDelay(0);

io.on('connection', function(socket) {
  socket.on('exec',function(cmd){
    exec(cmd);
  });

  socket.on('text',function(text){
    robot.typeString(text);
    robot.keyTap("enter");
  });

  socket.on('click',function(state){
    if(state>1)
      robot.mouseClick('right');
    else
      robot.mouseClick();
  });

  socket.on('mouse_move',function(vel){
    var mouse = robot.getMousePos();
    robot.moveMouse(mouse.x + vel.x,mouse.y + vel.y);
  });

  socket.on('log',function(data){
    console.log(data);
  });

});

app.use(express.static('public'));
app.get("/",function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});
server.listen(8080, function() {
  console.log("Servidor corriendo en http://"+IPS);
});

function exec(cmd){
  robot.keyTap(cmd);
  console.log(cmd);
  return 0;
}
