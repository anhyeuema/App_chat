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



server.listen(3100, console.log('server_start_port_3500-de-lang-nghe-socket.io-send-image-from-Web-to-App'));
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

    console.log('client-connected-port-3100-de chat:' + socket.id);
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
app2.listen(1400, console.log('app2-start-port 1400-upload-image-From-app-to-web'))

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
server1.listen(2800, console.log('app3 server_start_port_2800-de--lang-nghe-socket.io-send-image-from-Web-to-App'));
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
var NameArrayMess = [];
var ArrMessSendServer = [];

io1.on('connect', (socket) => {
    //  console.log("io1..client connect socket io1 :" + socket.id);
    ArraySocketId.push(socket.id);
    //  console.log('io1...ArraySocketId:::', ArraySocketId);
    //  console.log('io1..ArraySocketId.length:::', ArraySocketId.length);


    socket.on('client-send-Username', Username => {
        //     console.log('io1....Username client-send-Username', Username);
        //     console.log('io1...ArraySocketId:::', ArraySocketIdOn);
        //     console.log('io1...ArraySocketId.length:::', ArraySocketIdOn.length);


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
                   NameArrayMess.slice(index, 1); //xoa 1 phan tu o vi tri thu index; neu Username connect != UsernameNguoiNhan thi ArrMess = []
                   io1.to(socket.id).emit('server-send-messenger', ArrMess);
                   console.log('socketId Nhan tin nhan khi offline: ', socket.id);
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



       } */

        ArraySocketIdUsername.push({ UserSocketId: socket.id + Username, Username: Username });
        console.log('io1...ArraySocketUsername:::', ArraySocketIdUsername);
        console.log('io1...ArraySocketUsernam.length:::', ArraySocketIdUsername.length);
        //   io1.sockets.emit('server-send-socket.id+Username', ArraySocketIdUsername);


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
                    NameArrayMess.slice(index, 1); //xoa 1 phan tu o vi tri thu index; neu Username connect != UsernameNguoiNhan thi ArrMess = []
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
        } */


        io1.sockets.emit('server-send-socket.id+Username', ArraySocketIdUsername);
        var ArraySocketIdUsername1 = JSON.stringify(ArraySocketIdUsername);
        fs.writeFile(__dirname + "/public/ArraySocketIdUsername/" + "ArraySocketIdUsername.docx", ArraySocketIdUsername1, (err) => {
            if (err) {
                //   console.log(' writeFile ArraySocketIdUsername:::', err);
            } else {
                //  console.log('luu ArraySocketIdUsername succefully');
            }

        });

        //  DSsocketIdNguoiNhan: dataMessenger.ArraySocketIdThoaMan, //neu khong ton tai socketId THOAN MAN KHI KICH CHUOT O CLIENT(APP or web) thi tien hanhluu tin nhan nay
        //bo vi co soketId nhan roi thi la co dia chi nhan roi thi khong can luu nua ma gui di ngay
        /* var dataEmit = { //hien thi de biet dataEmit gom nhungphan tu gi de ta re viet code thui
             UsernameNguoiNhan: dataMessenger.UsernameNguoiNhan,
             UsernameNguoiSend: dataMessenger.UsernameNguoiSend,
             messenger: dataMessenger.messenger,
             imageBase64: dataMessenger.imageBase64,
             pathIma: dataMessenger.pathIma,
         }; */

        /////////su ly o day ne
        //

        //console.log('NameArrayMess::::', NameArrayMess);




    });

    socket.on('disconnect', (data) => {
        //   console.log('io1..data disconnect::::', data);
        //  console.log('io1..socket.id data disconnect', socket.id);
        io1.sockets.emit('socketId-da-disconnect', socket.id);
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
    socket.on('disconnect', (data) => {
        //   console.log('io1..data disconnect::::', data);
        //  console.log('io1..socket.id data disconnect', socket.id);
        io1.sockets.emit('socketId-da-disconnect', socket.id);
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

    }); */





    socket.on('client-xoa-Username', socketIdUsernameNguoiSend => {
        //    console.log('io1..client-xoa-Username', socketIdUsernameNguoiSend);
        var SocketIdUsernameDisconnet = socketIdUsernameNguoiSend;

        //cap nhat lai cai mang ArraySocketUsername
        for (i = 0; i < ArraySocketIdUsername.length; i++) {
            var x = ArraySocketIdUsername[i].UserSocketId;
            if (x == SocketIdUsernameDisconnet) {
                //chi can tim ra so thu tu thu i nao can loai bo vi no disconnect
                ArraySocketIdUsername.splice(i, 1); // xoa 1 phan tu vi tri thu i
                break; //ket thuc cau lenh//Lệnh break thoát khỏi vòng lặp chứa nó o day la thoat khoi cong for
            }
        }
        // console.log('io1..ArraySocketIdUsername new cap nhat khi disconnectLL', ArraySocketIdUsername);
        //  console.log('io1..ArraySocketIdUsername new cap nhat khi disconnectLL', ArraySocketIdUsername.length);
        // io1.sockets.emit('server-capNhat-Danhsach-socketId-new-saukhi-disconnect', ArraySocketIdUsername)
        var ArraySocketIdUsername1 = JSON.stringify(ArraySocketIdUsername);
        fs.writeFile(__dirname + "/public/ArraySocketIdUsername/" + "ArraySocketIdUsername.docx", ArraySocketIdUsername1, (err) => {
            if (err) {
                // console.log(' writeFile ArraySocketIdUsername:::', err);
            } else {
                //  console.log('luu ArraySocketIdUsername New sau disconnect succefully');
            }

        });

        socket.on('client-yeucau-xin-ArrSocketIdUser-sauDisconnect', () => {
            var padth
            fs.readFile()
        })

    });



    var SaveDataMessengerApp;
    var WriteArrayMessUsersendUserItem = [];
    // var ArrMessSendServer = [];
    var soOnMess = 0;
    var ArrMessSendServer = [];
    socket.on('tao-ArrNameMess-save-messenger', data => {
        // var data= ArrMessSendServer;
        // var x = [{ data: ArrMessSendServer }];
    });



    socket.on('client-send-messenger', dataMessenger => {
        console.log('io1..client-send-messenger :' + dataMessenger);
        //  var msSend = dataMessenger.UsernameNguoiNhan + ": " + dataMessenger.messenger;
        //  var msNhan = dataMessenger.UsernameNguoiSend + ": " + dataMessenger.messenger;
        // 1) SocketIdUsernameNguoiNhan = SocketIdUsername co Username la Username nhan
        //2) tim mang socketIdThoaMan = SocketIdUsernameNguoiNhan - UsernameNguoiNhan;
        //   console.log('client-send-messenger ArraySocketIdUsername::',ArraySocketIdUsername)
        // ArraySocketIdUsername.push({ UserSocketId: socket.id + Username, Username: Username });
        //nếu có tên UsernameNguoiNhan mà khong có socketId online nao chứa UsernameNguoiNhan thi ta mới lưu mang
        //array tinhan NameArrayMess
        var ArraySocketIdUserNhan = [];
        ArraySocketIdUsername.map(function (socketIdUsername, index) {
            if (socketIdUsername.UserSocketId.indexOf(dataMessenger.UsernameNguoiNhan) > -1) {
                var SocketId = (socketIdUsername.UserSocketId).replace(dataMessenger.UsernameNguoiNhan, '');
                ArraySocketIdUserNhan.push(SocketId);
            }
        });
        console.log('ArraySocketIdUserNhan::::', ArraySocketIdUserNhan); //neu no bang rong ta moi luu tinnhan
        //truong hop socketId rong thi ta luu tin nhan cua UsernameNguoiNhan tuong ung do
        //hoac neu ArraySocketIdThoaMan khong ton tai if(ArraySocketIdThoaMan='undefind'){ this se luu tin nhan}
        if (ArraySocketIdUserNhan[0] == null) { //ta moi luu tin nhan khi ma nguoi nhan khong online
            //neu chi co ten nguoi nhan ma khong co socketId cua nguoi nhan ( socketid thoa man)
            //tien hanh luu tin nhan khi nao co 1 ket noi ma co socketid trung voi socketId cua nguoi ngan duoc lua ta se tien hanh
            // 1) lay nhung phan tu co trong mang da luu co ten trung ten socket id vua ket noi ta lay ra
            // 2) lay ra roi tao 1 mang hung no va mang cu xoa phan tu ma nguoi nhan se lay de lai phan tu chua co nguoi nhan online de nhan tin nhan trong mang tin nhan luu o server( NameArrayMess)
            var dataEmit = {
                UsernameNguoiNhan: dataMessenger.UsernameNguoiNhan, //ten nguoi nhsn lsy de so sach socket id nguoi nhan do
                UsernameNguoiSend: dataMessenger.UsernameNguoiSend,
                //  DSsocketIdNguoiNhan: dataMessenger.ArraySocketIdThoaMan, //neu khong ton tai socketId THOAN MAN KHI KICH CHUOT O CLIENT(APP or web) thi tien hanhluu tin nhan nay
                //bo vi co soketId nhan roi thi la co dia chi nhan roi thi khong can luu nua ma gui di ngay
                messenger: dataMessenger.messenger,
                imageBase64: dataMessenger.imageBase64,
                pathIma: dataMessenger.pathIma,
            };
            var NameArrayMessThem = (dataMessenger.UsernameNguoiSend + dataMessenger.UsernameNguoiNhan);
            var NameArrayMessThem = [];
            NameArrayMess.push(dataEmit);
            console.log('NameArrayMess::::', NameArrayMess);
            //for ( i=0; i< NameArrayMess.length; i++) {
            //    NameArrayMessThem
            //}
            /* emit se thuc hien o lang nghe socketId Connect neu vua run client (app) coc socketId+ Username cos trong
            // ArrMesSave  thi ta se lay messenger thoa man  socketId+ Username ra va push vao thanh mang con khong thoa man thi
            //cap nhat lai mang ArrMesSave moi 
            ArraySocketIdUserNhan.map(socketId => {
                io1.to(socketId).emit('server-send-messenger', NameArrayMess);
            }); */
        } else {
            var dataEmit = {
                UsernameNguoiNhan: dataMessenger.UsernameNguoiNhan,
                UsernameNguoiSend: dataMessenger.UsernameNguoiSend,
                //   DSsocketIdNguoiNhan: this.state.ArraySocketIdThoaMan,// bo qua cai nay vi ta su dung no de emit toi client
                messenger: dataMessenger.messenger,
                imageBase64: dataMessenger.imageBase64,
                pathIma: dataMessenger.pathIma,
            };

            //var dataEmit1 = JSON.stringify([dataEmit]);
            //  io1.sockets.emit('server-send-messenger',[dataEmit])
            //  var DSsocketIdNguoiNhan = dataMessenger.DSsocketIdNguoiNhan; //DSsocketIdNguoiNhan: this.state.ArraySocketIdThoaMan duoc gui tu client
            //  DSsocketIdNguoiNhan.map(function (socketId, index) { //DSsocketIdNguoiNhan lay tu client = ArraySocketIdUserNhan lay tu server 

            ArraySocketIdUserNhan.map(function (socketId, index) {
                io1.to(socketId).emit('server-send-messenger', [dataEmit]); //[dataEmit] mang chua 1 phan tu
                // console.log('[dataEmit];;;;', dataEmit);

            });
            console.log('[dataEmit];;;;', [dataEmit]);

        }

        /*
        var dataMessenger = {
            UsernameNguoiNhan: 'lan',
            UsernameNguoiSend: 'manh',
            messenger: '44444444444444444',
            imageBase64: '',
            pathIma: 'http://192.168.216.2:2800/hotgirls/3.jpg'
        } */
        //  var soOnMess = (soOnMess + 1);
        var UserWeb = dataMessenger.UsernameNguoiSend;
        var UserApp = dataMessenger.UsernameNguoiNhan;
        var NameMessSever = UserApp + UserWeb;
        //  var soPage = 1, //de hien thi la ra tin nhan moc ve 1 tinh tu length max - 1.m = hien thi so phan tu tu lon nhat toi -m phan tu


        //   console.log('NameMessSever ten cua mang la',NameMessSever);
        //  var NameMessSever= [];
        //   var NameMessSever = UserApp + UserWeb;
        //    console.log('NameMessSever ten cua mang la',NameMessSever);
        //   var NameMessSever= [];
        //  console.log('NameMessSever00000000000000000000000000000000000',NameMessSever);

        //  var NameMesSaveServer =  [{ data: ArrMessSendServer }];


        /*
        const NameMesSaveServer = async (NameMsSe, ArrMsSendServer) => {
            try {
                var xx = [{ NameMsSe: ArrMsSendServer }];
                AsyncStorage.setItem(NameMsSe, [{ NameMsSe: ArrMsSendServer }]);
            } catch (e) {

            }
        } */

  
        // async function NameMesSaveServer(NameMsSe, ArrMsSendServer) {
        //     return [{Arr : ArrMsSendServer, Name: NameMsSe }];
        // }
        // var DataMeserver = NameMesSaveServer(NameMessSever, ArrMessSendServer);
        //  console.log('wwwwwwwwwwwwwwwwwwwww',DataMeserver);
        //  var ArrTinNhan = DataMeserver[0].ArrMsSendServer;
        //  console.log('wwwwwwwwwwwwwwwwwwwww',ArrTinNhan);
        // var NameMesSaveServer =  [{ NameMessSever: ArrMessSendServer }];
        /*
        var NameMesSaveServer = [{ Name: NameMesSer, Arr: ArrMsSendServer }];
        NameMesSaveServer.map(function (value, index) {
            var Name = value.Name;
            var Arr = value.Arr;
            if (Name.indexOf(NameMessSever) > -1) {
                Arr = ArrMessSendServer;
                name = NameMessSever;
            } else {
                var x = { Name: NameMessSever, Arr: ArrMessSendServer }
                NameMesSaveServer.push
            }
        }) */


      


        var NameUserSendUserItem = UserApp + UserWeb + "ChatUsername.docx";
        var NameUserSendUserItem1 = UserWeb + UserApp + "ChatUsername.docx";
        var name = NameUserSendUserItem;
        var name1 = NameUserSendUserItem1;
        var path = __dirname + "/public/ChatUsername/" + name;
        var path1 = __dirname + "/public/ChatUsername/" + name1;

        var path2 = __dirname + "/public/ChatUsername/ArrTong/" + name;
        var path3 = __dirname + "/public/ChatUsername/ArrTong/" + name1;

        var dataMessenger = [dataEmit];

        if (ArrMessSendServer == false) {
            
            dataMessenger.map(async (dataEmit, index) => {
                var UserSendKey = {
                    //	key: JSON.stringify(soOnMess + index),
                    key: JSON.stringify(index),
                    UserSend: dataEmit.UsernameNguoiSend, //thang send cho Userapp, va app dang la thang nhan nhung lai dat o this.state( la UsernameNguoiSend )
                    messenger: dataEmit.messenger,
                    imageBase64: dataEmit.imageBase64,
                    pathIma: dataEmit.pathIma,
                    UserNhan: '', //them vao de hien thi thoi
                    messengerNhan: '',
                };
                //  console.log('.UserSendKey: ==0:::', UserSendKey);
                ArrMessSendServer.push(UserSendKey);
                console.log(' ArrMessSendServer:::', ArrMessSendServer);

            });

            var x = {  Name: NameMessSever, Arr: ArrMessSendServer };
           // var M = [{  Name: NameMsSe, Arr: ArrMessSendServer }];
            var M = [{  Name: '', Arr: '' }];
            M.map( function( value, index) {
                var Name = value.Name;
                var Arr = value.Arr;
                if ( Name.indexOf(NameMessSever) > -1 ) {
                   // M = [{  Name: Name, Arr: Arr }];
                   //GIONG TEN THI TA KHONG LAM GI CA neu khac ten thi push vao 1 phan tu moi
                } else {
                    var pt = { Name: NameMessSever, Arr: ArrMessSendServer}
                    M.push(pt);
                  
                  // M.push(x);
                }
            });
            console.log('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',M);
            var M1 = JSON.stringify(M);
            console.log('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM M[1].Arr M[1].Arr M[1].Arr M[1].Arr vvv',M[1].Arr);
            var M1 = JSON.stringify(M);
            console.log('ArrMessSendServerMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' +
                '1111111111111111111111111111111111111111111111' +
                '111111111111111111111111111111111111111111111', M1);
         //   fs.writeFileSync(path2, M1);
         //   fs.writeFileSync(path3, M1);

            var M2 = JSON.stringify(M[1].Arr);
            fs.writeFileSync(path2, M2);
            fs.writeFileSync(path3,M2);
            
         ///   fs.writeFileSync(path1, M1);
            

            /*
            function NameMesSaveServer(NameMsSe, dataMessenger) {
                dataMessenger.map(async (dataEmit, index) => {
                    var UserSendKey = {
                        //	key: JSON.stringify(soOnMess + index),
                        key: JSON.stringify(index),
                        UserSend: dataEmit.UsernameNguoiSend, //thang send cho Userapp, va app dang la thang nhan nhung lai dat o this.state( la UsernameNguoiSend )
                        messenger: dataEmit.messenger,
                        imageBase64: dataEmit.imageBase64,
                        pathIma: dataEmit.pathIma,
                        UserNhan: '', //them vao de hien thi thoi
                        messengerNhan: '',
                    };
                    //  console.log('.UserSendKey: ==0:::', UserSendKey);
                    ArrMessSendServer.push(UserSendKey);
                    console.log(' ArrMessSendServer:::', ArrMessSendServer);
    
                });
                return [{  Name: NameMsSe, Arr: ArrMessSendServer }];
            }
           
            NameMesSaveServer(NameMessSever, dataMessenger).map(function (value, index) {
                var Name = value.Name;
                var Arr = value.Arr;
                if (Name.indexOf(NameMessSever) > -1) {
                    //Arr = ArrMessSendServer;
                   // name = NameMessSever;
                  // ArrMessSendServer.push(UserSendKey);
                } else {
                    var x = { Name: Name, Arr: Arr }
                    NameMesSaveServer(NameMessSever, ArrMessSendServer).push(x);
                }
            });
            var x = NameMesSaveServer();
            console.log('NameMesSaveServer:::',NameMesSaveServer);
            */
    

            var ArrMessSendServer1 = JSON.stringify(ArrMessSendServer);
            console.log('ArrMessSendServer:::///////////////////////////////' +
                '/////////////////////////////////////////////////////////////////' +
                '////////////////////////////////////////////////////////////////', ArrMessSendServer1);
            fs.writeFileSync(path, ArrMessSendServer1);
            fs.writeFileSync(path1, ArrMessSendServer1);


        } else {
            var Nms = ArrMessSendServer.length;
            dataMessenger.map(async (dataEmit, index) => {
                var UserSendKey = {
                    //	key: JSON.stringify(soOnMess + index),
                    key: JSON.stringify(Nms + index),
                    UserSend: dataEmit.UsernameNguoiSend, //thang send cho Userapp, va app dang la thang nhan nhung lai dat o this.state( la UsernameNguoiSend )
                    messenger: dataEmit.messenger,
                    imageBase64: dataEmit.imageBase64,
                    pathIma: dataEmit.pathIma,
                    UserNhan: '', //them vao de hien thi thoi
                    messengerNhan: '',
                };
                //  console.log('.UserSendKey: ==0:::', UserSendKey);
                ArrMessSendServer.push(UserSendKey);

            });

            var x = {  Name: NameMessSever, Arr: ArrMessSendServer };
 
           // var M = [{  Name: NameMsSe, Arr: ArrMessSendServer }];
            var M = [{  Name: '', Arr: '' }];
            M.map( function( value, index) {
                var Name = value.Name;
                var Arr = value.Arr;
                if ( Name.indexOf(NameMessSever) > -1 ) {
                   // M = [{  Name: Name, Arr: Arr }];
                   //GIONG TEN THI TA KHONG LAM GI CA neu khac ten thi push vao 1 phan tu moi
                } else {
                    var pt = { Name: NameMessSever, Arr: ArrMessSendServer}
                    M.push(pt);
                  // M.push(x);
                }
            });
            console.log('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',M);
            
            console.log('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM M[1].Arr M[1].Arr M[1].Arr M[1].Arr vvv',M[1].Arr);
            var M1 = JSON.stringify(M);
            console.log('ArrMessSendServerMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' +
                '1111111111111111111111111111111111111111111111' +
                '111111111111111111111111111111111111111111111', M1);
            var M2 = JSON.stringify(M[1].Arr);
            fs.writeFileSync(path2, M2);
            fs.writeFileSync(path3,M2);
            

            // e.setState({ SaveDataMessengerApp: dataMessenger })
            //  e.setState({SaveDataMessengerApp: ArrMessSendServer,//	ArrUserSendKey: ArrdataMessenger,// soOnMess: (soOnMess + 1),});
            console.log(' ArrMessSendServer:::', ArrMessSendServer);
            var ArrMessSendServer1 = JSON.stringify(ArrMessSendServer);
            console.log('ArrMessSendServer:::///////////////////////////////' +
                '/////////////////////////////////////////////////////////////////' +
                '////////////////////////////////////////////////////////////////', ArrMessSendServer1);
            fs.writeFileSync(path, ArrMessSendServer1);
            fs.writeFileSync(path1, ArrMessSendServer1);
        }


        /*  dataMessenger.DSsocketIdNguoiNhan.map(socketId => {
              io1.to(socketId).emit('server-send-messenger', {
                  UsernameNguoiSend: dataMessenger.UsernameNguoiSend,
                  UsernameNguoiNhan: dataMessenger.UsernameNguoiNhan,
                  messenger: dataMessenger.messenger,
              });
          }); */

        /*  socket.on('client-xoa-Username', data=>{
              console.log('client-xoa-Username trong client-send-messenger', data);
              console.log(socket.id);
          }); */



    });




    //client-send-ArrayMessUsersendUserItem sau khi da luu tren app
    socket.on('client-send-ArrayMessUsersendUserItem', dataMessenger => {
        console.log('ArrayMessUsersendUserItem:client-send-ArrayMessUsersendUserItem:::', dataMessenger);
        // var ArrayMessUsersendUserItem = { 
        //     NameUserSendUserItem: this.state.UsernameNguoiSend + this.state.Username, 
        //     NameUserSendUserItem1: UserWeb + UserApp + "ChatUsername.docx",
        //    SaveDataMessengerApp: SaveDataMessengerApp1 
        // }


        /*
        var name = WriteArrayMessUsersendUserItem.NameUserSendUserItem;
        var name1 = WriteArrayMessUsersendUserItem.NameUserSendUserItem1;
        var dataMessenger = WriteArrayMessUsersendUserItem.SaveDataMessengerApp; //lay 1 phan tu o tin nhan o client 
        var path = __dirname + "/public/ChatUsername/" + name;
        var path1 = __dirname + "/public/ChatUsername/" + name1;

        console.log("ArrayMessUsersendUserItem:" + name + " client-send-ArrayMessUsersendUserItem:", WriteArrayMessUsersendUserItem);
        */



        //2) chi can nhan 1 phan tu mes New tu client gui ve va push no vao tin nhan da luu la duoc

        // a) lay Mang tin nhn len va JSON.parser 
        //b) push phan tu do vao cai mang vua lay len
        //  var x = fs.readFileSync(path);
        //   console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',x);
        //  var x = fs.readFileSync(path, 'UTF-8');
        //  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', x);


        //xu ly key cho datamesse
        // key: JSON.stringify((ArrdataMessenger.length) + 1), //ket se duoc tang len 1, so thu tu no khong bat dau tu 0. mang.length bat dau tu 1
        //UserSend: '',
        // messenger: '',
        // UserNhan: UsernameNguoiSend, //hien thi nguoi gui gio la app gui web
        // messengerNhan: Username == null ? null : messenger,
        // imageBase64: Username == null ? null : imageBase64,
        // pathIma

        // var SaveDataMessengerApp = [];
        /*
        dataMessenger.map(function (dataEmit, index) {
             // var UserSendKey = dataMessenger[index];
             // console.log('.UserSendKey: ==0:::', UserSendKey);
             //  SaveDataMessengerApp.push(UserSendKey);
             SaveDataMessengerApp.push(dataEmit);
         }); 
        console.log('WriteArrayMessUsersendUserItem', WriteArrayMessUsersendUserItem)
        var dataEmit = WriteArrayMessUsersendUserItem[0];
        SaveDataMessengerApp.push(dataEmit);
        console.log('SaveDataMessengerApp:::///////////////////////////////' +
            '/////////////////////////////////////////////////////////////////' +
            '////////////////////////////////////////////////////////////////', SaveDataMessengerApp);
       


        /*
         fs.readFile(path, 'UTF-8', async (err, data2) => {
 
             if (err) {
                 console.log(' err ReadArrayMessUsersendUserItem khong co 1PHAN TU TIN NHAN::');
 
 
                 var SaveDataMessengerApp = [];
                 dataMessenger.map(function (dataEmit, index) {
                     // var UserSendKey = dataMessenger[index];
                     // console.log('.UserSendKey: ==0:::', UserSendKey);
                     //  SaveDataMessengerApp.push(UserSendKey);
                     SaveDataMessengerApp.push(dataEmit);
                 });
                 // console.log('SaveDataMessengerApp luu khi loi', SaveDataMessengerApp);
                 var dataErr = JSON.stringify(SaveDataMessengerApp);
                 console.log('SaveDataMessengerApp dataErr luu khi loi', dataErr);
                 fs.writeFile(path, dataErr, (err) => {
                     if (err) {
                         console.log('WriteArrayMessUsersendUserItem  save ca khi err ERR ERR', err);
                     }
                     else {
                         console.log('WriteArrayMessUsersendUserItem save ca khi err ERR ERR : ', path);
                     }
                 });
                 fs.writeFile(path1, dataErr, (err) => {
                     if (err) {
                         console.log('WriteArrayMessUsersendUserItem  save ca khi err ERR ERR', err);
                     }
                     else {
                         console.log('WriteArrayMessUsersendUserItem save ca khi err ERR ERR : ', path);
                     }
                 });
 
             } else {
                 // console.log('data22222222222222222222222222222222222222222222222222222222',data2)
                 console.log('dataMessenger:;;;;;;;;;', dataMessenger);
                 console.log('dataMessenger data2:;;;;;;;;;', data2);
                 //   var SaveDataMessengerApp1 = await data2.toString(); //chuyen tu buffer sang base64
 
                 //   console.log('SaveDataMessengerApp1 data2.toString()', SaveDataMessengerApp1)
                 var SaveDataMessengerApp1 = data2; //chuyen tu buffer sang base64
                 var SaveDataMessengerApp = JSON.parse(SaveDataMessengerApp1);
                 console.log(' WriteArrayMessUsersendUserItem SaveDataMessengerApp cu:::', SaveDataMessengerApp.length)
                 // var ArrdataMessenger = [];
                 //    console.log('verver-trave-yeucau-ArrayMessUser::==0 dataMessenger:::', dataMessenger)
                 dataMessenger.map(function (dataEmit, index) {
                     // var UserSendKey = dataMessenger[index];
                     // console.log('.UserSendKey: ==0:::', UserSendKey);
                     //  SaveDataMessengerApp.push(UserSendKey);
                     SaveDataMessengerApp.push(dataEmit);
 
                 });
                 //  console.log('WriteArrayMessUsersendUserItem SaveDataMessengerApp new:::',SaveDataMessengerApp.length);
                 var h = SaveDataMessengerApp.length;
                 console.log('WriteArrayMessUsersendUserItem  SaveDataMessengerApp new :::', SaveDataMessengerApp);
                 // console.log('WriteArrayMessUsersendUserItem  SaveDataMessengerApp phan tu new save:::',h);
 
                 // e.setState({ SaveDataMessengerApp: dataMessenger })
                 // e.setState({ SaveDataMessengerApp: ArrdataMessenger, ArrUserSendKey: ArrdataMessenger });
                 var data = JSON.stringify(SaveDataMessengerApp);
                 console.log('mang tin nhan luu o server: [[[[[[]]]]]]]]]]]]]]', data);
                 fs.writeFile(path, data, (err) => {
                     if (err) {
                         console.log('WriteArrayMessUsersendUserItem err', err);
                     }
                     else {
                         console.log('WriteArrayMessUsersendUserItem : ', path);
                     }
                 });
                 fs.writeFile(path1, data, (err) => {
                     if (err) {
                         console.log('WriteArrayMessUsersendUserItem err', err);
                     }
                     else {
                         console.log('WriteArrayMessUsersendUserItem : ', path);
                     }
                 });
 
             }
 
         }); */

    });

    //client-muon-lay-ArrayMess-User muon lay thi phai doc ArrayMess da luu o server
    //chi can gui cai ten da luu de moc no len//khi run ap len thi lay mang da luu
    socket.on('client-muon-lay-ArrayMess-User', ReadArrayMessUsersendUserItem => {
        // NameUserSendUserItem: this.state.UsernameNguoiSend + this.state.Username + "ChatUsername.doxc",
        // ArrSocketId_UserSend: ArrSocketId_UserSend,
        //UserYeuCauMess: UserApp,
        //	soPage: this.state.soPage, // quan ly so trang muon lay ve
        // 1) muon lay thi ta tra ve 10 phan tu cuoi cung cua mang da luu
        //2 ) sau khi no tra ve thi ta chi can lay 1 phan tu tin nhan new tra ve se push vao mang da luu su ky o socket.on('client-send-ArrayMessUsersendUserItem'
        console.log('ReadArrayMessUsersendUserItem:client-muon-lay-ArrayMess-User:::', ReadArrayMessUsersendUserItem)
        //a) tim socketId nguoi yeu cau xin tin nhan
        var ArrSocketIdUserYeuCauMess = []; // no la app hoac web can co no de biet tra ve chua socketId nao
        //ArraySocketIdUsername.push({ UserSocketId: socket.id + Username, Username: Username });
        var UserYeuCauMess = ReadArrayMessUsersendUserItem.UserYeuCauMess;
        ArraySocketIdUsername.map(function (value, index) {
            var UserSocketId = value.UserSocketId;
            if (UserSocketId.indexOf(UserYeuCauMess) > -1) {
                var socketId = UserSocketId.replace(UserYeuCauMess, '');
                ArrSocketIdUserYeuCauMess.push(socketId);
            }
        })
        console.log('ArrSocketIdUserYeuCauMess', ArrSocketIdUserYeuCauMess);

        //b) doc tin nhan gui luu o server len
        // var ArrSocketId_UserSend = ReadArrayMessUsersendUserItem.ArrSocketId_UserSend;
        var name = ReadArrayMessUsersendUserItem.NameUserSendUserItem;
        var path = __dirname + "/public/ChatUsername/" + name;
        console.log('path:::::////////////////////////////////////////', path);
        var path2 = __dirname + "public/ChatUsername/ArrTong/" + name;
        console.log('path2::::::////////////////////////////////////////', path2);
      //  var path3 = __dirname + "/public/ChatUsername/ArrTong/" + name1;

        var soPage = ReadArrayMessUsersendUserItem.soPage;
        // var y = fs.readFileSync(path);
        // console.log('yyyyyyyyyyy', y);
        fs.readFile(path, 'UTF-8', (err, data) => {
            if (err) {
                console.log('err ReadArrayMessUsersendUserItem::');

                ArrSocketIdUserYeuCauMess.map(function (SocketId, index) {
                    io1.to(SocketId).emit('server-trave-yeucau-ArrayMess-User', { Nms: 0, Sms: '0' });
                    // console.log('server-trave-yeucau-ArrayMess-User la : ', SaveDataMessengerApp);
                });
                /* ArrSocketId_UserSend.map(function (SocketId, index) {
                     io1.to(SocketId).emit('server-trave-yeucau-ArrayMess-User', []);
                     //console.log('server-trave-yeucau-ArrayMess-User la do k find path : ', []);
                 }); */
                console.log('server-trave-yeucau-ArrayMess-User la do k find path : ', { Nms: 0, Sms: '0' });
                console.log('server-trave-Client-yeucau-ArrayMess-User la: ' + name + ":" +
                    '////////////////////////////////////////////////////////////////' +
                    '//////////////////////////////////////////////////////////////', { Nms: 0, Sms: '0' });

            } else {

                // var SaveDataMessengerApp1 = data.toString(); //chuyen tu buffer sang base64
                var SaveDataMessengerApp1 = data;

                //  console.log('server-trave-Client-yeucau-ArrayMess-User la: ' + name + ":" +'////////////////////////////////////////////////////////////////' +'//////////////////////////////////////////////////////////////');
                //  console.log('ReadArrayMessUsersendUserItem la ReadArrayMessUsersendUserItem : ', SaveDataMessengerApp1);
                // console.log('ReadArrayMessUsersendUserItem path : ', path);

                //1) lay ra 5 phan tu cuoi trong mang nao

                 var SaveDataMessengerApp = JSON.parse(SaveDataMessengerApp1);
               // var SaveDataMessengerApp = ArrMessSendServer;


                //  console.log('ReadArrayMessUsersendUserItem la ReadArrayMessUsersendUserItem : ', SaveDataMessengerApp);
                var n = SaveDataMessengerApp.length;
                //  var SaveDataMessengerApp = JSON.stringify(SaveDataMessengerApp2);
                console.log(' ReadArrayMessUsersendUserItem SaveDataMessengerApp.length: n=:', SaveDataMessengerApp.length)
                //soPage chi duoc lon hon hoa bang 1 so trang khong cho qua so am hay bang 0
                var X = 3 * soPage; //so phan tu tra ve cho client
                console.log('XXXXXXXXXXXXXXXXXX So phan tu tai ve la', X);
                if (X <= 0) {
                    var X1 = 3;
                    ArrSocketIdUserYeuCauMess.map(function (SocketId, index) {
                        io1.to(SocketId).emit('server-trave-yeucau-ArrayMess-User', { Nms: n, Sms: (SaveDataMessengerApp1), TH1: (n + ' <= ' + X1) });
                        // console.log('server-trave-yeucau-ArrayMess-User la : ', SaveDataMessengerApp);
                    });
                    console.log('server-trave-Client-yeucau-ArrayMess-User la: ' + ReadArrayMessUsersendUserItem.NameUserSendUserItem + ":" +
                        '///////////////////////////////X <= 0/////////////////////////////////' +
                        '///////////////////////////////X <= 0/////////////////X <= 0//////////////', { Nms: n, Sms: SaveDataMessengerApp1, TH1: (n + ' <= ' + X1) });

                } else if (X > 0) {
                    if (n <= X) {
                        ArrSocketIdUserYeuCauMess.map(function (SocketId, index) {
                            io1.to(SocketId).emit('server-trave-yeucau-ArrayMess-User', { Nms: n, Sms: (SaveDataMessengerApp1), TH1: (n + ' <= ' + X) });
                            // console.log('server-trave-yeucau-ArrayMess-User la : ', SaveDataMessengerApp);
                        });
                        console.log('server-trave-Client-yeucau-ArrayMess-User la: ' + ReadArrayMessUsersendUserItem.NameUserSendUserItem + ":" +
                            '////////////////////////////////////////////////////////////////' +
                            '//////////////////////////////////////////////////////////////', { Nms: n, Sms: SaveDataMessengerApp1, TH1: (n + ' <= ' + X) });
                    }
                    else if (n > X) {
                        var ArrXphanTuCuoiMs1 = [];
                        for (i = n - X; i < n; i++) {
                            var phantu = SaveDataMessengerApp[i];
                            ArrXphanTuCuoiMs1.push(phantu);
                        }
                        /* SaveDataMessengerApp.map( function(dataEmit,imdex) {
                             var n = index + X;
                             var phanTu = SaveDataMessengerApp[n];
                         }) */
                        console.log('ReadArrayMessUsersendUserItem ArrXphanTuCuoiMs::::', ArrXphanTuCuoiMs1);
                        var ArrXphanTuCuoiMs = JSON.stringify(ArrXphanTuCuoiMs1);
                        /* ArrSocketId_UserSend.map(function (SocketId, index) {
                                       io1.to(SocketId).emit('server-trave-yeucau-ArrayMess-User', SaveDataMessengerApp);
                                       // console.log('server-trave-yeucau-ArrayMess-User la : ', SaveDataMessengerApp);
                                   }); */
                        ArrSocketIdUserYeuCauMess.map(function (SocketId, index) {
                            io1.to(SocketId).emit('server-trave-yeucau-ArrayMess-User', { Nms: n, Sms: (ArrXphanTuCuoiMs), TH2: (n + ' > ' + X) });
                            // console.log('server-trave-yeucau-ArrayMess-User la : ', SaveDataMessengerApp);
                        });
                        console.log('server-trave-Client-yeucau-ArrayMess-User la: ' + ReadArrayMessUsersendUserItem.NameUserSendUserItem + ":" +
                            '////////////////////////////////////////////////////////////////' +
                            '//////////////////////////////////////////////////////////////', { Nms: n, Sms: (ArrXphanTuCuoiMs), TH2: (n + ' > ' + X) });

                    }

                }
            }
        });

    });

    //lnag nghe client-want-dellete-messChatUser
    socket.on('client-want-dellete-messChatUser', deleteMess => {
        console.log('client-want-dellete-messChatUser:::', deleteMess);
        // NameMessDellete: this.state.UsernameNguoiSend + this.state.Username + "ChatUsername.docx",
        var name = deleteMess.NameMessDellete;
        var name1 = deleteMess.NameMessDellete1;
        var data = '0';
        var path = __dirname + "/public/ChatUsername/" + name;
        var path1 = __dirname + "/public/ChatUsername/" + name1;
        fs.writeFile(path, data, (err) => {
            if (err) {
                console.log('deleteMess err', err);
            }
            else {
                console.log('deleteMess path : ', path);
            }
        });
        fs.writeFile(path1, data, (err) => {
            if (err) {
                console.log('deleteMess err', err);
            }
            else {
                console.log('deleteMess path : ', path);
            }
        })
    })




    //servser lang nghe status cong khai tu client va emit toi tat ca cac client vi la public cong khai
    // o statusPublic.js gan khoi tao this.state = {}
    socket.on('client-share-status-public-congKhai', (dataStatus) => {
        console.log('client-share-status-public-congKhai:::', dataStatus);
        io1.sockets.emit('server-share-status-public-congKhai', dataStatus);
    });


    //client-send-status-public-khi-da-save Staus .dung de khi ma user nhan duoc khong online se nhan duoc sau khi bat mang
    //luu o  writeFile statusPublic.js coi ham khoi tao contructor(props) {}
    socket.on('client-send-status-public-khi-da-saveStaus', WriteStatuspublic => {
        console.log('WriteStatuspublic:::::', WriteStatuspublic);
        var ArrayStatus = WriteStatuspublic.ArrayStatus;
        var StatusPublic = WriteStatuspublic.StatusPublic;
        var pathStatusPublic = __dirname + "/public/StatusPublic" + "/" + StatusPublic;
        console.log('ArrayStatus[0]:::', ArrayStatus[0]);
        if (ArrayStatus[0] !== 'undefined' || ArrayStatus[0] !== '' || ArrayStatus[0] !== null) {
            fs.writeFile(pathStatusPublic, ArrayStatus, (err) => {
                if (err) {
                    console.log('WriteStatuspublic err:::', err);
                } else {
                    console.log('da luu statusPublic tai', pathStatusPublic)
                }

            });
        } else if (ArrayStatus[0] == 'undefined') {
            fs.writeFile(pathStatusPublic, '');
        }
    });
    //khi run app getUser(User1) client-muon-lay-ArrayStatus-public. o statusPublic.js ngay getUser(user1),
    socket.on('client-muon-lay-ArrayStatus-public', ReadStatusPublic => {
        // StatusPublic: "StatusPublic.docx"
        console.log('"ReadStatusPublic', ReadStatusPublic);
        var StatusPublic = ReadStatusPublic.StatusPublic;
        var pathStatusPublic = __dirname + "/public/StatusPublic" + "/" + StatusPublic;
        console.log('pathStatusPublic::::', pathStatusPublic);
        if (pathStatusPublic !== null || pathStatusPublic !== 'undefined' || pathStatusPublic !== '') {
            fs.readFile(pathStatusPublic, (err, data) => {
                if (err) {
                    console.log('value:::', err);
                } else {
                    console.log('data::::', data);

                    // var ArrayStatus = data.toString('utf8');
                    var ArrayStatus = data.toString();
                    console.log('ArrayStatus::::', ArrayStatus);
                    io1.sockets.emit('server-trave-yeucau-ArrayStatus-public', ArrayStatus);
                    console.log('server-trave-yeucau-ArrayStatus-public ArrayStatus::::', ArrayStatus)
                }
            });
        } else {
            console.log('WriteStatuspublic chua duoc luu thi khong co ma doc');
        }
    });




    //client-send-status-public-khi-da-save Staus .dung de khi ma user nhan duoc khong online se nhan duoc sau khi bat mang
    //luu o  writeFile statusUser.js coi ham khoi tao contructor(props) {}
    socket.on('client-send-status-public-User-khi-da-saveStaus', async (WriteStaticPulicUser) => {
        //userStatus: this.state.User + "StatusPublic_User.docx", ArrayStatus: ArrayStatus, UserStatusItem: this.state.User + 'ArrayStatusItem.docx', ArrayStatusItem: ArrayStatusItem
        var UserStatusItem = WriteStaticPulicUser.UserStatusItem;  // = ten user =  WriteStaticPulicUser.userStatus
        var ArrayStatusItem = JSON.stringify(WriteStaticPulicUser.ArrayStatusItem);///co ca avata va anhBia cua User
        console.log('WriteStaticPulicUser:::::', WriteStaticPulicUser);
        console.log('JSON.stringify(ArrayStatusItem):::::', ArrayStatusItem);
        var path = __dirname + "/public/StatusUser" + "/" + WriteStaticPulicUser.userStatus;
        await fs.writeFile(path, WriteStaticPulicUser.ArrayStatus, (err) => {
            if (err) {
                console.log('WriteStaticPulicUser err:::', err);
            } else {
                console.log('da luu statusPublicUser', path)
            }

        });
        /*  var path1 = __dirname + "public/StatusUser" + "/" + UserStatusItem;
          await fs.writeFile(path1, ArrayStatusItem, (err)=> {
            if (err) {
                console.log('WriteStaticPulicUserItem err:::', err);
            } else {
                console.log('da luu statusPublicUser_item', path1);
            }
          }) */
    });
    //client-muon-lay-ArrayStatus-public. o statusUser.js ngay getUser(user1), 
    socket.on('client-muon-lay-ArrayStatus-public-User', ReadStatusPublicUser => {
        console.log('ReadStatusPublicUser', ReadStatusPublicUser);
        var path = __dirname + "/public/StatusUser" + "/" + ReadStatusPublicUser.userStatus;
        fs.readFileSync(path, (err, data) => {
            if (err) {
                console.log('value:::', err);
            } else {
                console.log('data::::', data);
                // var ArrayStatus = data.toString('utf8');
                var ArrayStatus = data.toString();
                console.log('ArrayStatus::::', ArrayStatus);
                io1.sockets.emit('server-trave-yeucau-ArrayStatus-public-User', ArrayStatus);
                console.log('server-trave-yeucau-ArrayStatus-public USER ArrayStatus::::', ArrayStatus)
            }
        });
    });

    //o trong StatusPublic ben trong render( <View>) 
    socket.on('client-StatusPublic-yeu-cau-StatusUser-Gui-ArrayStatusUser', ReadStatusUserPublic_item => {
        // User_item: User + "StatusPublic_User.docx", ArraySocketIdThoaMan: this.state.ArraySocketIdThoaMan
        console.log('User_socketIdThoaMan', ReadStatusUserPublic_item);
        var path = __dirname + "/public/StatusUser/" + ReadStatusUserPublic_item.User_item;
        fs.readFile(path, (err, StatusUser) => {
            if (err) {
                console.log('voi satatus cua' + + "chua duoc luu tren server")
            }
            else {
                console.log('data::::', StatusUser.toString());
                var StatusUser_item = StatusUser.toString();
                (ReadStatusUserPublic_item.ArraySocketIdThoaMan).map(function (socketId, index) {
                    io1.to(socketId).emit('server-StatusPublic-yeu-cau-StatusUser-Gui-ArrayStatusUser', StatusUser_item);
                    //app component StatusUser.js se lang nghe va tra cho ArrayStatusItem de StatusPublic hien thi
                    //nhung khi no khong Online thi khong lay duoc ma ta luu mang StatusUser tren server o (3*)
                    //thi ta chi can qua do coc thui nhe chi can gui User xuong moc o server nodejs
                });
            }
        });
    });

    //add-friend
    //khi nhan duoc loi moi ket ban ta se push vao 1 mang va mang nay la 1 phong
    //mang ten la UsernameAddFriend + UsernameConfig: + .... cong ten dat car thang moi add vao la 1 phong 
    //do cac username co 1 ten duy nhat nen cong cac ten lai no cung co 1 ten duy nhat
    var ArrarAddFriend = [];
    socket.on('add-friend', addFriend => {
        ArrarAddFriend.push(addFriend.UsernameAddFriend);
        ArrarAddFriend.push(addFriend.UsernameConfig);
        console.log('ArrarAddFriend:::::', ArrarAddFriend);
    });


    /* //client-share-statusUser chi emit lai cai socketid cua 1 cai client da emit xuong
     socket.on('client-share-statusUser',statusUser => {
         console.log('client-share-statusUser', statusUser);
         socket.emit('server-send-tra-statusUser', statusUser);
     }); */

    //client-send-status-User-khi-da-saveStaus . 
    //luu o  writeFile//o ngay sau  statusUser.js.js ngay cuoi Contructor(props)

    /*
    socket.on('client-send-status-User-khi-da-saveStaus', saveStatusUser => { //(3*) 
        console.log('saveStatusUser:::::', saveStatusUser);
        //  this.socket.emit('client-send-status-User-khi-da-saveStaus', { userStatus: this.state.User + "StatusPublic_User", ArrayStatus: ArrayStatus, UserStatusItem: this.state.User + 'ArrayStatusItem',ArrayStatusItem: ArrayStatusItem });
        fs.writeFile(__dirname + "/public/StatusUser/" + saveStatusUser.userStatus, saveStatusUser.ArrayStatus, (err) => {
            if (err) {
                console.log('value:::', err);
            } else {
                console.log('luu status User thanh cong dia chi file luu:::', __dirname + "/public/StatusUser/" + saveStatusUser.userStatus);
            }

        });
        fs.writeFile(__dirname + "/public/StatusUser/" + saveStatusUser.UserStatusItem, saveStatusUser.ArrayStatusItem, (err) => {

            if (err) {
                console.log('value:::', err);
            } else {
                console.log('luu status User thanh cong dia chi file luu:::', __dirname + "/public/StatusUser/" + saveStatusUser.UserStatusItem);
            }
        });

    });
    //client-muon-lay-ArrayStatus-public //statusUser.js.js ngay getUser(USer1)
    socket.on('client-muon-lay-ArrayStatus-User', userStatus => {
        if (err) {
            console.log('value:::', err);
        } else {
            console.log('this.state.User + "StatusUser', userStatus);
            fs.readFile(__dirname + "/public/StatusUser/" + userStatus.userStatus, (err, data) => {

                // console.log('data::::', data.toString());
                var ArrayStatus = data.toString();
                console.log('data::::', ArrayStatus);
                io1.sockets.emit('server-trave-yeucau-ArrayStatus-User', ArrayStatus);
            });
        }
    });

    //client-StatusPublic-yeu-cau-StatusUser-Gui-ArrayStatusUser
    /*  socket.on('client-StatusPublic-yeu-cau-StatusUser-Gui-ArrayStatusUser',User_socketIdThoaMan => {
          console.log('User_socketIdThoaMan',User_socketIdThoaMan);
          (User_socketIdThoaMan.ArraySocketIdThoaMan).map( function(socketId, index){
              io1.to(socketId).emit('server-StatusPublic-yeu-cau-StatusUser-Gui-ArrayStatusUser',User_socketIdThoaMan.User);
              //app component StatusUser.js se lang nghe va tra cho ArrayStatusItem de StatusPublic hien thi
              //nhung khi no khong Online thi khong lay duoc ma ta luu mang StatusUser tren server o (3*)
              //thi ta chi can qua do coc thui nhe chi can gui User xuong moc o server nodejs
          });
      }); */

    //o trong StatusPublic ben trong render( <View>) 
    /* socket.on('client-StatusPublic-yeu-cau-StatusUser-Gui-ArrayStatusUser', ReadStatusUserPublic => {
        // User_item: User + "StatusPublic_User.docx", ArraySocketIdThoaMan: this.state.ArraySocketIdThoaMan
         console.log('User_socketIdThoaMan', ReadStatusUserPublic);
         var path = __dirname + "/public/StatusUser/" + ReadStatusUserPublic.User_item;
         fs.readFile(path, (err, StatusUser) => {
             if (err) {
                 console.log('voi satatus cua' + + "chua duoc luu tren server")
             }
             else {
                 console.log('data::::', StatusUser.toString());
                 var StatusUser_item = StatusUser.toString();
                 (ReadStatusUserPublic.ArraySocketIdThoaMan).map(function (socketId, index) {
                     io1.to(socketId).emit('server-StatusPublic-yeu-cau-StatusUser-Gui-ArrayStatusUser', StatusUser_item);
                     //app component StatusUser.js se lang nghe va tra cho ArrayStatusItem de StatusPublic hien thi
                     //nhung khi no khong Online thi khong lay duoc ma ta luu mang StatusUser tren server o (3*)
                     //thi ta chi can qua do coc thui nhe chi can gui User xuong moc o server nodejs
                 });
             }
         });
     }) 
 
 
     //add-friend
     //khi nhan duoc loi moi ket ban ta se push vao 1 mang va mang nay la 1 phong
     //mang ten la UsernameAddFriend + UsernameConfig: + .... cong ten dat car thang moi add vao la 1 phong 
     //do cac username co 1 ten duy nhat nen cong cac ten lai no cung co 1 ten duy nhat
     var ArrarAddFriend = [];
     socket.on('add-friend', addFriend => {
         ArrarAddFriend.push(addFriend.UsernameAddFriend);
         ArrarAddFriend.push(addFriend.UsernameConfig);
         console.log('ArrarAddFriend:::::', ArrarAddFriend);
     }) */


});




app3.get('/image', (req, res) => {
    res.render('image');
})


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

});

app3.get('/ChatUsername', (req, res) => {
    res.render('ChatUsername');
})

app3.get('/status', (req, res) => {
    res.render('status')
});
app3.get('/statusPublic', (req, res) => {
    res.render('StatusPublic');
});
app3.get('/statusUser', (req, res) => {
    res.render('statusUser');
});
app3.get('/statusFriend', (req, res) => {
    res.render('statusFriend');
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

app4.listen(2900, console.log('connect-port 2900 text jsonwentken'));

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

