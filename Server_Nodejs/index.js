var express = require('express');
var app = express();
var path = require('path');
var Formidable = require('express-formidable');
var server = require('http').Server(app);
app.use(express.static('public')); // khai bao thu vien cho file duoi .js trong file ejs
app.use(express.static(path.join(__dirname, 'upload'))); //thu muc de chua thu vien cho anh trong file ejs hoac html
app.set('view engine', 'ejs'); //khai bao su dung ejs khi res.render
app.set('views', './views');




var fs = require('fs');
var jwt = require('jsonwebtoken');
var key = "secret_key_bao_mat";
//app.listen(3500, console.log('app-lang-nghe-port-2400-hotGirls'));
var pg = require('pg');
var config = {
    user: 'postgres',
    host: 'localhost',
    database: 'hotgirls',
    password: 'Postgres09898',
    port: 5432,
    max: 10,
    idletTimeoutMillis: 30000,
};
var pool = new pg.Pool(config);



server.listen(3500, console.log('server_start_port_3500-de-lang-nghe-socket.io-send-image-from-Web-to-App'));
var io = require('socket.io')(server);


app.get('/checkToken/:token', (req, res) => {
    var token = req.params.token;
    if (token == null) {
        res.render('login');
    }
    pool.connect((err, client, done) => {
        if (err) {
            return err;
        }
        var key = "secret_key_bao_mat";
        //gia ma token roi moi so sanh vao truy van database
        var userToken = jwt.verify(token, key);
        console.log('userToken:::', userToken);
        var username = userToken.Username;

        var qr = {
            text: 'SELECT * FROM "hotgrilscollection" WHERE "Username"=$1',
            values: [username],
        };
        console.log('qr::', qr);
        client.query(qr, function (err, result) {
            console.log('result::', result);
            if (err) {
                return err;
            }
            //lay ra dong thoa man dau tien trong so dong thoa man
            var user = result.rows[0];// phan tu thu0 cua mang la dong dau tien cua User THOA man
            var Username = user.Username; //lay ra Usename tu dong chu phan tu dau tien thoa man
            //tao token moi co chua thoi gian ton tai cua token
            var key = "secret_key_bao_mat";
            console.log('user:::', user);
            console.log('Username:::', Username);
            jwt.sign(Username, key, (err, token_new) => {
                console.log('token_new:::', token_new);
                var tokenjson = JSON.stringify({
                    token_new,
                    Username,
                });
                res.send(tokenjson);
            });
        });
    });
});



app.get('/', (req, res) => {
    //res.send('hello');
    res.send('chat');
});
//chat
app.get('/chat', (req, res) => {
    //res.send('hello');
    res.render('chat');
});

//upload file tu web sang server nodejs to App khai bao truoc upload file tu App len server nodejs va to web
//phan khaibao o app.listen(1500,...)
var bodyParser = require('body-parser');
//var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var multer = require('multer');


/*
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/my_upload') //noi luu file
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
        //cb(null, file.originalname); //ten file duoc luu
    }
});
*/
var storage = multer.memoryStorage(); //imgae chon tu web se duoc chuyen ve dang buffer
//single('avatar') chon 1  file duy nhat
var upload = multer({ storage: storage }).single('fileUpload'); // cau hinh upload

app.post('/photo', urlencodedParser, (req, res) => {

    //console.log('req::::::',req.file);
    upload(req, res, function (err) {
        if (err !== null) {
            // An unknown error occurred when uploading.
            // res.send('oke- da upload file');
            console.log('req.file::::::', req.file);
            console.log('req.file.filename:::', req.file.filename);
            console.log('req.file.buffer::::::', req.file.buffer);
            console.log('req.file.buffer.toStringbase64::', req.file.buffer.toString('base64')); //  req.file.buffer la dang buffer
            io.sockets.emit('server-send-imageBase64-fromweb-toAppAndWeb', { imageWebBase64: req.file.buffer.toString('base64') }); //chuyen sang base64 dung  req.file.buffer.toString('base64') 
            res.render('chat'); // load lai ejs chatSocketIO thi ben nay se k hen anh nhung doi tuong App va ng khac se nhan duoc base64
        } else {

            // A Multer error occurred when uploading.
            res.send('loi');
        }
        // Everything went fine.
    })
});

var des = "toidicode là trang web chuyên chia sẻ các tutorials về lập trình toidicode";
var position = des.indexOf('toidicode');
console.log('Vị trí của chuỗi toidicode trong des là: ' + position); //tra ve 0 nghia la ton tai khi tu trong mang hoac chuoi

var mang1 = ["Học", "lập", "trình", "tại", "freetuts.net"];  // Lấy phần tử  "freetuts.net"
var mang_moi = mang1.slice(4, 5);
console.log('mang_moi:::', mang_moi);


//filter :Tạo một mảng mới dựa trên các items từ bảng cũ qua một số điều kiện lọc nhất định:
// const studentsAge = [17, 16, 18, 19, 21, 17];
// const ableToDrink = studentsAge.filter( age => age > 18 );
// ableToDrink will be equal to [19, 21]

var mangUsername = [];
var mangSoketID = [];
var i = 30;

var mangUsSocket = [];
var j = 60;

var mangDSUsernamePhong = [];
var k = 90;

var l = 0;
//lang nghe

