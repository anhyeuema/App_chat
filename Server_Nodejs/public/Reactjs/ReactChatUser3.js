




function getCookie(NameCookie) {
    ArrayTokenThoanMan = [];
    var dataCookie = document.cookie;
    //  console.log('dataCookie REACTJS REACTJS REACTJS REACTJS REACTJ:::', dataCookie)
    var ArrayCookie = dataCookie.split(" "); //loai bo dau cach va tao mang
    $(ArrayCookie).each((index, value) => {
        if (value.indexOf(NameCookie) > -1) {
            var token1 = value.replace(NameCookie, ''); //loai bo ky tu @token= chi lay gia tri token thui
            ArrayTokenThoanMan.push(token1);
            //           console.log('ArrayTokenThoanMan[0] REACTJS REACTJS REACTJS REACTJS::', ArrayTokenThoanMan[0]);
        }
    });
    if (ArrayTokenThoanMan[0] == null || ArrayTokenThoanMan[0] == 'undefined') {
        return [];
    }

    if (ArrayTokenThoanMan[0].indexOf(";") > -1) {
        var token = ArrayTokenThoanMan[0].replace(";", ''); //loai bo dau phay
        //  console.log('token:::4444', token);
        return token;
    }
    return ArrayTokenThoanMan[0];

}

var token = getCookie("@token=") == null ? (getCookie("@token=")) : (localStorage.getItem("@token"));
//  var token = localStorage.getItem('@token') ;

//  console.log('token REACTJS REACTJS REACTJS REACTJS REACTJS::', token);
var io1 = getCookie("io=");
var dataCookie = document.cookie;
//  console.log('dataCookie: REACTJS REACTJS REACTJS REACTJS:', dataCookie);

function getUser(value) {
    var x = 3;

    $.get("http://localhost:2800/checkLogin/" + value, function (data) {

        console.log('data checkLogin::::', data);
        var dataParse = JSON.parse(data);
        var tokenNew = dataParse.tokenNew;
        var UsernameNguoiSend = dataParse.Username;

        // $('#NguoiSend').append("<div class='ClassNguoiSend' >" + UsernameNguoiSend + "</div>");
        //  $('#NguoiSend').css("color", "#00BF00");
        function setCookie(NameCookie, value, expiredays) {
            var ExpireDate = new Date;
            ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 60 * 60 * 1000));
            return document.cookie = NameCookie + "= " + escape(document.cookie = value) +
                (ExpireDate == null ? "" : "; expires =" + ExpireDate.toUTCString());
        }
        setCookie("@token", tokenNew, 5);
        console.log('UsernameNguoiSend REACTJS REACTJS REACJS:::', UsernameNguoiSend);
        return x = UsernameNguoiSend;
    });
    return x;
    // console.log('x x x x:::', x);
}

var User = getUser(token);
//  console.log('User: User User v v User User User User  v User', User);


