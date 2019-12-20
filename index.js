var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.use(express.static(path.join(__dirname, 'src')));


// 暫時的變數
var chatRooms = [];
var newRoom;
var questions = [];

io.on('connection', (socket) => {

	socket.on('setName',(name)=>{
		socket.username = name
		console.log('username: '+socket.username)
	})

	// 創建聊天室
	socket.on('createRoom',(data)=>{
		// 在這裏把聊天室資料傳到資料庫
		newRoom = {
			roomId: data.roomId,
			setter: socket.username,
			title: data.title,
			content: data.content,
			keyQuestion: data.keyQuestion,
			finalAnswer: data.finalAnswer
		}
		// console.log(newRoom)
		chatRooms.push(newRoom)
		io.emit('addNewRoom',newRoom)
	})
	socket.on('enterRoom',(data)=>{
		socket.nowRoomId = data.enterRoomId
		socket.join(data.enterRoomId)
		socket.emit('showChatRoom',data)

	})
	socket.on('new question',(data)=>{
		// 在這裏把答題者的問題傳到資料庫
		questions.push(data)
		io.to(socket.nowRoomId).emit('addNewQuestion',data)
	})
})