var n = 0;
io.on('connection', (socket) => {

    console.log('client-connected-port-3500-de chat:' + socket.id);

    socket.on('App-send-Username-la-phong-dai-dien-socket.phong-ca-nhan', usernamephong => {
        console.log('socket.adapter.rooms::', socket.adapter.rooms);
        socket.phong = usernamephong;
        socket.join(usernamephong);
        //   console.log('join(usernamephong):::',socket.join(usernamephong));
        for (r in socket.adapter.rooms) {
            mangDSUsernamePhong.push({ key: k = k + 1, phong: r });
            //  console.log('r;;;;',r);
            console.log('mangDSUsernamePhong', mangDSUsernamePhong);
        }
        io.sockets.emit('server-send-danhsach-usernamephong', mangDSUsernamePhong);
    });
    //lang nghe app nhan TouableOpacity app-send-socket.phong-ca-nhan
    socket.on('app-send-socket.phong-ca-nhan', phongCaNhan => {
        console.log('phongcanhan là', phongCaNhan);
        io.sockets.in(socket.phong).emit('server-send-phong-ca-nhan', phongCaNhan);
    });


    //lang nghe app send link uri image app-chatSocketID-send-uri-image
    socket.on('app-chatSocketUsername-send-uri-image', uriSkID => {
        console.log('uri tu image picker tren app send xuong::', uriSkID);
        //source1: source, socketUs: this.props.itemskID, dsSoketUsername: this.props.dsSoketUsername, Username: this.props.Username
        var ManguriSkID = [{ key: 2 * n + 3, source1: uriSkID.source1, skID1: uriSkID.socketUs, Username: uriSkID.Username }];
        socket.emit('server-tra-lai-uri-cho-app', [{ key: 2 * n + 1, skidApp: socket.id, source1: uriSkID.source1 }]); //truyen socket.id cua app tra lai anhr cho App
        console.log('mang uri tu image picker tren app send xuong::', [{ key: 2 * n + 1, skidApp: socket.id, source1: uriSkID.source1 }]);


        // indexOf() -Phương thức này trả về vị trí của từ xuất hiện đầu tiên trong chuỗi,
        // nếu trong chuỗi không có từ cần tìm thì nó sẽ trả về -1.
        /*
        var des = "toidicode là trang web chuyên chia sẻ các tutorials về lập trình toidicode";
        var position = des.indexOf('toidicode');
        alert('Vị trí của chuỗi toidicode trong des là: ' + position) = 0;
        */

        mangThoanManCoCungSocketUsername = [];
        uriSkID.dsSoketUsername.forEach(i => {
            // i.UsSoket = tung phan tu socket.id.Username  va uriSkID.Username = Username
            // indexOf la trong tung phan tu soket.id.Username thi cai phan tu Username co trong phan tu scket.id.Username thi =0 khong co thi =-1
            if ((i.UsSoket).indexOf(uriSkID.Username) > -1) { //  neu lon hon -1 tuc la =0 nghia la co phan tu thoa man maw trong socket.id.Username
                //kho do ta tach Username ra khoi socket.id.Username
                //bang cach dung replace 
                var UssocketID = i.UsSoket.replace(uriSkID.Username, '');
                //emit toi tat ca cac socket.id co cung 1 Username
                io.to(UssocketID).emit('server-send-URI-IMAGE-picker-Cho-client-co-CungUsername-socket.id.Username', ManguriSkID);
                console.log('ManguriSkID::::', ManguriSkID);
                mangThoanManCoCungSocketUsername.push(UssocketID);
                console.log('mangThoanManCoCungSocketUsername::::', mangThoanManCoCungSocketUsername);
            }
        });

        console.log('uriSkID.socketUs::::', uriSkID.socketUs);
        io.to(uriSkID.socketUs).emit('server-send-uri-image', ManguriSkID);
        console.log('ManguriSkID emit len web::::', ManguriSkID);
    });


    //lang nghe app-send-socket.username-va-messenger 
    //co the lang nghe web-send-socket.username-va-messenger 
    //la 1 lang nghe cung duoc nhung o day ta dung rieng voi cack khach
    //su soket.username duoc tich bang chon o danh sanh cho y phan tu trong danh
    //sach mang phai su ly
    socket.on('web-send-socket.username-va-messenger', messeUsernameWeb => {
        console.log('messeUsernameWeb::', messeUsernameWeb);
        messeUsernameWeb.danhSachSocketIDthoanMan.forEach(i => {
            io.to(i).emit('server-send-messageText-caNhan', messeUsernameWeb.msText);
        })
    })

    //lang nghe app-send-socket.username-va-messenger
    socket.on('app-send-socket.username-va-messenger', UsSoketApp => {
        console.log('ca nhan UsSoketApp la socket.Username', UsSoketApp);
        console.log('UsSoketApp.Username', UsSoketApp.Username);
        socket.emit('server-tra-ve-tin-nhan-cho-chinh-nguoi-gui', UsSoketApp);

        var xxxx = UsSoketApp.socketUs; // Xóa đi y ký tự bắt đầu tại vị trí x.
        var dsSoketUsername = UsSoketApp.dsSoketUsername;
        console.log('dsSoketUsername::::', dsSoketUsername); //hien thi dsSoketUsername co ca key va socketID
        var phantu1 = dsSoketUsername.slice(2, 3); //mang moi cua dsSoketUsername chi chua phan tu thu 2 

        mangUs = [];
        dsSoketUsername.forEach(i => {
            var UsSoket1 = i.UsSoket; //lay từng pân tử chưa UsSocket
            if (UsSoket1.indexOf(UsSoketApp.Username) > -1) { // thay the UsSoketApp.Username = Username_r//lây từng phân tử trong dsUsSoket1 mà có tồn tại ky tự Username_r
                // if( UsSoket1.indexOf('Username_r')>-1){ //lây từng phân tử trong dsUsSoket1 mà có tồn tại ky tự Username_r
                //nghia la se tra ve ket qua la 0 va > -1 thi phan tu do la duoc vao { su ly phan tử đó}
                //mangUs.push(UsSoket1);/ co the push ngay phan tu thoa mãn đó vao mảng 
                var UsSoket2 = UsSoket1.replace(UsSoketApp.Username, ''); //sủa từng phần tử thoản mãn bằng UsSoket1.replace(chuoicantim,chuoithaythe) ;
                //emit tới từng UsSocket emit lần lượt tới từng socketID có đuôi la Username_r
                io.to(UsSoket2).emit('server-send-socket.Username-rieng-da-TouchableOpacity-trong-appReact-native', UsSoketApp);
                //push vao nhung mang có chưa SocketID có chứa Username_r vi du IpKhij-X7JzSoPTDAAACUsername_r
                mangUs.push(UsSoket2);
            }

            console.log('mangUs:::::', mangUs);
        });

        //let arr = [1, 2, 3, 4, 5, 6] //<=> mangUs
        let even = []
        for (var i = 0; i < mangUs.length; i++) {
            if (mangUs[i] === 'IpKhij-X7JzSoPTDAAAClan') //mangUs[i] la 1 phan tu trong mang la 1 chuoi
                //can tach tiep tung ky tu trong chuoi ra so sanh tung ky tu do voi tuong ky tu trong chu
                //Uername_r co giong chu nao khong giong thi lay phan tu mang do va tao mang moi 

                even.push(mangUs[i]);
        }
        console.log('even:::', even);

        let even1 = mangUs.filter(item => { //item la tung phan tu trong mangUS
            return item === 'IpKhij-X7JzSoPTDAAAClan'; //kirem tra tung phan tu neu co phan tu nao giong 'IpKhij-X7JzSoPTDAAAClan' thi lay phan tu do cho vao mang
        });
        console.log('even1:::', even1);



        const mangThoanMan = mangUs.filter(age => age = 'IpKhij-X7JzSoPTDAAAClan');
        console.log('mangthoanam:::', mangThoanMan);

        console.log('phantu1::::', phantu1);


        var y = xxxx.replace('Username_r', ''); //
        console.log('y::::', y);
        console.log('xxxx.length::::', y.length);
        io.to(UsSoketApp.socketUs.replace('Username_r', '')).emit('server-send-socket.Username-rieng-da-TouchableOpacity-trong-appReact-native', UsSoketApp);
        console.log('UsSoketApp.socketUs.replace', UsSoketApp.socketUs.replace('Username_r', ''));
    });
    //tao mang hung usename tu tap thuoc tinh socket.username
    socket.on('App-send-Username-dai-dien-socket.Username-ca-nhan', us => {

        //   console.log('socket:::::::::', socket);
        //   console.log('socket.handshake.headers.cookie:::::::::', socket.handshake.headers.cookie);
        //   console.log('socket.nsp.sockets:::::::::', socket.nsp.sockets);

        var mangSockets = [];
        for (r in socket.nsp.sockets) {
            mangSockets.push(r);
            console.log('r:::::::', r);
            console.log('mangSockets:::::', mangSockets);
        }
        console.log('socket._events:::::::::', socket._events);

        console.log('us:::::::::', us);
        socket.us = us;
        console.log('socket.us:::::::::', socket.us);
        mangUsSocket.push({ key: j = j + 1, UsSoket: socket.id + socket.us, Username: socket.us });
        io.sockets.emit('server-send-socket.Username', mangUsSocket);
        console.log('mang socket.Username la:::::::::', mangUsSocket);
    });


    //lang nghe app send link uri image app-chatSocketID-send-uri-image
    socket.on('app-chatSocketID-send-uri-image', uriSkID => {
        console.log('uri tu image picker tren app send xuong::', uriSkID);
        var ManguriSkID = [{ key: 2 * n + 3, source1: uriSkID.source1, skID1: uriSkID.skID1 }];
        socket.emit('server-tra-lai-uri-cho-app', [{ key: 2 * n + 1, skidApp: socket.id, source1: uriSkID.source1 }]); //truyen socket.id cua app tra lai anhr cho App
        console.log('mang uri tu image picker tren app send xuong::', [{ key: 2 * n + 1, skidApp: socket.id, source1: uriSkID.source1 }]);
        console.log('uriSkID.skID1::::', uriSkID.skID1);
        io.to(uriSkID.skID1).emit('server-send-uri-image', ManguriSkID);
        console.log('ManguriSkID emit len web::::', ManguriSkID);
    });
    //lang nghe app nhan vao danh sach soketID 
    socket.on('App-send-socketID-ca-nhan', socketIDrieng => {
        //emit lat chinh cai app da emit socketID ca nhan de App do nhan duoc chinh cai tin nhan cua chinh socketid cua app do
        socket.emit('server-tra-ve-tin-nhan-cho-chinh-nguoi-gui', [{ key: l + 2, skidApp: socket.id, ms: socketIDrieng.messengerT }]);
        console.log('socketID rieng la: ' + socketIDrieng);
        console.log('socketIDrieng.skID1 rieng la: ' + socketIDrieng.skID1);
        console.log('socketIDrieng.messengerT rieng la: ' + socketIDrieng.messengerT);
        //emit chi ti cai socket.id da duoc nhan tren react-native app
        io.to(socketIDrieng.skID1).emit('server-send-socketID-Rieng', socketIDrieng);
    });

    //tao mang hung socketid
    // mangSoketID.push({ key: i = i + 1, skID: socket.id });
    mangSoketID.push({ key: i = i + 1, skID: socket.id });
    // console.log('socket::::', socket);
    console.log('mangsocktID::::', mangSoketID);
    //emit danh sach soket.ID
    io.sockets.emit('server-send-danhsach-socketID', mangSoketID);

    //socket.emit chi emit toi cai socket.id nao ket noi voi no emit socketid cua ban than cai app do co soket gi
    socket.emit('socketid-cua-ca-nhan-app-do-la-gi', socket.id);


    socket.on('app-from-web-database-client-send-base64', imgaWebDataBase => {
        //   console.log('imgaWebDataBase::::',imgaWebDataBase);
        io.sockets.emit('server-send-image-blob-fromWebDatabase-reactApp-toAppWeb', imgaWebDataBase);
    });
    // lang nghe cap nhat anh avatar
    socket.on('App-send-avata-to-server', avatarB64 => {
        //  console.log('avatar-base64 la:' + avatarB64);
        io.sockets.emit('server-send-avatar-fromApp-toAppWeb', avatarB64);
    });

    /*
    socket.on('web-send-messenger-chat-rooms', mesRooms => {
        //   console.log('messenger Rooms : ' + mesRooms);
        io.sockets.in(socket.phong).emit('server-send-messengerText-chat-rooms', { ms: mesRooms, un: socket.Username })
    });
    socket.on('tao-room-web', nameRoom => {
        var mang = [];
        //  console.log('Room::::',socket.adapter);
        //  console.log('Room::::',socket.adapter.rooms);
        socket.phong = nameRoom;
        socket.Username = nameRoom;
        socket.join(nameRoom);
        for (r in socket.adapter.rooms) {
            mang.push(r);
            console.log('r:::::', r);
        }
        console.log('mang:::::', mang);
        io.sockets.emit('server-send-danhsach-rooms', mang);
        socket.emit('server-send-romm', socket.phong);

    }); */

    socket.on('app-send-image-picker', imagePicker => {
        // imagePicker = {uri: 'data:image/jpeg;base64,' + base64}
        //   console.log("imagePicker::::" + imagePicker);
        io.sockets.emit('server-send-imagePK-fromApp-toAppWeb', imagePicker);

    })
    socket.on('app-send-messenger-text', MS => {
        //  console.log('messenger la : ' + MS);
        io.sockets.emit('server-send-messenger-from-app-to-AppAndWeb', { un: socket.id, ms: MS })
    })
    socket.on('web-send-messenger', (mstext) => {
        io.sockets.emit('server-send-messenger-from-web-to-AppAndWeb', { un: socket.Username, ms: mstext });
    });

    socket.on('web-send-dang-ky-user', user => {
        console.log('useename is: ' + user);
        if (mangUsername.indexOf(user) >= 0) {
            socket.emit('server-dangky-thatbai');
        } else {
            mangUsername.push(user);
            socket.Username = user;
            socket.emit('sever-send-username-thanhcong', user);
            console.log('socket.Username::::', socket.Username);
            console.log('mangUsername::::', mangUsername);
            io.sockets.emit('server-send-danhsach-Usernanme', mangUsername);
        }

    });
    socket.on('web-send-messenger-text', mesWeb => {
        //   console.log('messenger Web: ' + mesWeb);
        io.sockets.emit('server-send-from-mesWeb-toAppWeb', { ms: mesWeb, un: socket.Username });
    });
});