var Note = React.createClass({

    getInitialState() {

        return {
            mang: [
                { srcHinh: "http://localhost:2800/hotgirls/1.jpg", noidung: "hello" },
                { srcHinh: "http://localhost:2800/hotgirls/2.jpg", noidung: "anh yeu em" },
                { srcHinh: "http://localhost:2800/hotgirls/3.jpg", noidung: "nhe " },
                { srcHinh: "http://localhost:2800/hotgirls/4.jpg", noidung: "tinh " },
                { srcHinh: "http://localhost:2800/hotgirls/5.jpg", noidung: "tianh" },
            ],
        }
    },
    render: function () {
        return (
            <div>
                <div>
                    <h1 className="mauvang">chao em</h1>
                </div>
                {
                    this.state.mang.map(function (value, index) {
                        return (
                            <div key={index}>
                                {
                                    <div id="avatar">
                                        <img src={value.srcHinh} />
                                    </div>

                                }
                                {
                                    <a>: {value.noidung}</a>
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    },

});

$.get("http://localhost:2800/checkLogin/" + token, function (data) {

    console.log('data checkLogin::::', data);
    var dataParse = JSON.parse(data);
    var tokenNew = dataParse.tokenNew;
    var UsernameNguoiSend1 = dataParse.Username;

    // $('#NguoiSend').append("<div class='ClassNguoiSend' >" + UsernameNguoiSend + "</div>");
    //  $('#NguoiSend').css("color", "#00BF00");
    function setCookie(NameCookie, value, expiredays) {
        var ExpireDate = new Date;
        ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 60 * 60 * 1000));
        return document.cookie = NameCookie + "= " + escape(document.cookie = value) +
            (ExpireDate == null ? "" : "; expires =" + ExpireDate.toUTCString());
    }
    setCookie("@token", tokenNew);
    setCookie('@UserClient', UsernameNguoiSend1);
});

var User = getCookie("@UserClient=");
var e;
var U;

var UserWeb = User;
var socket = io.connect('http://localhost:2800');
socket.on('connect', function (data) {
    // var Eemit = this; 
    socket.emit('client-send-Username', UserWeb); //co ket noi cai la gui luon username
    console.log('client-send-Username UsernameNguoiSend CheckUser ', UserWeb)
});

var CheckUser = React.createClass({

    testHam() {
        alert('testham');
    },
    EmitMess(){
            e = this;
            var UserWeb = this.state.UserWeb;
        //  var ArrdataMessenger = this.state.ArrControlItemMess;
            console.log('ArrdataMessenger = ArrControlItemMess', ArrControlItemMess.length);
            if (UserWeb == null) {
                console.log('chua chon nguoi nhan nhe!!!!', UserWeb)
            }
            else if (this.state.UserWeb !== null) {
                //const { UsernameNguoiSend } = this.state;
                //cap nhan co ng emit gui messe
                // console.log('this.state.UserSendEmit', UserSendEmit);
                //test thu message text send di 
            //  e.setState({ messenger: 'Instead of playing the guessing game, when you try all the different combinations till you find the one that fits, just use the following modifiers props: left, top, right & bottom.' });
            //  e.setState({ UserSendEmit: UsernameNguoiSend });
                //  console.log('this.state.UsernameNguoiSend', UserSendEmit) // UserSendEmit = app
                //   console.log('this.state.UsernameNguoiSend', UsernameNguoiSend);
    
                

                //const { Username, ArraySocketIdThoaMan, messenger, imageBase64, pathIma } = this.state;
                const { UserWeb, ArraySocketIdThoaMan, messenger, imageBase64, pathIma } = this.state;
                var dataEmit = {
                    key: '0',
                    UsernameNguoiNhan: UserWeb, //UserWeb hoac Username
                    UsernameNguoiSend: User,
                    DSsocketIdNguoiNhan: ArraySocketIdThoaMan,
                    messenger: this.refs.txt.value,
                    imageBase64: '',
                    pathIma: 'http://192.168.216.2:2800/hotgirls/3.jpg',

            
                };
                socket.emit("client-send-messenger", dataEmit);
                 console.log('client-send-messenger dataEmit', dataEmit);
    
                e.setState({ m: (parseInt(this.state.m) + 1), });//so lan emit 1 lan emit la 1 lan cap nhat mang tin nhan cua app nhe
                //  console.log('this.state.m::::', this.state.m);
    
                //co can moc len tu server khong ta
    
                //hien thi tin nhan len app khi emit thi chi hien thi cho chinh no chu k can emit cho chinh no
                //const { ArrControlItemMess } = this.state; //moc gia chi khida setState o this.on('server-send-messenger')
                //    console.log('SaveDataMessengerApp moc tu this.on(server-send-messenger da setState ', SaveDataMessengerApp)
            
                
                var UserSendKey = {  //them 1 obj moi vao flatlist
                    key: JSON.stringify((ArrdataMessenger.length) + 1), //ket se duoc tang len 1, so thu tu no khong bat dau tu 0. mang.length bat dau tu 1
                    UserSend: '',
                    messenger: '',
                    UserNhan: User,//User = UsernameNguoiSend, //hien thi nguoi gui gio la app gui web
                    messengerNhan: UserWeb == null ? null : messenger, //ti doi UserWeb = Username
                    imageBase64: UserWeb == null ? null : imageBase64,
                    pathIma: UserWeb == null ? null : pathIma,
    

                //  messengerNhan: Username == null ? null : messenger, //ti doi UserWeb = Username
                //  imageBase64: Username == null ? null : imageBase64,
                //  pathIma: Username == null ? null : pathIma,
    
                };
                ArrdataMessenger.push(UserSendKey);
            //  ArrarySaveDataMessenger.push(UserSendKey); //ArrarySaveDataMessenger = ArrdataMessenger
                // console.log('sendEmit...ArrarySaveDataMessenger', ArrarySaveDataMessenger);
            //  e.setState({
            //      ArrUserSendKey: ArrdataMessenger,
            //      SaveDataMessengerApp: ArrdataMessenger,
            //      ArrControlItemMess
            //  });
            //  const { ArrUserSendKey } = this.state;
                // console.log('this.state.ArrUserSendKey sendEmit::::', ArrUserSendKey);
            //  console.log('this.state.SaveDataMessengerApp sendEmit::::', SaveDataMessengerApp.length);
    
        
                if (ArrdataMessenger[0] !== null) {
                    e.setState({  //bat dau lien faltlist cap nhat gia tri moi
                        //khi kich chuot vao username muon chat ta moi moc du lieu ti nhan tu server nodejs hien thij len cho nguoi
                        // dungva gio dim cah co ng gui tin nhan la hien thong bao co tin nhan
                        ArrControlItemMess: ArrdataMessenger,
                    });
                }
                console.log('this.state.ArrControlItemMess REACTJS sendEmit::::', ArrControlItemMess);
    
    
    
            }
    
        
    },
    LoadMess() {
        //khi co hien thi tin nhan nguoi gui kich chuot vao se load tin nhan nguoi gui ve
        e = this;

        //var UserWeb = 'ti';
        //const {  UsernameNguoiSend } = this.state;
        //var dataYeuCau = {
        //  NameUserSendUserItem: (UsernameNguoiSend + UserWeb + "ChatUsername.docx"),
        //  ArrSocketId_UserSend: ArrSocketId_UserSend,
        //  UserYeuCauMess: UsernameNguoiSend, //UserApp,
        //  soPage: 1,
        //  soPage: this.state.soPage,
        // };

        //  var UserWeb = this.state.Username  //var UserWeb = Username;
        var UsernameNguoiSend = User;
        const { UserWeb } = this.state; //********************hay coi la dang chat voi web coi app la web do phai sua nhieu code
        var dataYeuCau = {
            NameUserSendUserItem: (UsernameNguoiSend + UserWeb + "ChatUsername.docx"),
            //  ArrSocketId_UserSend: ArrSocketId_UserSend,
            UserYeuCauMess: UsernameNguoiSend, //UserApp,
            soPage: this.state.soPage,
            //      soPage: 1,
        };
        socket.emit('client-muon-lay-ArrayMess-User', dataYeuCau);
        console.log('client-muon-lay-ArrayMess-User datayeaucau', dataYeuCau);

        socket.on('server-trave-yeucau-ArrayMess-User', DataMessengerApp_r => {
            console.log('server-trave-yeucau-ArrayMess-User hienthiMess chuyen cho flatlist::', DataMessengerApp_r);
            //console.log('SaveDataMessengerApp[0] !== undefined:::',SaveDataMessengerApp[0] !== 'undefined')
            var Nms = DataMessengerApp_r.Nms;
            var Sms = DataMessengerApp_r.Sms;
            var SaveDataMessengerApp_r = Sms;
            e.setState({
                YeuCauArrMess: SaveDataMessengerApp_r,
                Nms: Nms,

            });
            var SaveDataMessengerApp = SaveDataMessengerApp_r;
            //var x= '[]' x.length=1
            if (SaveDataMessengerApp[0] == '0' && SaveDataMessengerApp.length == 1) {
                //khong lam gi ca nhe
                console.log('flalist khong lam gi ca voi SaveDataMessengerApp');
                // e.setState({ 
                //     ArrControlItemMess: [],
                /// });
            }
            else if (SaveDataMessengerApp[0] == '[' && SaveDataMessengerApp.length > 1) { //neu ArrayMessUsersendUserItem[0]  khac rong thi ta JSON.parser
                var SaveDataMessengerApp1 = JSON.parse(SaveDataMessengerApp_r);// Neu ArrayMessUsersendUserItem[0] == rong thi ta bo qua cau lenh trong if
                const { Nms } = this.state;
                e.setState({
                    ArrUserSendKey: SaveDataMessengerApp1,
                    //  SaveDataMessengerApp: SaveDataMessengerApp,
                    SoKey: Nms - SaveDataMessengerApp1.length,
                });
                console.log('this.state.SaveDataMessengerApp flatlist; !==0;;;;;', this.state.ArrUserSendKey);
                console.log('this.state.SoKey flatlist;;;;;;', this.state.SoKey);//////
                //nhan duoc ket qua SaveDataMessengerApp tu server tra ve ta moi setState no cho phep mang duoc set moi
                if (this.state.ArrUserSendKey[0] !== null) { //ca mang server tra tin nhan ve moi thuc su cap nhat mang lhac rong vao faltlist cua faltlist danh sach tin nhan
                    
                    e.setState({
                        //khi kich chuot vao username muon chat ta moi moc du lieu ti nhan tu server nodejs hien thij len cho nguoi
                        // dungva gio dim cah co ng gui tin nhan la hien thong bao co tin nhan
                        ArrControlItemMess: this.state.ArrUserSendKey,
                        ControlLoadMes: true, // dieu khien hien co load hay khong
                        //SoKey: (Nms -ArrdataMessenger.length) 
                    });
                    console.log('this.state.ArrControlItemMess flatlist;;;;;;', this.state.ArrControlItemMess);

                }
            }

        });
    },
    onMess() {

        //console.log(' uuuuuuuuu UsernameNguoiSend REACTJS REACTJS REACJS:::', this.state.UsernameNguoiSend);

        //  alert(this.state.UsernameNguoiSend);
        e = this;
        e.setState({ UsernameNguoiSend: User })
        console.log(' uuuuuuuuu UsernameNguoiSend REACTJS REACTJS REACJS:::', this.state.UsernameNguoiSend);

        //     var UserWeb = this.state.UsernameNguoiSend;


        /*
        var UserWeb = User;
        var socket = io.connect('http://localhost:2800');
        socket.on('connect', function (data) {
            // var Eemit = this; 
            socket.emit('client-send-Username', UserWeb); //co ket noi cai la gui luon username
            console.log('client-send-Username UsernameNguoiSend CheckUser ', UserWeb)
        }); */


        //   e.setState({ UserWeb: this.state.UsernameNguoiSend });
        //    console.log('this.state.UserWeb client-send-Username UsernameNguoiSend CheckUser ',this.state.UserWeb)

        /*
        socket.on('server-send-socket.id+Username', ArraySocketUsername => {
            e.setState({ mang: ArraySocketUsername });
            console.log('eeeeeeeee eee server-send-socket.id+Username:::::: cmdddd', this.state.mang)
        }); */

        socket.on('server-send-socket.id+Username', (ArraySocketUsername) => {
            console.log('ArraySocketUsername Reactjs REACTJS:::', ArraySocketUsername);
            e.setState({ ArraySocketUsername: ArraySocketUsername });
            var ArrayUserSocketId1 = [];
            var arrayUsername1 = [];
            var ArraySocketUsername = this.state.ArraySocketUsername;
            ArraySocketUsername.map(function (value, index) {
                var UserSocketId = value.UserSocketId;
                var Username = value.Username;
                /*
                 if (Username == false) { //neu Username = null thi khong phush vao
                    console.log('dong message nay luon luon duoc in ra, hehe');
                }
                */
                if (Username !== null || Username !== '' || Username !== null || Username !== 'undefined') {
                    ArrayUserSocketId1.push(UserSocketId);
                    arrayUsername1.push(Username);
                }
            });
            //  console.log('ArrayUserSocketId Reactjs REACTJS REACTJS REACTJS REACTJS:::', ArrayUserSocketId1);
            //   console.log('arrayUsername1 Reactjs REACTJS REACTJS REACTJS REACTJS:::', arrayUsername1);

            e.setState({
                ArrayUserSocketId: ArrayUserSocketId1,
                arrayUsername: arrayUsername1,
            });

            function deduplicate(arr) {
                var isExist = (arr, x) => {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] === x) return true;
                    }
                    return false;
                }
                var ans = [];
                arr.forEach(element => {
                    if (!isExist(ans, element)) ans.push(element);
                });
                return ans;
            }
            var mangU1 = deduplicate(this.state.arrayUsername);
            //    console.log('mangU1111111 REACTJS REACTJS REACTJSREACTJS', mangU1); //mang Username khong co phan tu lap

            /*
             var MangUserKey = [];
             var m = mangU1.length;
             for (i = 0; i < m; i++) {
                 MangUserKey.push({ key: JSON.stringify(i), Userkey: mangU1[i] });
                 // console.log('MangUserKey::::', MangUserKey);
             }
             console.log('MangUserKey REACTJS REACTJS REACTJS REACTJS REACTJS::::', MangUserKey); 
 
             //loai bo ky Username = [] trong danh sach caht neu co
             var mangU2 = [];
             for (i = 0; i < mangU1.length; i++) {
                 var User = mangU1[i];
                 if (User === '' || User === []) {
 
                 }
                 else if (User !== '' || User !== []) {
                     mangU2.push(User);
                 }
             }
             console.log('mangU2 REACTJS REACTJS REACTJS REACTJS loai bo username rong::::', mangU2); */

            //mang hung du lieu mangU1 ma tao mang moi ArrUserKey co chua key 
            var ArrUserKey = [];
            mangU1.map(function (value, index) { //index thay cho key
                if (value !== null || value !== undefined || value !== []) {
                    var UserKey = { key: JSON.stringify(index), Userkey: value };
                    ArrUserKey.push(UserKey);
                }

            });
            console.log('ArrUserKey1 REACTJSREACTJSREACTJSREACTJS::::', ArrUserKey);
            e.setState({
                mangU: ArrUserKey
            });


        });

        socket.on('server-send-messenger', (dataMessenger) => {
            console.log('dataMessenger REACTJS:::', dataMessenger);
            // e.setState({ dataMess: dataMessenger });

            e.setState({ p: (this.state.p + 1) });

            console.log('pppppppppppppppppppppppppppppppppppppppppppppppppp', this.state.p);
            e.setState({
                UserWeb: dataMessenger[0].UsernameNguoiSend, //web sen toi app App la thang duoc kich chuot la Username
                UserApp: dataMessenger[0].UsernameNguoiNhan,
                soPage: 1, //de hien thi la ra tin nhan moc ve 1 tinh tu length max - 1.m = hien thi so phan tu tu lon nhat toi -m phan tu
            });
            //  console.log('this.state.UsernameNguoiNhan !== "":::', this.state.UserApp);
            const { UserApp, Nms, Username, OnManSendMs, UserWeb, SoKey } = this.state; //UserApp = UsernameNguoiSend, 
            console.log('this.state.UserWeb server-send-messenger CheckUser ', this.state.UserWeb)

            OnManSendMs.push(UserWeb);
            console.log('OnManSendMs::lap', OnManSendMs);

            function deduplicate(arr) {
                var isExist = (arr, x) => {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] === x) return true;
                    }
                    return false;
                }
                var ans = [];
                arr.forEach(element => {
                    if (!isExist(ans, element)) ans.push(element);
                });
                return ans;
            }
            var OnManSendMs_r = deduplicate(OnManSendMs);
            var m = OnManSendMs_r.length;
            e.setState({ OnManSendMs: OnManSendMs_r });
            console.log('OnManSendMs::ArrDoneLap', this.state.OnManSendMs.length);

            console.log('Nms:socket.on(server-send-messenger:::::', Nms);
            if (dataMessenger[0] !== null) {
                var ArrdataMessenger = this.state.ArrUserSendKey;
                // console.log('ArrdataMessenger da JSON.parse:!==0:::', ArrdataMessenger);
                var ArrMessSendServer = []; // ArrMessSendServer chi lay 1 phan tu hay vai phan tu tu tin nhan new duoc web gui toi
                console.log('Username:WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW socket.on(server-send-messenger::', Username);
                var { arrThemOnMes } = this.state;
                console.log('arrThemOnMes', arrThemOnMes);
                if (Username == '') { //chua chon ten nguoi chat nguoi nhan tin nhan
                    dataMessenger.map(function (dataEmit, index) {
                        //Nms la so phan tu tinnhan luu o server 
                        arrThemOnMes.unshift(dataEmit);
                    });
                    console.log('arrThemOnMes sau khi unshift splice(m, 1)', arrThemOnMes);
                    //  console.log('arrThemOnMes', arrThemOnMes);
                    if (arrThemOnMes.length >= (m + 1)) {
                        var ptuXoa = 1;///m- this.state.a=1; //m  = this.state.a
                        //  console.log('ptuXoa:::::::::',m);      
                        console.log('ptuXoa:::::::::', ptuXoa);
                        //    console.log('so phantu khong lap :', m);
                        //    console.log('var xoa phan tu thu 2 nao', arrThemOnMes.length + ">=" + (m));
                        // neu m tang len 1 thi phan tu xoa cung tang 1 = m- this.state.a
                        arrThemOnMes.splice(ptuXoa, 1); // XOA 1 PHAN TU O VI TRI THU 2, de lai vi tri thu nhat
                        // co the dung unshift() / shift() — thêm/xóa phần tử từ vị trí đầu mảng
                        //dao gia tri them hien thi
                        e.setState({ arrThemOnMes: arrThemOnMes, });
                        e.setState({ a: arrThemOnMes.length, })
                        console.log('this.state.aaaaaaaaaaaaaaaaaa sau khi splice(m, 1)', this.state.a);
                        console.log('arrThemOnMes sau khi splice(m, 1)', arrThemOnMes);
                        //  e.setState({  arrThemOnMes: arrThemOnMes, });
                        // e.setState({ arrThemOnMes: arrThemOnMes, });
                        var arrThemOnMesKetQua = [];
                        arrThemOnMes.map(function (dataEmit, index) {
                            //Nms la so phan tu tinnhan luu o server 
                            //  var index_goc = Nms + index; //gia tri goc tinh tu cai nhan duoc server gui len
                            var UserSendKey = {
                                // key: JSON.stringify(SoKey + ArrdataMessenger.length + index), //do index gia tri bat dau tu 0, index=0 MIN
                                key: JSON.stringify(index), //do index gia tri bat dau tu 0, index=0 MIN
                                UserSend: dataEmit.UsernameNguoiSend, //thang send cho Userapp, va app dang la thang nhan nhung lai dat o this.state( la UsernameNguoiSend )
                                messenger: dataEmit.messenger,
                                imageBase64: dataEmit.imageBase64,
                                pathIma: dataEmit.pathIma,
                                UserNhan: '', //them vao de hien thi thoi
                                messengerNhan: '',
                            };
                            // console.log('.UserSendKey::::', UserSendKey);
                            arrThemOnMesKetQua.push(UserSendKey);
                            //  ArrMessSendServer.push(UserSendKey);
                            ArrdataMessenger = arrThemOnMesKetQua;
                            //  ArrUserSendKey = arrThemOnMesKetQua;

                        });

                        //   console.log('ArrdataMessenger', ArrdataMessenger);

                        console.log('ArrdataMessenger xoa phan tu thu ' + m + 'con :', ArrdataMessenger);
                    }

                } else if (Username !== '') {
                    //khi 
                    if (Username  !==null && UserWeb !==null) { //cho cho thang duoc kich chuot hien thi tren flatlist hien tai => Username == Username gui tin nha cho o day la web
                        dataMessenger.map(function (dataEmit, index) {

                            //Nms la so phan tu tinnhan luu o server 
                            //  var index_goc = Nms + index; //gia tri goc tinh tu cai nhan duoc server gui len
                            var UserSendKey = {
                                //key: JSON.stringify(Nms + index), //do index gia tri bat dau tu 0, index=0 MIN
                                key: JSON.stringify(SoKey + ArrdataMessenger.length + index), //do index gia tri bat dau tu 0, index=0 MIN
                                // key: JSON.stringify((Nms -ArrdataMessenger.length) + ArrdataMessenger.length + index_goc)// so lenth max mang tin nhan server - so phan tu truyen len client=sokey //SoKey = Nms - ArrdataMessenger.length // key: JSON.stringify((Nms -ArrdataMessenger.length) + ArrdataMessenger.length + index_goc), //do index gia tri bat dau tu 0, index=0 MIN
                                UserSend: dataEmit.UsernameNguoiSend, //thang send cho Userapp, va app dang la thang nhan nhung lai dat o this.state( la UsernameNguoiSend )
                                messenger: dataEmit.messenger,
                                imageBase64: dataEmit.imageBase64,
                                pathIma: dataEmit.pathIma,
                                UserNhan: '', //them vao de hien thi thoi
                                messengerNhan: '',
                            };
                            // console.log('.UserSendKey::::', UserSendKey);
                            ArrdataMessenger.push(UserSendKey);
                            ArrMessSendServer.push(UserSendKey);
                        });

                    } else if (Username !== UserWeb) {
                        ///truong hop la 1 cai ten nguoi tich khong phai nguoi gui tu web thi khong lam gi ca
                        console.log('nguoi gui tin nhan khong hien thi o day vi chua kich chuot vao nguoi do');
                    }
                }

                // console.log('var ArrdataMessenger =  this.state.SaveDataMessengerApp::::', ArrdataMessenger);
                e.setState({
                    // SaveDataMessengerApp: ArrMessSendServer,
                    ArrUserSendKey: ArrdataMessenger,
                    ArrControlItemMess: ArrdataMessenger,
                });
                console.log('ArrControlItemMess::::', this.state.ArrControlItemMess);
            }
        });

    },
    getInitialState() {
        U = this;
        return {
            UsernameNguoiSend: '',

            ArrUserSendKey: [],//hien thi gian tiep messenger
            ArrControlItemMess: [], //hien thi mess chinh thuc
            // UserWeb: dataMessenger[0].UsernameNguoiSend, //web sen toi app App la thang duoc kich chuot la Username
            // UserApp: dataMessenger[0].UsernameNguoiNhan,
            UserWeb: '',
            UserApp: '',
            soPage: 1,
            Nms: '',
            Username: '',
            OnManSendMs: [],
            SoKey: '',
            arrThemOnMes: [],
            a: 0,

            dataMess: '',
            p: '',
            mang: [],

            //lang nghe socketId+ Username
            ArraySocketUsername: [],
            ArrayUserSocketId: [],
            arrayUsername: [],
            mangU: [],

            ControlLoadMes: '', //dieu khien load tin nhan

            YeuCauArrMess: '',//yeu cao 
            m: 0,// dem so lan emit
        }
    },
    render() {
        return (
            <div>
                <a>this.state.UsernameNguoiSend {this.state.UsernameNguoiSend}</a>
                {/*<a>{this.LoadMess()}</a>  */}
                <a>{console.log('this.state.UsernameNguoiSend:yyyyyyy:::::', this.state.UsernameNguoiSend)}</a>
                <div>
                    <button onClick={() => {
                        this.onMess();
                    }}>onMess</button>

                    <button onClick={() => {
                        console.log('this.state.ControlLoadMes:::',this.state.ControlLoadMes);
                        if(this.state.ControlLoadMes=='LoadMess') {
                            this.LoadMess();
                        }
                    }}>
                        LoadMess
                    </button>
                    <div>
                        <input defaultValue={this.props.children} ref="txt" id="send" />
                        <button onClick={() => {
                            
                        //  e.setState({ ArrControlItemMess: this.state.ArrControlItemMess });
                    //  var ArrdataMessenger = this.state.ArrControlItemMess;
                            this.EmitMess();
                        }}>
                            send
                        </button>
                    </div>
                </div>
                {
                    this.state.mangU.map(function (value, index) {
                        return (
                            <div id="ListUser" key={value.key}>
                                <a>{value.key}</a>
                                <button onClick={() => {
                                    e.setState({ Username: value.Userkey });

                                }}>
                                    <a>{value.Userkey}</a>
                                </button>

                            </div>
                        )
                    })
                }

                {
                    this.state.ArrControlItemMess.map(function (value, index) {
                        return (
                            <div key={value.key} id="ListMesseger">
                                {
                                    <button onClick={() => {
                                        alert(value.UserSend);
                                        e.setState({ 
                                            Username: value.UserSend,
                                            UserWeb: value.UserSend,
                                            ControlLoadMes: 'LoadMess', 
                                        
                                        });
                                        //  this.testHam(); // UserApp = UserWeb  , thuc hcat la UserWeb thay cho UserApp
                                        //  this.LoadMess();
                                        // this.LoadMess();
                                        if (UserWeb !== "") {
                                            //this.LoadMess();
                                        }
                                    }}>
                                        <div id="avatar">
                                            <div id="NguoiSend">{value.key + ": "}{value.UserSend}</div>
                                            <img src={value.pathIma} />
                                            <a>{value.messenger}</a>
                                        </div>
                                        { /*
                                            <div id="avatar">
                                                <div id="NguoiSend">{value.key + ": "}{value.UserSend}</div>
                                                <img src={value.pathIma} />
                                                <a>{value.messenger}</a>
                                            </div> :
                                            <div id="avatar">
                                                <div id="NguoiSend">{value.key + ": "}{value.UserSend}</div>
                                                <img src={value.pathIma} />
                                                <a>{value.messenger}</a>
                                                // hien thi cai emit di nua 
                                            </div>  */}
                                
                                    </button>

                            }
                                {
                                    // <a >: {value.messenger}</a>
                                }
                            </div>

                        );
                    })
                }

            </div>
        );
    },
    componentDidMount() {
        var that = this;
        $.get("http://localhost:2800/checkLogin/" + token, function (data) {

            console.log('data checkLogin::::', data);
            var dataParse = JSON.parse(data);
            var tokenNew = dataParse.tokenNew;
            var UsernameNguoiSend1 = dataParse.Username;

            // $('#NguoiSend').append("<div class='ClassNguoiSend' >" + UsernameNguoiSend + "</div>");
            //  $('#NguoiSend').css("color", "#00BF00");
            function setCookie(NameCookie, value, expiredays) {
                var ExpireDate = new Date;
                ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 60 * 60 * 1000));
                return document.cookie = NameCookie + "= " + escape(document.cookie = value) +
                    (ExpireDate == null ? "" : "; expires =" + ExpireDate.toUTCString());
            }
            setCookie("@token", tokenNew);
            //luu token moi
            // $('#ketquaCheckLogin').html(data);
            // $('#ketquaCheckLogin').css("color", "yellow");
            //khi nhay cao chat thi thu nhat la checktoken de lay username ve
            console.log('UsernameNguoiSend REACTJS REACTJS REACJS:::', UsernameNguoiSend1);

            console.log('UsernameNguoiSend THAT  ===REACTJS REACTJS REACJS that.setState({ UsernameNguoiSend: UsernameNguoiSend }):::', that.setState({ UsernameNguoiSend: UsernameNguoiSend1 }));

            console.log('UsernameNguoiSend UUUUU=== REACTJS REACTJS REACJS that.setState({ UsernameNguoiSend: UsernameNguoiSend }):::', U.setState({ UsernameNguoiSend: UsernameNguoiSend1 }));

            console.log('UsernameNguoiSend THIS THIS THIS  ===    REACTJS REACTJS REACJS that.setState({ UsernameNguoiSend: UsernameNguoiSend }):::', U.setState({ UsernameNguoiSend: UsernameNguoiSend1 }));

            e.setState({ UsernameNguoiSend: UsernameNguoiSend1 });

            //    console.log(' uuuuuuuuu UsernameNguoiSend REACTJS REACTJS REACJS:::', this.state.UsernameNguoiSend);

            //  var socket = io('http://localhost:2400');

            //   var socket = io.connect('http://localhost:2800');
            //   socket.on('connect', function () {
            //       socket.emit('authenticate', { token: tokenNew });
            //   });
            // console.log('11111111111111111111111111', { query: "token=" + tokenNew });

            /*    socket.on('connect', function (data) {
                    socket.emit('storeClientInfo', { customId: "000CustomIdHere0000" + UsernameNguoiSend });
                });  */

            //  localStorage.setItem('SaveDataMessengerApp', '')
            // socket.on('connect', function (data) {
            //     socket.emit('client-send-Username', UsernameNguoiSend); //co ket noi cai la gui luon username
            // });

            /*
            var socket = io.connect('http://localhost:2800');
            socket.on('connect', function (data) {
                socket.emit('client-send-Username', this.state.UsernameNguoiSend); //co ket noi cai la gui luon username
            });
            console.log('client-send-Username UsernameNguoiSend CheckUser ', this.state.UsernameNguoiSend)
            */

        });
        //  console.log(' uuuuuuuuu UsernameNguoiSend REACTJS REACTJS REACJS:::', this.state.UsernameNguoiSend);
        //  alert(this.state.UsernameNguoiSend)
        //   e.setState({ UserWeb: this.stat.UsernameNguoiSend });

        this.onMess();
        // this.state.ControlLoadMes == false ? console.log('chua co set du lieu'): this.LoadMess(); 
    }
})




