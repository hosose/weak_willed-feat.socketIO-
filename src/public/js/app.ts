const socket = io();

const welcome: any = document.getElementById('welcome');
const form: any = welcome?.querySelector('#roomName');
const room: any = document.getElementById('room');
const nameForm = welcome.querySelector('#name');
const save: any = document.getElementById('save');
const saved: any = document.getElementById('saved');

room.hidden = true;
save.hidden = false;
saved.hidden = true;

let roomName: any;

function addMessage(message: any) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event: any) {
  event.preventDefault();
  const input: any = room?.querySelector('#msg input');
  const value = input.value; //이렇게 하면 비동기 처리를 하지 않고도 값이 채팅창에 잘 나온다
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`Me: ${value}`);
  });
  input.value = '';
  /*
  setTimeout(() => {
    input.value = '';
  }, 10);
  */
}

function handleNicknameSubmit(event: any) {
  save.hidden = true;
  saved.hidden = false;
  event.preventDefault();
  const input: any = welcome?.querySelector('#name input');
  socket.emit('nickname', input.value);
  setTimeout(() => {
    save.hidden = false;
    saved.hidden = true;
  }, 1500); //저장이 되었는지 안되었는지 보여주기 위해...
}

function showRoom(newCount: number) {
  room.hidden = false;
  welcome.hidden = true;
  const h2 = room?.querySelector('h2');
  h2.innerText = `Room: ${roomName}`;
  const h3 = room?.querySelector('h3');
  h3.innerText = `Number of People: ${newCount}`;
  const roomForm = room.querySelector('#msg');
  roomForm.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(event: any) {
  event.preventDefault();
  const input: any = form?.querySelector('input');
  socket.emit(
    'enter_room',
    input.value,
    showRoom //함수를 보내려면 마지막에 작성해야함
  );
  roomName = input.value;

  input.value = '';
}

form?.addEventListener('submit', handleRoomSubmit);
nameForm.addEventListener('submit', handleNicknameSubmit);

socket.on('welcome', (user: any, newCount: number) => {
  addMessage(`${user} joined`);
  const h3 = room?.querySelector('h3');
  h3.innerText = `Number of People: ${newCount}`;
});
socket.on('bye', (user: any, newCount: number) => {
  addMessage(`${user} left`);
  const h3 = room?.querySelector('h3');
  h3.innerText = `Number of People: ${newCount}`;
});
socket.on('new_message', addMessage);
socket.on('room_change', (rooms: any[]) => {
  let roomList = welcome.querySelector('ul');
  roomList.innerText = '';
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement('li');
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