/*
//upload anh tu web
var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/my-upload');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

  //  var storage = multer.memoryStorage() 
 //   var upload = multer({ storage: storage })

var upload = multer({ storage: storage }).single('fileUpload');

app.get('/photo', (req, res) => {
    res.send('aaaaaaa');
});
app.post('/photo',urlencodedParser, (req, res) => {
    upload(req, res, function(err){
        if ( err !== null ) {
            "Co-loi khi upload file tu web len server"
        } else {
            console.log('da upload file thanh cong');
            console.log(req.file);
        }
     
        // Everything went fine.
      })
});
*/



//upload file tu App len server nodejs va to web
var express = require('express');
var app2 = express();
app2.listen(1500, console.log('app2-start-port 1500-upload-image-From-app-to-web'))

app2.use('/', express.static(path.join(__dirname, 'public')));

var Formidable = require('express-formidable');
app2.use(Formidable({
    uploadDir: './public/upload',
    encoding: 'utf-8',
}));

app2.post('/reactNative/Upload', (req, res) => {
    console.log('req.fields::::', req.fields); //truong l phai image hoac file 
    console.log('req.files::::', req.files);
    console.log('req.files.path::::', req.files.path);
    res.send('hello server http://192.168.216.2:1500/reactNative/Upload')
});



