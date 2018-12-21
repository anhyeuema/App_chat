var express = require('express');
var app = express();

var Formidable = require('express-formidable');

var server = require('http').Server(app);

app.use(express.static('public'));// khai bao thu vien cho file duoi .js trong file ejs

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
//lang nghe
io.on('connection', (socket) => {

    console.log('client-connected-port-3500-de chat:' + socket.id);

    socket.on('web-send-messenger-chat-rooms', mesRooms => {
        console.log('messenger Rooms : ' + mesRooms);
        io.sockets.in(socket.phong).emit('server-send-messengerText-chat-rooms',{ms: mesRooms, un: socket.Username} )
    });
    socket.on('tao-room-web', nameRoom => {
        var mang = [];
      //  console.log('Room::::',socket.adapter);
      //  console.log('Room::::',socket.adapter.rooms);
        socket.phong = nameRoom;
        socket.Username = nameRoom;
        socket.join(nameRoom);
        for( r in socket.adapter.rooms) {
            mang.push(r);
            console.log('r:::::',r);
        }
        console.log('mang:::::',mang);
        io.sockets.emit('server-send-danhsach-rooms',mang);
        socket.emit('server-send-romm', socket.phong);

    })

    socket.on('app-send-image-picker', imagePicker => {
        // imagePicker = {uri: 'data:image/jpeg;base64,' + base64}
        console.log("imagePicker::::" + imagePicker);
        io.sockets.emit('server-send-imagePK-fromApp-toAppWeb', imagePicker);

    })
    socket.on('app-send-messenger-text', MS => {
        console.log('messenger la : ' + MS);
        io.sockets.emit('server-send-messenger-from-app-to-AppAndWeb', { un: socket.id, ms: MS })
    })
    socket.on('web-send-messenger', (mstext) => {
        io.sockets.emit('server-send-messenger-from-web-to-AppAndWeb', { un: socket.Username, ms: mstext });
    });

    socket.on('web-send-dang-ky-user', user => {
        console.log('useename is: ' + user);
        if(mangUsername.indexOf(user)>= 0) {
            socket.emit('server-dangky-thatbai');
        } else {
            mangUsername.push(user);
            socket.Username = user;
            socket.emit('sever-send-username-thanhcong', user);
            console.log('socket.Username::::',socket.Username);
            console.log('mangUsername::::',mangUsername);
            io.sockets.emit('server-send-danhsach-Usernanme', mangUsername);
        }
        
    });
    socket.on('web-send-messenger-text', mesWeb => {
        console.log('messenger Web: ' + mesWeb);
        io.sockets.emit('server-send-from-mesWeb-toAppWeb', {ms: mesWeb, un: socket.Username});
    }) ;
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
var app2  = express();
app2.listen(1500, console.log('app2-start-port 1500-upload-image-From-app-to-web'))

var Formidable = require('express-formidable');
app2.use(Formidable({
    uploadDir: './public/upload',
    encoding: 'utf-8',
}));

app2.post('/reactNative/Upload', (req, res) => {
    console.log('req.fields::::', req.fields);
    console.log('req.files::::', req.files);
    res.send('hello server http://192.168.0.103:1500/reactNative/Upload')
});







