"use strict";
var socket = io();
var welcome = document.getElementById('welcome');
var form = welcome === null || welcome === void 0 ? void 0 : welcome.querySelector('#roomName');
var room = document.getElementById('room');
var nameForm = welcome.querySelector('#name');
var save = document.getElementById('save');
var saved = document.getElementById('saved');
room.hidden = true;
save.hidden = false;
saved.hidden = true;
var roomName;
function addMessage(message) {
    var ul = room.querySelector('ul');
    var li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
}
function handleMessageSubmit(event) {
    event.preventDefault();
    var input = room === null || room === void 0 ? void 0 : room.querySelector('#msg input');
    var value = input.value; //이렇게 하면 비동기 처리를 하지 않고도 값이 채팅창에 잘 나온다
    socket.emit('new_message', input.value, roomName, function () {
        addMessage("Me: ".concat(value));
    });
    input.value = '';
    /*
    setTimeout(() => {
      input.value = '';
    }, 10);
    */
}
function handleNicknameSubmit(event) {
    save.hidden = true;
    saved.hidden = false;
    event.preventDefault();
    var input = welcome === null || welcome === void 0 ? void 0 : welcome.querySelector('#name input');
    socket.emit('nickname', input.value);
    setTimeout(function () {
        save.hidden = false;
        saved.hidden = true;
    }, 1500); //저장이 되었는지 안되었는지 보여주기 위해...
}
function showRoom(newCount) {
    room.hidden = false;
    welcome.hidden = true;
    var h2 = room === null || room === void 0 ? void 0 : room.querySelector('h2');
    h2.innerText = "Room: ".concat(roomName);
    var h3 = room === null || room === void 0 ? void 0 : room.querySelector('h3');
    h3.innerText = "Number of People: ".concat(newCount);
    var roomForm = room.querySelector('#msg');
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
nameForm.addEventListener('submit', handleNicknameSubmit);
socket.on('welcome', function (user, newCount) {
    addMessage("".concat(user, " joined"));
    var h3 = room === null || room === void 0 ? void 0 : room.querySelector('h3');
    h3.innerText = "Number of People: ".concat(newCount);
});
socket.on('bye', function (user, newCount) {
    addMessage("".concat(user, " left"));
    var h3 = room === null || room === void 0 ? void 0 : room.querySelector('h3');
    h3.innerText = "Number of People: ".concat(newCount);
});
socket.on('new_message', addMessage);
socket.on('room_change', function (rooms) {
    var roomList = welcome.querySelector('ul');
    roomList.innerText = '';
    if (rooms.length === 0) {
        return;
    }
    rooms.forEach(function (room) {
        var li = document.createElement('li');
        li.innerText = room;
        roomList.append(li);
    });
});
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