var express = require('express');
var app3 = express();
var fs = require('fs');

var bodyParser = require('body-parser');
var parser = bodyParser.urlencoded({ extended: false });

var jwt = require('jsonwebtoken');
var key = "secret_key_bao_mat";
app3.use(express.static("public"));
app3.set('view engine', 'ejs');
app3.set('views', './views');

//app3.listen(2400, console.log('app-lang-nghe-port-2400-hotGirls'));
var server1 = require('http').Server(app3);
server1.listen(2400, console.log('app3 server_start_port_2400-de--lang-nghe-socket.io-send-image-from-Web-to-App'));
var io1 = require('socket.io')(server1);


/*
var clients = [];
var  mang1 =[];
io1.sockets.on('connection', function (socket) {
  
    socket.on('storeClientInfo', function (data) {
        console.log('customId: "000CustomIdHere0000',data)
        var clientInfo = new Object();
        console.log('clientInfo:::',clientInfo);
        clientInfo.customId = data.customId;
        console.log('clientInfo:::',clientInfo);
        console.log('clientInfo.customId:::',clientInfo.customId);
        clientInfo.clientId = socket.id;
        console.log('clientInfo:::',clientInfo);
        clients.push(clientInfo);
        console.log('clients:.......mnag"clients',clients);
        mang1.push(socket.id);
        console.log('mang1:::',mang1);
    });
    socket.on('disconnect', function (data) {
        for (var i = 0, len = clients.length; i < len; ++i) {
            var c = clients[i];

            if (c.clientId == socket.id) {
                clients.splice(i, 1);
                break;
            }
        }

    });
});   */


var ArraySocketIdUsername = [];
var ArraySocketId = [];
var ArraySocketIdOn = [];
io1.on('connect', (socket) => {
    console.log("io1..client connect socket io1 :" + socket.id);
    ArraySocketId.push(socket.id);
    console.log('io1...ArraySocketId:::', ArraySocketId);
    console.log('io1..ArraySocketId.length:::', ArraySocketId.length);
    
    socket.on('client-send-Username', Username => {
        console.log('io1....Username client-send-Username',Username);
        console.log('io1...ArraySocketId:::', ArraySocketIdOn);
        console.log('io1...ArraySocketId.length:::', ArraySocketIdOn.length);

        ArraySocketIdUsername.push({ UserSocketId: socket.id + Username, Username: Username });
        console.log('io1...ArraySocketUsername:::', ArraySocketIdUsername);
        console.log('io1...ArraySocketUsernam.length:::', ArraySocketIdUsername.length);
     //   io1.sockets.emit('server-send-socket.id+Username', ArraySocketIdUsername);
        io1.sockets.emit('server-send-socket.id+Username', ArraySocketIdUsername);


    });

    socket.on('client-send-messenger', dataMessenger => {
        console.log('io1..client-send-messenger :' + dataMessenger);
        console.log('io1..UsernameNguoiNhan::', dataMessenger.UsernameNguoiNhan);
        console.log('io1..UsernameNguoiSend::', dataMessenger.UsernameNguoiSend);
        console.log('io1..DSsocketIdNguoiNhan::', dataMessenger.DSsocketIdNguoiNhan);
        console.log('io1..messenger::', dataMessenger.messenger);
        dataMessenger.DSsocketIdNguoiNhan.map(socketId => {
            io1.to(socketId).emit('server-send-messenger', {
                UsernameNguoiSend: dataMessenger.UsernameNguoiSend,
                UsernameNguoiNhan: dataMessenger.UsernameNguoiNhan,
                messenger: dataMessenger.messenger,
            });
        });

      /*  socket.on('client-xoa-Username', data=>{
            console.log('client-xoa-Username trong client-send-messenger', data);
            console.log(socket.id);
        }); */
    });

    socket.on('client-xoa-Username', socketIdUsernameNguoiSend=>{
        console.log('io1..client-xoa-Username', socketIdUsernameNguoiSend);
       var SocketIdUsernameDisconnet  = socketIdUsernameNguoiSend;
       
               //cap nhat lai cai mang ArraySocketUsername
               for (i=0; i< ArraySocketIdUsername.length; i++) {
                var x = ArraySocketIdUsername[i].UserSocketId;
                if (x == SocketIdUsernameDisconnet) {
                    //chi can tim ra so thu tu thu i nao can loai bo vi no disconnect
                    ArraySocketIdUsername.splice(i,1); // xoa 1 phan tu vi tri thu i
                    break ; //ket thuc cau lenh//Lệnh break thoát khỏi vòng lặp chứa nó o day la thoat khoi cong for
                } 
            }
            console.log('io1..ArraySocketIdUsername new cap nhat khi disconnectLL',ArraySocketIdUsername);
            console.log('io1..ArraySocketIdUsername new cap nhat khi disconnectLL',ArraySocketIdUsername.length);
    

    });

    socket.on('disconnect', (data)=>{
        console.log('io1..data disconnect::::',data);
        console.log('io1..socket.id data disconnect', socket.id);
        io1.sockets.emit('socketId-da-disconnect',socket.id )
        console.log('io1..ArraySocketId:::',ArraySocketId);
        socket.on('client-xoa-Username', data=>{
            console.log('io1..client-xoa-Username', data);
            console.log(socket.id);
        });

    });

    //servser lang nghe status cong khai tu client va emit toi tat ca cac client vi la public cong khai
    socket.on('client-share-status-public-congKhai', (dataStatus)=> {
        console.log('client-share-status-public-congKhai:::',dataStatus);
        io1.sockets.emit('server-share-status-public-congKhai',dataStatus);
    })
    

});





