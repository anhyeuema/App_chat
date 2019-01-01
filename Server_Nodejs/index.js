var express = require('express');
var app = express();
var path = require('path');
var Formidable = require('express-formidable');

var server = require('http').Server(app);

app.use(express.static('public'));// khai bao thu vien cho file duoi .js trong file ejs
app.use(express.static(path.join(__dirname, 'upload'))); //thu muc de chua thu vien cho anh trong file ejs hoac html

app.set('view engine', 'ejs'); //khai bao su dung ejs khi res.render
app.set('views', './views');

server.listen(3500, console.log('server_start_port_3500-de-lang-nghe-socket.io-send-image-from-Web-to-App'));
var io = require('socket.io')(server);

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
            console.log('req.file.buffer.toStringbase64::', req.file.buffer.toString('base64'));//  req.file.buffer la dang buffer
            io.sockets.emit('server-send-imageBase64-fromweb-toAppAndWeb', { imageWebBase64: req.file.buffer.toString('base64') });//chuyen sang base64 dung  req.file.buffer.toString('base64') 
            res.render('chat'); // load lai ejs chatSocketIO thi ben nay se k hen anh nhung doi tuong App va ng khac se nhan duoc base64
        } else {

            // A Multer error occurred when uploading.
            res.send('loi');
        }
        // Everything went fine.
    })
});

var mangUsername = [];
var mangSoketID = [];
var i = 30;

var mangUsSocket = [];
var j=60;

var mangDSUsernamePhong = [];
var k=90;

var l = 0;
//lang nghe

var n = 0;
io.on('connection', (socket) => {

    console.log('client-connected-port-3500-de chat:' + socket.id);
    
  
   
    socket.on('App-send-Username-la-phong-dai-dien-socket.phong-ca-nhan',usernamephong => {
        console.log('socket.adapter.rooms::',socket.adapter.rooms); 
        socket.phong=usernamephong;
        socket.join(usernamephong);
     //   console.log('join(usernamephong):::',socket.join(usernamephong));
        for (r in socket.adapter.rooms) {
            mangDSUsernamePhong.push({key: k=k+1,phong: r});
            console.log('r;;;;',r);
            console.log('mangDSUsernamePhong',mangDSUsernamePhong);
        }
        io.sockets.emit('server-send-danhsach-usernamephong',mangDSUsernamePhong);
    });
     //lang nghe app nhan TouableOpacity app-send-socket.phong-ca-nhan
     socket.on('app-send-socket.phong-ca-nhan', phongCaNhan => {
        console.log('phongcanhan là', phongCaNhan);
        io.sockets.in(socket.phong).emit('server-send-phong-ca-nhan',phongCaNhan);
    });



    //lang nghe app-send-socket.username-va-messenger
    socket.on('app-send-socket.username-va-messenger', UsSoketApp => {
        console.log('ca nhan UsSoketApp la socket.Username', UsSoketApp);
        io.to(UsSoketApp.UsSoket).emit('server-send-socket.Username-rieng-da-TouchableOpacity-trong-appReact-native',UsSoketApp);
    });
    //tao mang hung usename tu tap thuoc tinh socket.username
    socket.on('App-send-Username-dai-dien-socket.Username-ca-nhan',us => {
        console.log('us:::::::::');
        console.log('us:::::::::',us);
        socket.us=us;
        mangUsSocket.push({ key: j = j + 1, UsSoket: us });
        io.sockets.emit('server-send-socket.Username', mangUsSocket);
        console.log('mang socket.Username la:::::::::', mangUsSocket);
    });


      //lang nghe app send link uri image app-chatSocketID-send-uri-image
      socket.on('app-chatSocketID-send-uri-image',uriSkID => {
        console.log('uri tu image picker tren app send xuong::',uriSkID);
        
        socket.emit('server-tra-lai-uri-cho-app', [{key: 2*n+1, skidApp: socket.id, source: uriSkID.source1 }]); //truyen socket.id cua app tra lai anhr cho App
        console.log('mang uri tu image picker tren app send xuong::',[{key: 2*n+1, skidApp: socket.id, source: uriSkID.source1 }]);
        io.to(uriSkID.skID1).emit('server-send-uri-image', uriSkID);
    });
    //lang nghe app nhan vao danh sach soketID 
    socket.on('App-send-socketID-ca-nhan', socketIDrieng => {
        //emit lat chinh cai app da emit socketID ca nhan de App do nhan duoc chinh cai tin nhan cua chinh socketid cua app do
        socket.emit('server-tra-ve-tin-nhan-cho-chinh-nguoi-gui',[{key: l+2, skidApp: socket.id, ms: socketIDrieng.messengerT}]);
        console.log('socketID rieng la: ' + socketIDrieng);
        console.log('socketIDrieng.skID1 rieng la: ' + socketIDrieng.skID1);
        console.log('socketIDrieng.messengerT rieng la: ' + socketIDrieng.messengerT);
        //emit chi ti cai socket.id da duoc nhan tren react-native app
        io.to(socketIDrieng.skID1).emit('server-send-socketID-Rieng', socketIDrieng);
    });

    //tao mang hung socketid
    mangSoketID.push({ key: i = i + 1, skID: socket.id });
    console.log('mangsocktID::::', mangSoketID);
    //emit danh sach soket.ID
    io.sockets.emit('server-send-danhsach-socketID', mangSoketID);

    //emit socketid cua ban than cai app do co soket gi
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







