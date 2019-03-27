var express = require('express');
var app = express();
var fs = require('fs');

var server = require('http').Server(app)
server.listen(2100, console.log('app lang nghe port 2100'));


var io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.set('views', './views');

var roomList = {};

app.get('/', function (req, res) {
    console.log('get /');
    res.sendFile(__dirname + '/index.html');
});

app.get('/callWebRTC', (req, res) => {
    res.render('callWebRTC')
})


var ArraySocketIdUsername = [];
var ArraySocketId = [];
var ArraySocketIdOn = [];
var NameArrayMess = [];
var ArrMessSendServer = [];

var ArrPeerId = [];

var sockets = {};
var users = {};
function sendTo(connection, message) {
    connection.send(message);
}
///

function socketIdsInRoom(name) {
    var socketIds = io.nsps['/'].adapter.rooms[name];
    if (socketIds) {
        var collection = [];
        for (var key in socketIds) {
            collection.push(key);
        }
        return collection;
    } else {
        return [];
    }
}

io.on('connection', function (socket) {
    console.log('socket.id',socket.id);

    socket.on('client-send-sdp',dataSdp=>{
        console.log('dataSdp::::',dataSdp);
        io.sockets.emit('server-send-sdp',dataSdp);
    })

    socket.on('exchange', data => {
        console.log('data exchange', data);
        //  io1.sockets.emit('leave',socket.id);

        var sdp = data.sdp;
        var from = socket.id;
        var videoURL = data.videoURL;
        var x = { sdp, 'from': from, 'videoURL': videoURL };

        io.sockets.emit('exchange', x);
        console.log('v exchange v exchange', x);
    })

    socket.on('join', data => {
        console.log('data join', data);
    })

    socket.on('exchange-Answer', datastream => {
        console.log('exchange-Answer exchange-Answer exchange-Answer exchange-Answer', datastream);

        io.sockets.emit('exchange-Answer', datastream);
    })



    socket.on('stream', image => {
        //  console.log('data tream :', image.length);
        io.sockets.emit('stream', image);
    });

    socket.on('Reactjs-stream', dataStream1 => {
        console.log('data dataStream1 dataStream1 :', dataStream1.UserAnswn);
        console.log('ArraySocketIdUsername c', ArraySocketIdUsername);
        //guitoi socket.id cua thang UserAnswn
        //UserAnswn
        var dataIma = dataStream1.dataIma;
        var UserAnswn = dataStream1.UserAnswn;
        var UserCall = dataStream1.UserCall;
        //timsocketid thoa man
        var ArrSocKetIdUserAnswn = [];
        ArraySocketIdUsername.map((value, index) => {
            var Username = value.Username;
            if (UserAnswn.indexOf(Username) > -1) {
                var socketIdUserAnswn = value.UserSocketId;
                var SocketIdAnswn = socketIdUserAnswn.replace(Username, '');
                ArrSocKetIdUserAnswn.push(SocketIdAnswn);
            }
        });
        console.log('ArrSocKetIdUserAnswn:::::React-stream', ArrSocKetIdUserAnswn);
        ArrSocKetIdUserAnswn.map(function (socketId, index) {
            io.to(socketId).emit('Reactjs-stream', dataIma);
            // io1.sockets.emit('Reactjs-stream', dataIma);
            // console.log('image socket.on 3333333dataIma', dataIma);

        })

    });

    socket.on('NGUOI_DUNG_DANG_KY_STREAM_PREE', dataStream => {
        console.log('dataStream::::', dataStream);
        ArrPeerId.push(dataStream);

        io.sockets.emit('DANH-SACH-USER-PEER', ArrPeerId);

    });


    socket.on('client-send-Username', dataUser => {
       
        // var dataUser = {Username: User, peerId: id}
        ArraySocketIdUsername.push({
            UserSocketId: socket.id + dataUser.Username,
            Username: dataUser.Username,
            peerId: dataUser.peerId
        });
        console.log('io1...ArraySocketUsername:::', ArraySocketIdUsername);
        console.log('io1...ArraySocketUsernam.length:::', ArraySocketIdUsername.length);
       io.sockets.emit('server-send-socket.id+Username', ArraySocketIdUsername);

        /*
        var ArrMess = [];
        if (NameArrayMess[0] !== null && NameArrayMess.leng >= 1) {

            fs.writeFile(path, NameArrayMess, (err) => {
                if (err) {
                    console.log('err NameArrayMess file ton nhan offline khong duoc luu', NameArrayMess);
                }
                else {
                    console.log('datluu tinnhan oflline tai duong dan', path);
                }

            });
            var path = __dirname + "/public/MessengerOffline/" + Username + ".docx";
            NameArrayMess.map(function (dataEmit, index) {
                var UsernameNguoiNhan = dataEmit.UsernameNguoiNhan;
                if (UsernameNguoiNhan.indexOf(Username) > -1) {
                    //push phan tu thoa nam vao de gui di cho messenger co Username = UsernameNguoiNhan
                    ArrMess.push(dataEmit); //tuong ung vi tri index trong mang NameArrayMess
                    //dong thoi coa phan tu ay di trong NameArrayMess (chua tat ca cac messenger da guo xoung ma khong co socketId cua ng Nguoinhan)
                    NameArrayMess.splice(index, 1); //xoa 1 phan tu o vi tri thu index; neu Username connect != UsernameNguoiNhan thi ArrMess = []
                }
            });
            fs.writeFile(path, NameArrayMess, (err) => {
                if (err) {
                    console.log('err NameArrayMess file ton nhan offline khong duoc luu', NameArrayMess);
                }
                else {
                    console.log('datluu tinnhan oflline tai duong dan', path);
                }
            })
            //tim trong ArraySocketIdUsername ma co socketId +Username co chua Usermane 
            // ArraySocketIdUsername.push({ UserSocketId: socket.id + Username, Username: Username });
            var ArrsocketIdMesNhanThoaMan = [];
            ArraySocketIdUsername.map(function (value, index) {
                var UserSocketId = value.UserSocketId;
                if (UserSocketId.indexOf(Username) > -1) {
                    var socketId = UserSocketId.replace(Username, '');
                    ArrsocketIdMesNhanThoaMan.push(socketId);
                }
            })
            //emit len cho client nhan tin nhan , mang emit len co the la mang [], [ 1phanTu ], [ 1phanTu, 2phanTu, ...., n phanTu]
            ArrsocketIdMesNhanThoaMan.map(function (socketId) {
                io1.to(socketId).emit('server-send-messenger', ArrMess);
                console.log('SEVER SEND MESSENGER NGAY khi CONGUOI KET NOI THOA MAN client-send-Username ArrMess', ArrMess);
            });
            


        }

        io.sockets.emit('server-send-socket.id+Username', ArraySocketIdUsername);
        var ArraySocketIdUsername1 = JSON.stringify(ArraySocketIdUsername);
        fs.writeFile(__dirname + "/public/ArraySocketIdUsername/" + "ArraySocketIdUsername.docx", ArraySocketIdUsername1, (err) => {
            if (err) {
                //   console.log(' writeFile ArraySocketIdUsername:::', err);
            } else {
                //  console.log('luu ArraySocketIdUsername succefully');
            }

        });
        */

    });

    socket.on('disconnect', (data) => {
        //   console.log('io1..data disconnect::::', data);
        //  console.log('io1..socket.id data disconnect', socket.id);
        io.sockets.emit('socketId-da-disconnect', socket.id);
        var socketIdDis = socket.id;
        //  console.log('io1..disconnect:::', ArraySocketIdUsername);
        //o day ta ca nhat lai luon socketId = Username cung duoc;
        // ArraySocketIdUsername.push({ UserSocketId: socket.id + Username, Username: Username });
        console.log('io1...socket.id disconnect', socketIdDis);
        ArraySocketIdUsername.map(function (value, index) {
            //neu nhu socketIdDis chuoi nay so sanh lan luot voi UserSocketId
            //co phan tu nao trong UserSocketId nao ma giong socketIdDis thi la phan tu do can loai bo 
            if (value.UserSocketId.indexOf(socketIdDis) > -1) {
                //ArraySocketIdUsername can loai bo UserSocketId thoa nam dk if
                //loai bo phantu thu index lan thu tu cua UserSocketId trong mang ArraySocketIdUsername
                ArraySocketIdUsername.splice(index, 1); // loai bo phan tu thu index trong
            }
        });

        console.log('ArraySocketIdUsername: NEW sau khi-da-disconnect:::', ArraySocketIdUsername);
        //ArraySocketIdUsername khong can gui client app hoac server chi bo no di vi sau khi run lai ap no se 
        //cap nhat 1 socket.id + Username ma Ta se gui no o phan socket.on('client-send-Username', Username
    });




    /*
    console.log('connection', socket.id);
    socket.on('disconnect', function () {
        console.log('disconnect');
        if (socket.room) {
            var room = socket.room;
            io.to(room).emit('leave', socket.id);
            socket.leave(room);
        }
    });

    socket.on('join', function (name, callback) {
        console.log('join', name);
        var socketIds = socketIdsInRoom(name);
        callback(socketIds);
        socket.join(name);
        socket.room = name;
    });


    socket.on('exchange', function (data) {
        console.log('exchange', data);
        data.from = socket.id;
        var to = io.sockets.connected[data.to];
        to.emit('exchange', data);
    });

    */



});