var pg = require('pg');

var config = {
    user: 'postgres',
    host: 'localhost',
    database: 'hotgirls',
    password: 'Postgres09898',
    port: 5432,
    max: 10,
    idletTimeoutMillis: 30000,
};

var pool = new pg.Pool(config)

//chay truy van 

app3.get('/chatCaNhan', (req, res) => {
    res.render('chatCaNhan');

})

app3.get('/status', (req, res)=> {
    res.render('status')
})

app3.get('/', (req, res) => {
    res.render('login');
});

app3.get('/dangnhap', (req, res) => {
    res.render('dangnhap');
});


app3.get('/checkToken/:token', (req, res) => {
    var token = req.params.token;
    pool.connect((err, client, done) => {
        if (err) {
            return err;
        }
        var key = "secret_key_bao_mat";
        //gia ma token roi moi so sanh vao truy van database
        var userToken = jwt.verify(token, key);
        console.log('userToken:::', userToken);
        var username = userToken.Username;
        var qr = {
            text: 'SELECT * FROM "hotgrilscollection" WHERE "Username"=$1',
            values: [username],
        };
        console.log('qr::', qr);
        client.query(qr, function (err, result) {
            console.log('result::', result);
            if (err) {
                return err;
            }
            //lay ra dong thoa man dau tien trong so dong thoa man
            var user = result.rows[0];// phan tu thu0 cua mang la dong dau tien cua User THOA man
            var Username = user.Username; //lay ra Usename tu dong chu phan tu dau tien thoa man
            //tao token moi co chua thoi gian ton tai cua token
            var key = "secret_key_bao_mat";
            console.log('user:::', user);
            console.log('Username:::', Username);
            jwt.sign(Username, key, (err, token_new) => {
                console.log('token_new:::', token_new);
                var tokenjson = JSON.stringify({
                    token_new,
                    Username,
                });
                res.send(tokenjson);
            });
        });
    });
});

app3.get('/home', (req, res) => {
    res.render('checkToken');
});

app3.get('/homeView', (req, res) => {
    res.render('home');
})


app3.get('/login/:Username/:Password', (req, res) => {
    var id = req.params.id;
    var Username = req.params.Username;
    var Password = req.params.Password;

    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('error login lient from pool', err);
        }

        var qr1 = 'SELECT id FROM "hotgrilscollection" WHERE "id"=' + id;

        //  var qr = {
        //      text: ' SELECT * FROM hotgrilscollection(id, "Hinh", "Like", "Dislike","Username","Passwrod") WHERE "Username" = $1 AND "Password" = $2 ',
        //      values: [17,'17.jpg','0','0',username, password],
        //  }


        /*
          var qr = {
              text: ' SELECT * FROM hotgrilscollection WHERE "Username" = $1 AND "Password" = $2 ',
              values: [username, password],
          } */
        var qr2 = 'SELECT * FROM "hotgrilscollection" WHERE "id" =' + id;

        var qr3 = {
            text: ' SELECT * FROM "hotgrilscollection" WHERE "id" = $1',
            values: [id],
        }

        var qr4 = {
            text: ' SELECT * FROM "hotgrilscollection" WHERE "Username" = $1',
            values: [Username],
        }

        var qr5 = {
            text: ' SELECT * FROM "hotgrilscollection" WHERE "Username" = $1 AND "Password" =$2 ',
            values: [Username, Password],
        }

        console.log('qr:::', qr5);
        client.query(qr5, function (err, result) {
            console.log(result);
            console.log('result.rows:::::', result.rows);
            var dataJSONstringify = JSON.stringify(result.rows);
            console.log('JSON.stringify(result.rows):::', dataJSONstringify);

            var user = result.rows[0]; //lay phan tu user thao man dautin
            console.log('user', user);


            done();
            if (err) {
                return console.log('error running query', err);
            }
            //  console.log('login succuffuly');
            //  res.render('chat');
            // res.end(dataJSONstringify);

            var key = "secret_key_bao_mat";

            /*
           var token = jwt.sign(user,key,{ expiresIn: 24 * 24 * 60 * 60 * 100 });
           var token_time = JSON.stringify({token: token});
           console.log('token_time',token_time);
           
           res.send(token_time); */

            jwt.sign(user, key, { expiresIn: 24 * 24 * 60 * 60 * 100 }, (err, token1) => {
                console.log('token:::', token1);
                var jsontoken = JSON.stringify({
                    token: token1,
                    user: user,
                });
                res.send(jsontoken);

            });



            //  res.render('hotgirls', {dataJSONstringify});
            //console.log(result.rows[0].Username);


            // if (result.rows[0]) {
            //   console.log(result.rows[0]);
            //  req.flash('warning', "This email address is already registered. < a href ='/login'>Log in!</a >");
            //  res.redirect('/join');
            //  } 
        });
    });
});