/*
socket.on('connect', function (data) {
    socket.emit('client-send-Username', UsernameNguoiSend); //co ket noi cai la gui luon username
}); */

//    var socket = io('http://localhost:2400');
// var socket = io.connect('http://localhost:2800');

var ListMess = React.createClass({

    getInitialState() {
        e = this;
        return {
            ArrUserSendKey: [],//hien thi gian tiep messenger
            ArrControlItemMess: [], //hien thi mess chinh thuc
            // UserWeb: dataMessenger[0].UsernameNguoiSend, //web sen toi app App la thang duoc kich chuot la Username
            // UserApp: dataMessenger[0].UsernameNguoiNhan,
            UserWeb: '',
            UserApp: '',
            soPage: '',
            Nms: '',
            Username: '',
            OnManSendMs: [],
            SoKey: '',
            arrThemOnMes: [],
            a: 0,

            dataMess: '',
            p: '',
            mang: [],

            //  UserWeb: '',
        }
    },
    render: function () {
        return (
            <div>
                <a>this.state.UserWeb{this.state.UserWeb}</a>

                <div>{console.log(' uuuuuuuuu this.state.UserWeb REACTJS REACTJS REACJS:::', this.state.UserWeb)}</div>
                <div>
                    {/*  <CheckUser></CheckUser> */}
                </div>
                <div>
                    <h1 className="mauvang">chao em</h1>
                </div>
                {
                    this.state.ArrControlItemMess.map(function (value, index) {
                        return (
                            <div key={value.key}>
                                {
                                    <div id="avatar">
                                        <img src={value.pathIma} />
                                        <a>{value.messenger}</a>
                                    </div>

                                }
                                {
                                    <a >: {value.messenger}</a>
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    },
    componentDidMount() {
      //var that = this;
        // var that = this;
  
        /*
        $.get("http://localhost:2800/checkLogin/" + token, function (data) {
            var that = this;
            console.log('data checkLogin::::', data);
            var dataParse = JSON.parse(data);
            var tokenNew = dataParse.tokenNew;
            var UsernameNguoiSend = dataParse.Username;
         
            function setCookie(NameCookie, value, expiredays) {
                var ExpireDate = new Date;
                ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 60 * 60 * 1000));
                return document.cookie = NameCookie + "= " + escape(document.cookie = value) +
                    (ExpireDate == null ? "" : "; expires =" + ExpireDate.toUTCString());
            } 

            
            setCookie("@token", tokenNew);
            //luu token moi
         
            //khi nhay cao chat thi thu nhat la checktoken de lay username ve
          //  console.log('UsernameNguoiSend REACTJS REACTJS REACJS:::', UsernameNguoiSend);
            that.setState({ UserWeb: UsernameNguoiSend })
            console.log('this.state.UsernameNguoiSend REACTJS REACTJS REACJS:::', this.state.UserWeb ); 
            

        }); */

        /*
console.log(' uuuuuuuuu UsernameNguoiSend REACTJS REACTJS REACJS:::', this.state.UserWeb);

        var x = this.state.UserWeb;
        var socket = io.connect('http://localhost:2800');
        socket.on('connect', function (data) {
            // var Eemit = this; 
            socket.emit('client-send-Username', x); //co ket noi cai la gui luon username
            //  console.log('client-send-Username UsernameNguoiSend CheckUser ', Eemit.state.UserWeb)
        });



        socket.on('server-send-socket.id+Username', ArraySocketUsername => {
            e.setState({ mang: ArraySocketUsername });
            console.log('eeeeeeeee eee server-send-socket.id+Username:::::: cmdddd', this.state.mang)
        });

        socket.on('server-send-messenger', (dataMessenger) => {
            console.log('dataMessenger REACTJS:::', dataMessenger);
            // e.setState({ dataMess: dataMessenger });

            e.setState({ p: (this.state.p + 1) });

            console.log('pppppppppppppppppppppppppppppppppppppppppppppppppp', this.state.p);
            e.setState({
                UserWeb: dataMessenger[0].UsernameNguoiSend, //web sen toi app App la thang duoc kich chuot la Username
                UserApp: dataMessenger[0].UsernameNguoiNhan,
                soPage: 1, //de hien thi la ra tin nhan moc ve 1 tinh tu length max - 1.m = hien thi so phan tu tu lon nhat toi -m phan tu
            });
            //  console.log('this.state.UsernameNguoiNhan !== "":::', this.state.UserApp);
            const { UserApp, Nms, Username, OnManSendMs, UserWeb, SoKey } = this.state; //UserApp = UsernameNguoiSend, 
            OnManSendMs.push(UserWeb);
            console.log('OnManSendMs::lap', OnManSendMs);

            function deduplicate(arr) {
                var isExist = (arr, x) => {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] === x) return true;
                    }
                    return false;
                }
                var ans = [];
                arr.forEach(element => {
                    if (!isExist(ans, element)) ans.push(element);
                });
                return ans;
            }
            var OnManSendMs_r = deduplicate(OnManSendMs);
            var m = OnManSendMs_r.length;
            e.setState({ OnManSendMs: OnManSendMs_r });
            console.log('OnManSendMs::ArrDoneLap', this.state.OnManSendMs.length);

            console.log('Nms:socket.on(server-send-messenger:::::', Nms);
            if (dataMessenger[0] !== null) {
                var ArrdataMessenger = this.state.ArrUserSendKey;
                // console.log('ArrdataMessenger da JSON.parse:!==0:::', ArrdataMessenger);
                var ArrMessSendServer = []; // ArrMessSendServer chi lay 1 phan tu hay vai phan tu tu tin nhan new duoc web gui toi
                console.log('Username:::', Username);
                var { arrThemOnMes } = this.state;
                console.log('arrThemOnMes', arrThemOnMes);
                if (Username == '') { //chua chon ten nguoi chat nguoi nhan tin nhan
                    dataMessenger.map(function (dataEmit, index) {
                        //Nms la so phan tu tinnhan luu o server 
                        arrThemOnMes.unshift(dataEmit);
                    });
                    console.log('arrThemOnMes sau khi unshift splice(m, 1)', arrThemOnMes);
                    //  console.log('arrThemOnMes', arrThemOnMes);
                    if (arrThemOnMes.length >= (m + 1)) {
                        var ptuXoa = 1;///m- this.state.a=1; //m  = this.state.a
                        //  console.log('ptuXoa:::::::::',m);      
                        console.log('ptuXoa:::::::::', ptuXoa);
                        //    console.log('so phantu khong lap :', m);
                        //    console.log('var xoa phan tu thu 2 nao', arrThemOnMes.length + ">=" + (m));
                        // neu m tang len 1 thi phan tu xoa cung tang 1 = m- this.state.a
                        arrThemOnMes.splice(ptuXoa, 1); // XOA 1 PHAN TU O VI TRI THU 2, de lai vi tri thu nhat
                        // co the dung unshift() / shift() — thêm/xóa phần tử từ vị trí đầu mảng
                        //dao gia tri them hien thi
                        e.setState({ arrThemOnMes: arrThemOnMes, });
                        e.setState({ a: arrThemOnMes.length, })
                        console.log('this.state.aaaaaaaaaaaaaaaaaa sau khi splice(m, 1)', this.state.a);
                        console.log('arrThemOnMes sau khi splice(m, 1)', arrThemOnMes);
                        //  e.setState({  arrThemOnMes: arrThemOnMes, });
                        // e.setState({ arrThemOnMes: arrThemOnMes, });
                        var arrThemOnMesKetQua = [];
                        arrThemOnMes.map(function (dataEmit, index) {
                            //Nms la so phan tu tinnhan luu o server 
                            //  var index_goc = Nms + index; //gia tri goc tinh tu cai nhan duoc server gui len
                            var UserSendKey = {
                                // key: JSON.stringify(SoKey + ArrdataMessenger.length + index), //do index gia tri bat dau tu 0, index=0 MIN
                                key: JSON.stringify(index), //do index gia tri bat dau tu 0, index=0 MIN
                                UserSend: dataEmit.UsernameNguoiSend, //thang send cho Userapp, va app dang la thang nhan nhung lai dat o this.state( la UsernameNguoiSend )
                                messenger: dataEmit.messenger,
                                imageBase64: dataEmit.imageBase64,
                                pathIma: dataEmit.pathIma,
                                UserNhan: '', //them vao de hien thi thoi
                                messengerNhan: '',
                            };
                            // console.log('.UserSendKey::::', UserSendKey);
                            arrThemOnMesKetQua.push(UserSendKey);
                            //  ArrMessSendServer.push(UserSendKey);
                            ArrdataMessenger = arrThemOnMesKetQua;
                            //  ArrUserSendKey = arrThemOnMesKetQua;

                        });

                        //   console.log('ArrdataMessenger', ArrdataMessenger);

                        console.log('ArrdataMessenger xoa phan tu thu ' + m + 'con :', ArrdataMessenger);
                    }

                } else if (Username !== '') {
                    if (Username == UserWeb) { //cho cho thang duoc kich chuot hien thi tren flatlist hien tai => Username == Username gui tin nha cho o day la web
                        dataMessenger.map(function (dataEmit, index) {

                            //Nms la so phan tu tinnhan luu o server 
                            //  var index_goc = Nms + index; //gia tri goc tinh tu cai nhan duoc server gui len
                            var UserSendKey = {
                                //key: JSON.stringify(Nms + index), //do index gia tri bat dau tu 0, index=0 MIN
                                key: JSON.stringify(SoKey + ArrdataMessenger.length + index), //do index gia tri bat dau tu 0, index=0 MIN
                                // key: JSON.stringify((Nms -ArrdataMessenger.length) + ArrdataMessenger.length + index_goc)// so lenth max mang tin nhan server - so phan tu truyen len client=sokey //SoKey = Nms - ArrdataMessenger.length // key: JSON.stringify((Nms -ArrdataMessenger.length) + ArrdataMessenger.length + index_goc), //do index gia tri bat dau tu 0, index=0 MIN
                                UserSend: dataEmit.UsernameNguoiSend, //thang send cho Userapp, va app dang la thang nhan nhung lai dat o this.state( la UsernameNguoiSend )
                                messenger: dataEmit.messenger,
                                imageBase64: dataEmit.imageBase64,
                                pathIma: dataEmit.pathIma,
                                UserNhan: '', //them vao de hien thi thoi
                                messengerNhan: '',
                            };
                            // console.log('.UserSendKey::::', UserSendKey);
                            ArrdataMessenger.push(UserSendKey);
                            ArrMessSendServer.push(UserSendKey);
                        });

                    } else if (Username !== UserWeb) {
                        ///truong hop la 1 cai ten nguoi tich khong phai nguoi gui tu web thi khong lam gi ca
                        console.log('nguoi gui tin nhan khong hien thi o day vi chua kich chuot vao nguoi do');
                    }
                }

                // console.log('var ArrdataMessenger =  this.state.SaveDataMessengerApp::::', ArrdataMessenger);
                e.setState({
                    // SaveDataMessengerApp: ArrMessSendServer,
                    ArrUserSendKey: ArrdataMessenger,
                    ArrControlItemMess: ArrdataMessenger,
                });
                console.log('ArrControlItemMess::::', this.state.ArrControlItemMess);
            }
        });
        */

    }
});

ReactDOM.render(
    <div>

        <div>
            <CheckUser></CheckUser>
        </div>

        <div>
            <ListMess></ListMess>
        </div>
        <div>
            {/*  <Note></Note> */}
        </div>
        <div>

        </div>

    </div>
    , document.getElementById("root1"));






