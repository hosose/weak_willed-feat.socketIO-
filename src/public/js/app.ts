const socket = io();

const welcome: any = document.getElementById('welcome');
const form: any = welcome?.querySelector('form');
const room: any = document.getElementById('room');

room.hidden = true;

let roomName: any;

function addMessage(message: any) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event: any) {
  event.preventDefault();
  const input: any = room?.querySelector('input');
  const value = input.value; //이렇게 하면 비동기 처리를 하지 않고도 값이 채팅창에 잘 나온다
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${value}`);
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
  const h3 = room?.querySelector('h3');
  h3.innerText = `Room: ${roomName}`;
  const roomForm = room.querySelector('form');
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

socket.on('welcome', () => {
  addMessage('Someon join!');
});
socket.on('bye', () => {
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