app3.get('/FreeSuper', (req, res) => {
    res.render('FreeSuper');
});

app3.get('/EditUser', (req, res) => {
    res.render('EditUser');
});

app3.post('/checklogin', parser, (req, res) => {
    var token = req.body.token;
    console.log('token edituser', token);
    var key = "secret_key_bao_mat";
    mangtoken = [];
    jwt.verify(token, key, (err, decoded) => {
        console.log('decoded:::', decoded);
        mangtoken.push(decoded);
    });
    var User = mangtoken[0];
    console.log('USER:::', User);
    res.send(User.Username);

});

app3.post('/changPassword', parser, (req, res) => {
    var password = req.body.password;
    var PasswordNew = req.body.passwordNew;
    console.log('password tu changpassword', password + "; " + PasswordNew);
    var mang = [];
    pool.connect((err, client, done) => {
        if (err) {
            console.log('changed password no connect to data base');
        }
        //  UPDATE "Users"SET id=?, "Username"=?, "Password"=?, "Hoten"=?, "Email"=?WHERE <condition>;
        //  text: 'UPDATE "hotgirlscollection" SET "Dislike"="Dislike"+1 WHERE "id" = $1',
        //  values: [id]
        //$1= PasswordNew
        var qr = {
            text: 'UPDATE "Users" SET "Password" = $1 WHERE  "Password" = $2 ',
            values: [PasswordNew, password]
        }
        console.log('qr::', qr);

        client.query(qr, (err, result) => {
            done();
            if (err) {
                console.log('err truy van database voi changed password');
            }
            if (err !== null || err !== '' || err == 'undefined') {
                console.log('result;::::', result);
                var x = result.rowCount;
                console.log('x:::', x);
                // res.send(x);
                mang.push(x);
                console.log('mang[0]:::', mang[0]);
                if (x == 0) {
                    res.send('0');
                } else {
                    res.send('1');
                }
            }

        });

    });
    console.log('mang[0]cccccc:::', mang[0]);
    res.send(mang[0]);

});

app3.get('/checkLogin/:token', (req, res) => {
    var token = req.params.token;
    if (token == null || token == undefined || token == '') {
        console.log("token rong");
    }
    var key = "secret_key_bao_mat";
    console.log('token::', token);
    var mang = [];
    function getJwt(value) {
        jwt.verify(value, key, function (err, decoded) {
            console.log('decoded::::', decoded);
            if (err) {
                console.log("token khong hop le");
            } else {
                mang.push(decoded)
            }
        });
        return mang[0];
    }
    var data = getJwt(token);
    console.log('data::::', data);

    var username = data.Username;

    pool.connect((err, client, done) => {
        if (err) {
            console.log(" token checklogin client from pool");
        }
        var qr = {
            text: ' SELECT * FROM "Users" WHERE "Username" = $1 ',
            values: [username]
        }
        console.log('qr:::', qr);
        client.query(qr, (err, result) => {
            done();
            if (err) {
                console.log("err cant not connect database");
            }
            console.log("result:::", result);
            if (result.rows == []) {
                console.log('khong ton tai username nao  hoac  token da het han');
            }

            if (result.rows[0] == null) {
                console.log('dang nhap khng thanh cong');
                res.send('0');
            }

            else if (result.rows[0] !== null) {
                var username = (result.rows[0]).Username;
                jwt.sign({ Username: username, iat: Math.floor(Date.now() / 1000) - (60 * 60) }, key, { expiresIn: 2 * 24 * 60 * 60 }, (err, tokenNew) => {
                    console.log('token check login::', token);
                    if (err) {
                        console.log(' err encode token tren check login');
                    }
                    var data = {
                        tokenNew,
                        Username: username,
                    }
                    var dataString = JSON.stringify(data);
                    console.log(dataString, dataString);
                    res.send(dataString);
                })
            }


        })

    });
});

app3.get('/checkUsername/:username', (req, res) => {
    var username = req.params.username;
    pool.connect((err, client, done) => {
        if (err) {
            console.log("client checkUsername from pool");
        }
        var qr = {
            text: ' SELECT * FROM "Users" WHERE "Username" = $1',
            values: [username]
        }
        console.log('qr::::', qr);
        client.query(qr, (err, result) => {
            done();
            if (err) {
                console.log('err connect database');
            }
            console.log('result:::::', result);
            console.log('result.rows:::::', result.rows);
            if (result.rows[0] == null || result.rows[0] == 'undefined') {
                res.send('0');
            } else {
                res.send('1');
            }


        })
    })
})

app3.get('/LoginHome/:username/:password', (req, res) => {
    pool.connect((err, client, done) => {
        var username = req.params.username;
        var password = req.params.password;
        if (err) {
            console.log('Login client from pool');
        }
        var qr = {
            text: 'SELECT * FROM "Users" WHERE "Username" = $1 AND "Password" = $2 ',
            values: [username, password]
        }
        console.log("qr:::", qr);
        client.query(qr, (err, result) => {
            done();
            if (err) {
                console.log('err truy van username and password');
            }
            console.log("result:::", result);

            if (result.rows[0] == null || result.rows[0] == "undefined") {
                console.log('err query username hoac password sai');
                res.send('0');
            }
            else if (result.rows[0] !== null || result.rows[0] !== "undefined") {
                // var user = result[0];
                //neu ket qua tra ve result ==null
                var key = "secret_key_bao_mat";
                //exp: Math.floor(Date.now() / 1000) + (60 * 60) singing a token with 1 hour of expiration 
                jwt.sign({ Username: username, iat: Math.floor(Date.now() / 1000) - (60 * 60) }, key, { expiresIn: '2 days' }, function (err, token) {
                    console.log('token:::', token);
                    var dataToken = {
                        Username: username,
                        token
                    }
                    var data = JSON.stringify(dataToken);
                    console.log('data token loginHome::', data);
                    if (err) {
                        console.log(err);
                    }
                    res.send(data);
                });
            }


            /*   var t = { expiresIn: 60 * 60 };
               console.log('t:::',t);
              // var token = jwt.sign(username,{iat: Math.floor(Date.now() / 1000) - 30 },"secret_key_bao_mat");
               jwt.sign({Username: username, iat: Math.floor(Date.now() / 1000) - (60*60) },key,{expiresIn: '2 days'}, function(err,token){
                   console.log("token::::",token);
                   var ObjData = {
                       token,
                       Username: username,
                   }
                   var data = JSON.parse(ObjData);
                   res.send(data);
               }); */

            /*
            console.log('older_token:::', older_token);
            var obj_data = {
                Username: username,
                token: older_token
            } 
            var data = JSON.stringify(obj_data);
            res.send(data); */

            /*    var token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + ( 60 * 60), //Signing a token with 7ngay * 24 =168 hour of expiration:
                Username: username,
            }, key);
            console.log('token:::',token);
            var data = {Username: username, token: token};
            console.log('data::::',data);
            var datajson = JSON.stringify(data);
            console.log('datajson::::',datajson);
            res.send(datajson); */

        })
    })
})

