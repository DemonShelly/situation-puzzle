$(function(){
	var socket = io();
	var $loginPage = $('.login')
	var $lobbyPage = $('.lobby')
	var $createPage = $('.create')
	var $chatPage = $('.chatroom')
	var $usernameInput = $('.usernameInput')
	var $questionTitle = $('.inputBox input')
	var $question = $('.inputBox textarea')
	var $keyQuestion = $('.keyQuestion')
	var $finalAnswer = $('#finalAnswer')
	var $inputMessage = $('.inputMessage')
	var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

	// 變數區
	var username,password,hasRoomId;
	var roomId,title,content,keyQuestion,finalAnswer,setter;
	var question,res;



// 觸發事件
	// 登入
 $loginPage.click(() => {
    $usernameInput.focus();
  });

 $(window).keydown(event => {
 	if(event.which === 13){
 		if($usernameInput!=='' && !username){
 			username = $usernameInput.val().trim();
 			socket.emit('setName',username)
 			changeToLobby()
 		}
 		else if(username){
 			sendQuestion();
 		}
 	}
 })
// 創聊天室
 $('.createBtn').click(event => {
 		$createPage.show();
 })

 $('#boxSubmit').click(event => {
 	if ($questionTitle!=='' && $question!=='' && $keyQuestion!=='') {
 		socket.emit('createRoom',{
 			roomId: randomId(6),
 			setter: username,
 			title: $questionTitle.val(),
 			content: $question.val(),
 			keyQuestion: [$('#key1').val(),$('#key2').val(),$('#key3').val()],
 			finalAnswer: $finalAnswer.val()
 		})

 		$createPage.fadeOut();
 		$createPage.off('click');
 	}
 	else{
 		alert('請填入謎題題目與內容')
 	}
 })

// 進入聊天室
$('body').on('click','.room>button',() => {
	 	var enterRoomId = $(event.target).parent().attr('id')
	 	socket.emit('enterRoom',{
	 		username: username,
	 		enterRoomId: enterRoomId 
	 	})
})
// 送出訊息
$(window).keydown(event => {
 	if(event.which === 13){
 		if($chatPage){
 			
 		}
 	}
 })

// 功能區
 function changeToLobby(){
 	if (username) {
      $loginPage.fadeOut();
      $lobbyPage.show();
      $loginPage.off('click');
    }
 }
 function changeToChatroom(){
 	if (username) {
 			$lobbyPage.fadeOut();
		 	$chatPage.show();
		 	$lobbyPage.off('click');
 	}
 }
 function createElement(data){
 		var element=$("<div></div>").addClass('roomName').text(data.title);
 		var author = $("<div></div>").addClass('roomAuthor').text(data.setter);
 		var btn = '<button>進入</button>';
 		var elementWrap = $("<div></div>").addClass('room').attr('id',data.roomId).append(element).append(author).append(btn); 
 		$(".roomWrap").append(elementWrap)	
 }

 function randomId(size){
 		var seed = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z',
		'a','b','c','d','e','f','g','h','i','j','k','m','n','p','Q','r','s','t','u','v','w','x','y','z',
		'1','2','3','4','5','6','7','8','9','0');//陣列
		var seedlength = seed.length;//陣列長度
		var createPassword = '';
		for (let i=0 ; i<size ; i++) {
			var j = Math.floor(Math.random()*seedlength);
			createPassword += seed[j];
		}
		return createPassword;
 }
 function showPuzzle(){

 }

 function isAuthor(username){

 }
 function sendQuestion(){
    var question = $inputMessage.val();
    // Prevent markup from being injected into the message
    question = cleanInput(question);
    if (question) {
      $inputMessage.val('');
      socket.emit('new question', {
      	username: username,
      	question: question,
      	res: null
      });
    }
  }
  function addNewQuestion(data){
  	var $usernameDiv = $('<span class="username"/>')
		  	.text(data.username)
		  	.css('color', getUsernameColor(data.username));
		var $questionBodyDiv = $('<span class="messageBody">')
      .text(data.question);
    var $questionDiv = $('<li class="message"/>')
      // .data('username', data.username)
      // .addClass()
      .append($usernameDiv, $questionBodyDiv);

      $('.messages').append($questionDiv)
  }

  const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }
  const getUsernameColor = (username) => {
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

// 監聽來自socket的事件
 socket.on('addNewRoom',(data) => {
 	// alert('add!:'+data)
 		createElement(data);

 })
 socket.on('showChatRoom',(data) => {	
	 	changeToChatroom();
	 	showPuzzle(data);
 })
socket.on('addNewQuestion',(data) => {
		addNewQuestion(data);
})

})