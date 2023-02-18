import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
// import { WebSocketServer } from 'ws';
var app = express();
app.set('view engine', 'pug'); //setting용
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public')); //app.js의 함수들 실행
app.get('/', function (req, res) { return res.render('home'); }); //pug를 rendering
app.get('/*', function (req, res) { return res.redirect('/'); }); //redirect해주는 문장
var handleListen = function () { return console.log("Listening on http://127.0.0.1:3001"); };
var server = http.createServer(app); //http서버에 access
var io = new Server(server, {
    cors: {
        origin: ['https://admin.socket.io'],
        credentials: true,
    },
});
instrument(io, { auth: false });
function publicRooms() {
    var _a = io.sockets.adapter, sids = _a.sids, rooms = _a.rooms;
    var publicRooms = [];
    rooms.forEach(function (_, key) {
        if (sids.get(key) === undefined)
            publicRooms.push(key);
    });
    return publicRooms;
}
function countPeople(roomName) {
    var _a;
    return (_a = io.sockets.adapter.rooms.get(roomName)) === null || _a === void 0 ? void 0 : _a.size;
}
io.on('connection', function (socket) {
    socket['nickname'] = '알 수 없음';
    socket.onAny(function (event) { });
    io.sockets.emit('room_change', publicRooms());
    socket.on('enter_room', function (roomName, done) {
        //보내주는 변수들 모두 받을 수 있음 변수 갯수만 변경하면 됨
        socket.join(roomName);
        done(countPeople(roomName));
        socket.to(roomName).emit('welcome', socket.nickname, countPeople(roomName));
        io.sockets.emit('room_change', publicRooms());
    });
    socket.on('disconnecting', function () {
        socket.rooms.forEach(function (room) {
            return socket.to(room).emit('bye', socket.nickname, countPeople(room) - 1);
        });
    });
    socket.on('disconnect', function () {
        io.sockets.emit('room_change', publicRooms());
    });
    socket.on('new_message', function (msg, roomName, done) {
        socket.to(roomName).emit('new_message', "".concat(socket['nickname'], ": ").concat(msg));
        done();
    });
    socket.on('nickname', function (nickname) {
        socket['nickname'] = nickname;
    });
});
/*
const wss = new WebSocket.Server({ server }); // http 서버 위에 웹소켓 서버를 만들 수 있도록 함

const sockets: any[] = [];

wss.on('connection', (socket: any) => {
  sockets.push(socket);
  socket['nickname'] = '알 수 없음';
  console.log('Connected to Browser!');

  socket.on('close', () => {
    console.log('Disconnected from Client!');
  });

  socket.on('message', (message: string) => {
    const parsedMsg = JSON.parse(message);
    console.log(parsedMsg);

    switch (parsedMsg.type) {
      case 'newMessage':
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${parsedMsg.payload}`)
        );
        break;
      case 'nickname':
        socket['nickname'] = parsedMsg.payload;
        break;
    }
    //버퍼에러가 생겨서 변경 utf-8로
  });
  socket.send('채팅을 시작합니다!');
});
*/
server.listen(3001, handleListen);