app3.get('/register/:username/:password/:hoten/:email', (req, res) => {
    var username = req.params.username;
    var password = req.params.password;
    var hoten = req.params.hoten;
    var email = req.params.email;

    pool.connect((err, client, done) => {
        if (err) {
            console.log('err register client from pool');
        }
        var i = 2;
        var qr = {
            text: 'INSERT INTO "Users"(id, "Username", "Password", "Hoten", "Email") VALUES ($1, $2, $3, $4, $5)',
            values: [i = i + 1, username, password, hoten, email]
        }
        console.log('qr::', qr);
        client.query(qr, function (err, result) {
            done();
            if (err) {
                console.log('err truy van dang ky Users');
            }
            console.log('result::::', result);

            var values = qr.values;
            console.log('values:::::', values);
            if (result !== null || result !== "undefined") {
                res.send(values);
            }
        });
    })
});

app3.get('/fetchData/:id/:ima/:username/:password', (req, res) => {

    var id = req.params.id;
    var ima = req.params.ima;
    var username = req.params.username;
    var password = req.params.password;
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('error fetching lient from pool', err);
        } //nue khong err
        //  var qr = 'INSERT INTO hotgrilscollection(id, "Hinh", "Like", "Dislike") VALUES(6, 6.jpg, 0, 0)';
        var qr = {
            text: 'INSERT INTO hotgrilscollection(id, "Hinh", "Like", "Dislike", "Username","Password") VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, ima, '0', '0', username, password],
        }
        console.log('qr::', qr);
        client.query(qr, function (err, result) {
            console.log('result::', result);
            done();
            if (err) {
                return console.log('error running query', err);
            }
            console.log('INSERT INTO succeffully');
            //console.log(result.rows[0].Hinh);

            //lay duoc hinh thi render hinh ra 
            // res.render('hotgirls', { dangxem: id, hinh: result.rows[0].Hinh });
        });

        // console.log(result);

        // res.send('INSERT INTO succeffully');
        //  res.render('fetchData',{ idnew: id, ima1: ima});

        //res.end('insert succeffuly');
        res.render('login');

    });
    //  res.render('chat');
});

app3.get('/dislike/:id', (req, res) => {
    var id = req.params.id;

    //chay truy van moc trong database lay ra hinh
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('error fetching lient from pool', err);
        }

        // var qr = 'UPDATE "hotgrilscollection" SET "Dislike"="Dislike"+1 WHERE "id" =' + id;
        var qr = {
            text: 'UPDATE "hotgirlscollection" SET "Dislike"="Dislike"+1 WHERE "id" = $1',
            values: [id]
        }
        console.log('qr::', qr);
        client.query(qr, function (err, result) {
            done();
            if (err) {
                return console.log('error running query', err);
            }
            console.log('UPLOAD Dislike succeffully');

            //lay duoc hinh thi render hinh ra 
            // res.render('hotgirls', { dangxem: id, hinh: result.rows[0].Hinh });
        });

        res.send('UPLOAD Dislike succeffully');
    });

});

app3.get('/like/:id', (req, res) => {
    var id = req.params.id;

    //chay truy van moc trong database lay ra hinh
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('error fetching lient from pool', err);
        }

        var qr = 'UPDATE "hotgrilscollection" SET "Like"="Like"+1 WHERE "id" =' + id;
        console.log('qr::', qr);
        client.query(qr, function (err, result) {
            done();
            if (err) {
                return console.log('error running query', err);
            }
            console.log('UPLOAD like succeffully');

            //lay duoc hinh thi render hinh ra 
            // res.render('hotgirls', { dangxem: id, hinh: result.rows[0].Hinh });
        });

        res.send('UPLOAD like succeffully');
    });

});


app3.get('/hotgirls/:id', (req, res) => {
    var id = req.params.id;
    //chay truy van moc trong database lay ra hinh
    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('error fetching lient from pool', err);
        }
        var qr = 'SELECT * FROM "hotgrilscollection" WHERE "id" =' + id;
        console.log('qr::', qr);
        client.query(qr, function (err, result) {
            console.log(result);
            done();
            if (err) {
                return console.log('error running query', err);
            }
            console.log(result.rows[0].Hinh);
            //lay duoc hinh thi render hinh ra 
            res.render('hotgirls', { dangxem: id, hinh: result.rows[0].Hinh });
        });
    });
});

app3.get('/Reactjs', (req, res) => {
    res.render('Reactjs');
});

var mangLIST = ["Android", "ios", "php", "reactjd"];
app3.post('/getNotes', (req, res) => {
    res.send(mangLIST);
});

app3.post('/add', parser, (req, res) => {
    var newNote = req.body.note;
    console.log('newNote:::', newNote);
    mangLIST.push(newNote);
    res.send(mangLIST);
});

app3.post('/delete', parser, (req, res) => {
    var idXoa1 = req.body.idXoa;
    console.log('idXoa1::::', idXoa1);
    mangLIST.splice(idXoa1, 1);
    res.send(mangLIST);
});

app3.post('/update', parser, (req, res) => {
    var idSua1 = req.body.idSua;
    console.log('idSua::::', idSua1);
    mangLIST[idSua1] = req.body.noidung;
    res.send(mangLIST);
});

var express = require('express');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var app4 = express();

app4.listen(2600, console.log('connect-port 2600 text jsonwentken'));

