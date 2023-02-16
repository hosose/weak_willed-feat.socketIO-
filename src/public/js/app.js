"use strict";
var socket = io();
var welcome = document.getElementById('welcome');
var form = welcome === null || welcome === void 0 ? void 0 : welcome.querySelector('form');
var room = document.getElementById('room');
room.hidden = true;
var roomName;
function addMessage(message) {
    var ul = room.querySelector('ul');
    var li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
}
function handleMessageSubmit(event) {
    event.preventDefault();
    var input = room === null || room === void 0 ? void 0 : room.querySelector('input');
    var value = input.value; //이렇게 하면 비동기 처리를 하지 않고도 값이 채팅창에 잘 나온다
    socket.emit('new_message', input.value, roomName, function () {
        addMessage("You: ".concat(value));
    });
    input.value = '';
    /*
    setTimeout(() => {
      input.value = '';
    }, 10);
    */
}
function showRoom() {
    room.hidden = false;
    welcome.hidden = true;
    var h3 = room === null || room === void 0 ? void 0 : room.querySelector('h3');
    h3.innerText = "Room: ".concat(roomName);
    var roomForm = room.querySelector('form');
    roomForm.addEventListener('submit', handleMessageSubmit);
}
function handleRoomSubmit(event) {
    event.preventDefault();
    var input = form === null || form === void 0 ? void 0 : form.querySelector('input');
    socket.emit('enter_room', input.value, showRoom //함수를 보내려면 마지막에 작성해야함
    );
    roomName = input.value;
    input.value = '';
}
form === null || form === void 0 ? void 0 : form.addEventListener('submit', handleRoomSubmit);
socket.on('welcome', function () {
    addMessage('Someon join!');
});
socket.on('bye', function () {
    addMessage('Someon left!');
});
socket.on('new_message', addMessage);
/*
const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');

function makeMessage(type: string, payload: any) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener('open', () => {
  console.log('Connected to Server!');
});

socket.addEventListener('message', (message) => {
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList?.append(li);
});

socket.addEventListener('close', () => {
  console.log('Disconnected from Server!');
});

function handleMessageSubmit(event: any) {
  event.preventDefault();
  const input: any = messageForm?.querySelector('input');
  const data = makeMessage('newMessage', input.value);
  socket.send(data);
  input.value = '';
}

function handleNickSubmit(event: any) {
  event.preventDefault();
  const input: any = nickForm?.querySelector('input');
  const data = makeMessage('nickname', input.value);
  socket.send(data);
}

messageForm?.addEventListener('submit', handleMessageSubmit);
nickForm?.addEventListener('submit', handleNickSubmit);
*/