app4.get('/api', (req, res) => {
    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiVXNlcm5hbWUiOiJsYW4iLCJQYXNzd29yZCI6IjEyMyIsImVtYWlsIjoidGVvQCIsImlhdCI6MTU0Njg2NjczMywiZXhwIjoxNTQ2ODcwMzMzfQ.z_FrgjZaQoq82CA-4apD8BUbco9ZePsJCm30qBoCOKg';
    var key = 'cert';
    jwt.verify(token, key, function (err, decoded) {
        res.json({
            user: decoded,
        })
    });
});
//FOMAT OF TOKEN
//Verify Token
function verifyToken(req, res, next) {
    //get auth geader value
    const bearerHeader = req.headers['authorization'];

    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //split at the space
        console.log('bearerHeader:::', bearerHeader);
        const bearer = bearerHeader.split(' ');
        console.log('bearer::', bearer);
        //get token to array
        const bearerToken = bearer[1]; //chon mang so thu thu la 1 thi co token so thu 0 la 'Bearer' 
        console.log('bearerToken::', bearerToken);

        //set the token 
        req.token = bearerToken; // co bearerToken=token nen gui len req.token = bearerToken
        console.log('req.token = bearerToken::', req.token = bearerToken);

        //next middleware;
        next();
        console.log('next', next);
    } else {
        res.sendStatus(403);
    }
}

app4.post('/api/posts', verifyToken, (req, res) => {

    jwt.verify(req.token, 'cert', (err, AuthDta) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                AuthDta
            });
        }
    })


});

app4.post('/api/login', (req, res) => {
    // var cert = fs.readFileSync('key');
    var user = { id: 1, Username: 'lan', Password: '123', email: 'teo@' };
    var key = 'cert';
    jwt.sign(user, key, { expiresIn: 60 * 60 }, function (err, token1) {
        res.jon({
            messenger: "create token",
            token: token1,
        });

    });
});

/*
app4.get('/api', (req, res) => {
    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJVc2VybmFtZSI6ImxhbiIsIlBhc3N3b3JkIjoiMTIzIiwiZW1haWwiOiJ0ZW9AIn0sImlhdCI6MTU0Njg2NjU5NSwiZXhwIjoxNTQ2ODcwMTk1fQ.9V_mRDKRq5AnUWTuAGCtpZqSVEFjMK_0hXyaSl60c70';
    var decoded = jwt.verify(token, 'cert');
    console.log(decoded)
    res.json({
        messenger: "hello test",
        decodeToken: decoded,
    
});

app4.post('/api/posts', (req, res) => {

     var token1 = jwt.sign(
         {id: 1,Username: 'lan', Password: '123', email: 'teo@'},
         'cert', 
         { expiresIn: 60 * 60  }
     );
       
      res.json({
          messenger: "create token",
          token: token1,
      }); 
});

*/


/*

var config = {
    user: 'postgres',
    host: 'localhost',
    database: 'Users',
    password: 'Postgres09898',
    port: 5432,
    max: 10,
    idletTimeoutMillis: 30000,
};

app3.get('/login/:Username/:Password', (req, res) => {
    var id = req.params.id;
    var Username = req.params.Username;
    var Password = req.params.Password;

    pool.connect(function (err, client, done) {
        if (err) {
            return console.log('error login lient from pool', err);
        }
        var qr1 = 'SELECT id FROM "DanhSachUsers" WHERE "id"=' + id;

        //  var qr = {
        //      text: ' SELECT * FROM hotgrilscollection(id, "Hinh", "Like", "Dislike","Username","Passwrod") WHERE "Username" = $1 AND "Password" = $2 ',
        //      values: [17,'17.jpg','0','0',username, password],
        //  }

          var qr3 = {
            text: ' SELECT * FROM "DanhSachUsers" WHERE "id" = $1',
            values: [id],
        }

        var qr4 = {
            text: ' SELECT * FROM "DanhSachUsers" WHERE "Username" = $1',
            values: [Username],
        }

        var qr5 = {
            text: ' SELECT * FROM "DanhSachUsers" WHERE "Username" = $1 AND "Password" =$2 ',
            values: [Username, Password],
        }

        var qr2 = 'SELECT * FROM "DanhSachUsers" WHERE "id" =' + id;

        console.log('qr:::', qr2);
        client.query(qr5, function (err, result) {
            console.log(result);
            console.log('result.rows:::::', result.rows);
            var dataJSONstringify = JSON.stringify(result.rows);
            console.log('JSON.stringify(result.rows):::',dataJSONstringify );

            done();
            if (err) {
                return console.log('error running query', err);
            }
            console.log('login succuffuly');

            res.end(dataJSONstringify);
          //  res.render('hotgirls', {dataJSONstringify});
            //console.log(result.rows[0].Username);
        })
    });
});

*/



/*
// home
app3.get('/', function (req, res, next) {
    res.render('index', {
        title: "Home",
        userData: req.user,
        messages: {
            danger: req.flash('danger'),
            warning: req.flash('warning'),
            success: req.flash('success')
        }
    });

    console.log(req.user);
});

//join
app3.get('/join', function (req, res, next) {
    res.render('join', {
        title: 'Join',
        userData: req.user, 
        messages: {
            danger: req.flash('danger'),
            warning: req.flash('warning'),
            success: req.flash(success)
        }

    });
});


app3.post('/join', async function (req, res) {

    try {
        const client = await pool.connect()
        await client.query('BEGIN')
        var pwd = await bcrypt.hash(req.body.password, 5);
        await JSON.stringify(client.query('SELECT id FROM "users" WHERE "email"=$1', [req.body.username], function (err, result) {
            if (result.rows[0]) {
                req.flash('warning', "This email address is already registered. < a href ='/login'>Log in!</a >");
                res.redirect('/join');
            }
            else {
                client.query('INSERT INTO users(id, "firstName", "lastName", email, password) VALUES($1, $2, $3, $4, $5) ', [uuidv4(), req.body.firstName, req.body.lastName, req.body.username, pwd], function (err, result) {
                    if (err) { console.log(err); }
                    else {

                        client.query('COMMIT')
                        console.log(result)
                        req.flash('success', 'User created.')
                        res.redirect('/login');
                        return;
                    }
                });


            }

        }));
        client.release();
    }
    catch (e) { throw (e) }
});
*/

