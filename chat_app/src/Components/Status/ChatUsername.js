import React, { Component } from 'react';
import {
    View, Text, FlatList, StyleSheet, Image, TouchableOpacity,
    TextInput, AsyncStorage, ImageBackground,
    Dimensions,
} from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
import ImagePicker from 'react-native-image-picker'; //yarn add react-native-image-picker// react-native link react-native-image-picker
import RNFetchBlob from 'react-native-fetch-blob'; //yarn add react-native-fetch-blob//react-native link
import getToken from '../../../api/getToken';

import Authentication from '../Authentication/Authentication';
import global from '../../../api/global';

import GetTinNhan from '../../../api/getTinNhan';
import SaveTinNhan from '../../../api/saveTinNhan';


const { width, height } = Dimensions.get('window');

var e;
const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',

    },
};

var key = 0;
// var ArrdataMessenger = [];
var ArrarySaveDataMessenger = [];


//lay tu FreeSuper.js goc
export default class ChatUsername extends Component {
    constructor(props) {
        super(props);
        e = this;
        this.state = {
            SaveDataMessengerApp: [], //luu thong tin ap khi nhan vao Username thi se load lai mang nay SaveDataMessengerApp ==  ArrdataMessenger
            UsernameNguoiSend: '', //lay username da luu emit toi server de cong voi socket.id cua server de tao socket+id+username
            // ArraySocketUsername -  ArrayUserSocketId = arrayUsername (loc Useranem trung) == mangU1 chua Usernam duoc tich
            ArraySocketUsername: [],// mang nay khong can setState o app ArraySocketUsername: [], //danh sach socket+id+Username
            ArrayUserSocketId: [], //danh sach socket+id
            arrayUsername: [], //danh sach Useranme co lap 
            mangU: [],  //danh sach username khong lap de chon Username
            Username: '',
            ArraySocketIdThoaMan: [], // mang dach sach socketId thoa man la socketid co trong Username duoc tich touchableopacity; ArraySocketIdThoaMan = socket+id+Useranme - Usernaem (ma TouchableOpacty nhan onPress);
            messenger: '', //messenger tu TextInput map ap se gui di chu khong phai messenger nhan duoc tu server
            // send: false, //bien co tac dung set gia tri neu set send neu send duoc setState({ send: true }) thi se gui send data ngay
            ArrUserSendKey: [], //mang hung su lieu tin nhat tra ve tu server
            UserSendEmit: '',  //User se send emt xuong server  cai nay duoc setState sau cung khi nhat nut emit
            n: 0, //bien tao key cho mnag
            m: 0, //dem so lan emit de xong mang On lang nghe tin ngan cong voi mang emit tin nhan
            imageBase64: '',
            pathIma: '',
            ArrSocketId_UserSend: '', // mang socketId co chua UsernameSend
        }
        global.OnUser = this.globalGetUser.bind(this);

        this.socket = io('http://192.168.216.2:2400', { jsonp: false });

        this.socket.on('server-send-socket.id+Username', async (ArraySocketUsername) => {
            //  console.log('ArraySocketUsername:::', ArraySocketUsername);
            e.setState({ ArraySocketUsername: ArraySocketUsername });
            var ArrayUserSocketId1 = [];
            var arrayUsername1 = [];
            var ArraySocketUsername = this.state.ArraySocketUsername;
            ArraySocketUsername.map(function (value, index) {
                var UserSocketId = value.UserSocketId;
                var Username = value.Username;
                if (Username !== null || Username !== '' || Username !== null || Username !== 'undefined') {
                    ArrayUserSocketId1.push(UserSocketId);
                    arrayUsername1.push(Username);
                }
            });

            await e.setState({
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
            console.log('mangU1111111', mangU1); //mang Username khong co phan tu lap
            var MangUserKey = [];
            var m = mangU1.length;
            for (i = 0; i < m; i++) {
                MangUserKey.push({ key: JSON.stringify(i), Userkey: mangU1[i] });
                // console.log('MangUserKey::::', MangUserKey);
            }
            console.log('MangUserKey::::', MangUserKey);

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
            console.log('mangU2 loai bo username rong::::', mangU2);

            //mang hung du lieu mangU1 ma tao mang moi ArrUserKey co chua key 
            var ArrUserKey = [];
            mangU1.map(function (value, index) { //index thay cho key
                if (value !== null || value !== undefined || value !== []) {
                    var UserKey = { key: JSON.stringify(index), Userkey: value };
                    ArrUserKey.push(UserKey);
                }

            });
            console.log('ArrUserKey1::::', ArrUserKey);

            await e.setState({
                mangU: ArrUserKey
            });

        });

        //lang nghe server send tin nhan
        this.socket.on('server-send-messenger', dataMessenger => {
            console.log('dataMessenger:::', dataMessenger);
            //  var msSend = dataMessenger.UsernameNguoiNhan + ": " + dataMessenger.messenger;
            //  var msNhan = dataMessenger.UsernameNguoiSend + ": " + dataMessenger.messenger;

            var ArrdataMessenger = this.state.SaveDataMessengerApp;
            console.log('var ArrdataMessenger =  this.state.SaveDataMessengerApp::::', ArrdataMessenger);
            var UserSendKey = {
                key: JSON.stringify(ArrdataMessenger.length + 1),
                UserSend: dataMessenger.UsernameNguoiSend,
                messenger: dataMessenger.messenger,
                imageBase64: dataMessenger.imageBase64,
                pathIma: dataMessenger.pathIma,
                UserNhan: '', messengerNhan: '',
            };
            ArrdataMessenger.push(UserSendKey);

            ArrarySaveDataMessenger.push(UserSendKey);
            console.log('ArrarySaveDataMessenger...this socket.on', ArrarySaveDataMessenger);

            var ArrUserSendKey1 = [];
            for (i = 0; i < ArrdataMessenger.length; i++) {
                var UserSend = ArrdataMessenger[i].UserSend;
                var messenger = ArrdataMessenger[i].messenger;                          //tam thoi lay bien UserSendEmit de thai the bien UserNhan nhan duoc tu lnag ngh
                //thay the de khi chia nhan iet ta chua setstate UserSendEmit thi no chua hien len flastlist
                var UserNhan = ArrdataMessenger[i].UserNhan;                  //UserNhan se la ng emit tu ap xuong  ,messengerNhan la ng emit tin nhan xuong ap
                var messengerNhan = ArrdataMessenger[i].messengerNhan;
                var imageBase64 = ArrdataMessenger[i].imageBase64;
                var pathIma = ArrdataMessenger[i].pathIma;
                //  var UserSendKey = { key: i, UserSend: UserSend, messenger: messenger, UserNhan: this.state.UserSendEmit, messengerNhan: this.state.messenger };
                var UserSendKey = {
                    key: JSON.stringify(i), UserSend: UserSend,
                    messenger: messenger,
                    imageBase64: imageBase64,
                    pathIma: pathIma,
                    UserNhan: UserNhan,
                    messengerNhan: messengerNhan
                };
                ArrUserSendKey1.push(UserSendKey);
            }
            //  console.log('ArrUserSendKey1::::', ArrUserSendKey1); //ArrUserSendKey1 maga nay gui len server de luu chu nha
            e.setState({
                ArrUserSendKey: ArrUserSendKey1,
                SaveDataMessengerApp: ArrUserSendKey1
            });
            console.log('this.state.ArrUserSendKey::::', this.state.ArrUserSendKey);
            console.log('this.state.SaveDataMessengerApp::::', this.state.SaveDataMessengerApp);
            var SaveDataMessengerApp1 = JSON.stringify(this.state.SaveDataMessengerApp);
            var Username = this.state.Username;
            console.log('.SaveDataMessengerApp1::::', SaveDataMessengerApp1);
            SaveTinNhan(Username, SaveDataMessengerApp1); //luu tin nha cho ten duoc tich
            GetTinNhan(Username) //khi kich chuot vao Username chon thi getTinNhan mang nay se suoc load ra
                .then(SaveDataMessengerApp => {
                    console.log('SaveDataMessengerApp get tinnhan ::', SaveDataMessengerApp);
                });

            var ArrayMessUsersendUserItem = {
                NameUserSendUserItem: this.state.UsernameNguoiSend + this.state.Username + "ChatUsername.docx",
                SaveDataMessengerApp: SaveDataMessengerApp1
            }
            this.socket.emit('client-send-ArrayMessUsersendUserItem', ArrayMessUsersendUserItem);


        });

    }

    globalGetUser(Useranme1) {
        e.setState({ UsernameNguoiSend: Useranme1 });
        var UsernameNguoiSend = this.state.UsernameNguoiSend;
        console.log('this.state.UsernameNguoiSend globalGetUser::::::', UsernameNguoiSend);
        this.socket = io('http://192.168.216.2:2400', { jsonp: false });
        this.socket.on('connect', (data) => {
            this.socket.emit('client-send-Username', UsernameNguoiSend);
            console.log('App dang-emit UsernameNguoiSend ChatUsrname::::', UsernameNguoiSend);

        });
        this.socket.on('socketId-da-disconnect', socketId => {
            console.log('socketId-da-disconnect: data la', socketId);

            this.socket.emit('client-xoa-Username', socketId + UsernameNguoiSend); //co ket noi cai la gui luon username
            console.log('app dang emit socketIdUsername ma serverda-disconnect: data la', socketId + UsernameNguoiSend);
            this.socket.on('server-capNhat-Danhsach-socketId-new-saukhi-disconnect', ArraySocketUsername => {
                e.setState({ ArraySocketUsername: ArraySocketUsername });
            });
            //  console.log('app ArraySocketUsername new sau khi disconnect: ', this.state.ArraySocketUsername);
        });

        if (this.state.Username !== "") {
            //can tim socketIdUsername co UsernameNguoiSend chua no thi moi emit ve no duoc
            ArrSocketId_UserSend = [];
            //  var UsernameNguoiSend = this.state.UsernameNguoiSend;
            var ArraySocketUsername = this.state.ArraySocketUsername;
            ArraySocketUsername.map(function (value, index) {
                var UserSocketId = value.UserSocketId;
                if (UserSocketId.indexOf(UsernameNguoiSend) > -1) {
                    var ArrSocketId = UserSocketId.replace(UsernameNguoiSend, '');
                    ArrSocketId_UserSend.push(ArrSocketId);
                }
            });
            console.log('ArrSocketId_UserSend:::', ArrSocketId_UserSend);
            e.setState({ ArrSocketId_UserSend: ArrSocketId_UserSend });
            var ArrSocketId_UserSend = this.state.ArrSocketId_UserSend;


            this.socket.emit('client-muon-lay-ArrayMess-User', {
                NameUserSendUserItem: this.state.UsernameNguoiSend + this.state.Username + "ChatUsername.docx",
                ArrSocketId_UserSend: ArrSocketId_UserSend,
            });
            this.socket.on('server-trave-yeucau-ArrayMess-User', SaveDataMessengerApp_r => {
                console.log('server-trave-yeucau-ArrayMess-User::', SaveDataMessengerApp_r);
                var SaveDataMessengerApp = SaveDataMessengerApp_r;
                if (SaveDataMessengerApp[0] !== "") { //neu ArrayMessUsersendUserItem[0]  khac rong thi ta JSON.parser
                    SaveDataMessengerApp = JSON.parse(SaveDataMessengerApp_r);// Neu ArrayMessUsersendUserItem[0] == rong thi ta bo qua cau lenh trong if
                }
                e.setState({
                    ArrUserSendKey: SaveDataMessengerApp,
                    SaveDataMessengerApp: SaveDataMessengerApp
                });

            });
        }


    }



    sendEmit() {

        //cap nhan co ng emit gui messe
        e.setState({
            UserSendEmit: this.state.UsernameNguoiSend,
        });
        console.log('this.state.UserSendEmit', this.state.UserSendEmit);
        //test thu message text send di 
        e.setState({ messenger: 'Instead of playing the guessing game, when you try all the different combinations till you find the one that fits, just use the following modifiers props: left, top, right & bottom.' });
        e.setState({ UserSendEmit: this.state.UsernameNguoiSend });
        console.log('this.state.UsernameNguoiSend', this.state.UserSendEmit)
        console.log('this.state.UsernameNguoiSend', this.state.UsernameNguoiSend)
        var dataEmit = {
            UsernameNguoiNhan: this.state.Username,
            UsernameNguoiSend: this.state.UsernameNguoiSend,
            DSsocketIdNguoiNhan: this.state.ArraySocketIdThoaMan,
            messenger: this.state.messenger,
            imageBase64: this.state.imageBase64,
            pathIma: this.state.pathIma,
        };
        this.socket.emit("client-send-messenger", dataEmit);
        console.log('client-send-messenger dataEmit', dataEmit);

        e.setState({ m: (parseInt(this.state.m) + 1), });//so lan emit 1 lan emit la 1 lan cap nhat mang tin nhan cua app nhe
        console.log('this.state.m::::', this.state.m);


        //hien thi tin nhan len app khi emit thi chi hien thi cho chinh no chu k can emit cho chinh no
        var ArrdataMessenger = this.state.SaveDataMessengerApp;
        var UserSendKey = {  //them 1 obj moi vao flatlist
            key: JSON.stringify(ArrdataMessenger.length + 1),
            UserSend: '', messenger: '',
            UserNhan: this.state.Username,
            messengerNhan: this.state.Username == null ? null : this.state.messenger,
            imageBase64: this.state.Username == null ? null : this.state.imageBase64,
            pathIma: this.state.Username == null ? null : this.state.pathIma,

        };
        ArrdataMessenger.push(UserSendKey);
        ArrarySaveDataMessenger.push(UserSendKey); //ArrarySaveDataMessenger = ArrdataMessenger
        console.log('ArrarySaveDataMessenger...ArrarySaveDataMessenger', ArrarySaveDataMessenger);
        var ArrUserSendKey1 = [];
        for (i = 0; i < ArrdataMessenger.length; i++) {
            var UserSend = ArrdataMessenger[i].UserSend;
            var messenger = ArrdataMessenger[i].messenger;                          //tam thoi lay bien UserSendEmit de thai the bien UserNhan nhan duoc tu lnag ngh
            //thay the de khi chia nhan iet ta chua setstate UserSendEmit thi no chua hien len flastlist
            var UserNhan = ArrdataMessenger[i].UserNhan;                  //UserNhan se la ng emit tu ap xuong  ,messengerNhan la ng emit tin nhan xuong ap
            var messengerNhan = ArrdataMessenger[i].messengerNhan;
            var imageBase64 = ArrdataMessenger[i].imageBase64;
            var pathIma = ArrdataMessenger[i].pathIma;
            //  var UserSendKey = { key: i, UserSend: UserSend, messenger: messenger, UserNhan: this.state.UserSendEmit, messengerNhan: this.state.messenger };
            var UserSendKey = {
                key: JSON.stringify(i),
                UserSend: UserSend, messenger: messenger,
                UserNhan: UserNhan, messengerNhan: messengerNhan,
                imageBase64: imageBase64,
                pathIma: pathIma
            };
            ArrUserSendKey1.push(UserSendKey);
        }
        console.log('ArrUserSendKey1::::', ArrUserSendKey1); //ArrUserSendKey1 maga nay gui len server de luu chu nha
        e.setState({
            ArrUserSendKey: ArrUserSendKey1,
            SaveDataMessengerApp: ArrUserSendKey1,
        });
        console.log('this.state.ArrUserSendKey sendEmit::::', this.state.ArrUserSendKey);
        console.log('this.state.ArrUserSendKey sendEmit::::', this.state.SaveDataMessengerApp);
        var SaveDataMessengerApp1 = JSON.stringify(this.state.SaveDataMessengerApp);

        /*  SaveTinNhan(this.state.Username, SaveDataMessengerApp1); //luu tin nha cho ten duoc tich
          GetTinNhan(this.state.Username) //khi kich chuot vao Username chon thi getTinNhan mang nay se suoc load ra
              .then(SaveDataMessengerApp1 => {
                  console.log('SaveDataMessengerApp get tinnhan sendemit  ::', SaveDataMessengerApp1);
              }); */
        if (this.state.Username !== null) {
            var ArrayMessUsersendUserItem = {
                NameUserSendUserItem: this.state.UsernameNguoiSend + this.state.Username + "ChatUsername.docx",
                SaveDataMessengerApp: SaveDataMessengerApp1
            }
            this.socket.emit('client-send-ArrayMessUsersendUserItem', ArrayMessUsersendUserItem);
        }

    }

    ShowImage_piker() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source_R = { uri: response.uri };
                // You can also display the image using data:
                // response.data la base64
                // const sourceBase64 = response.data;
                const sourceBase64 = { uri: 'data:image/jpeg;base64,' + response.data };// uri de hien thi tran web nhang ta the hien ca o web nen chi chuyen base64
                console.log(sourceBase64);
                this.setState({
                    avatarSourceUpLoadBase64: response.data,
                    //  avatarSource: source,
                    imaPath: source_R,
                    imaBase64: sourceBase64,
                });
            }
        });
    }

    uploadImage() {
        RNFetchBlob.fetch('POST', 'http://192.168.216.2:2400', {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        }, [
                { name: 'avatar', filename: 'avatar.png', data: this.state.data },
                { name: 'info', data: 'khoapham' },
            ])
            .then((resp) => {
                console.log(resp);
            }).catch((err) => {
                console.log(err);
            })
    }

    render() {

        var JSXmesseger = this.state.UserSendEmit + ": " + this.state.messenger;
        const ketQuaJSX = this.state.messenger == null ? null : JSXmesseger;

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'row' }} >
                    <Text style={styles.styleText} >danh sach socket.id+Username</Text>
                    <Text style={styles.UserOnline}>UserOnline: {this.state.Username === null ? null : this.state.Username}</Text>
                    <TouchableOpacity onPress={() => {
                        SaveTinNhan(this.state.Username, '');
                        GetTinNhan(this.state.Username)
                            .then(SaveDataMessengerApp_r => {
                                console.log('da xoa tin nhan cho :' + this.state.Username, SaveDataMessengerApp_r);
                                e.setState({ ArrUserSendKey: SaveDataMessengerApp_r, SaveDataMessengerApp: SaveDataMessengerApp_r });
                                console.log('this.state.ArrUserSendKey get tin nhan khi kich chuot vao Username ta se get tinnhan de lay tin nhan da luu len ::', this.state.SaveDataMessengerApp_r);

                            });
                    }}>
                        <Text style={styles.styleText}>xoa Tin nhan cho Username Hien tren Username Onlike</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 7, backgroundColor: '#fff', flexDirection: 'row' }}>

                    <View style={{ flex: 1, backgroundColor: '#007ACC' }}>

                        <View style={{ flex: 1, backgroundColor: '#007ACC', flexDirection: 'column' }} >
                            <FlatList
                                data={this.state.mangU}
                                renderItem={({ item }) => //item = usernaem vi mangU1 chua username khong trung               // UsernameNguoiSend = usernaem_r lay tu getToken
                                    <TouchableOpacity onPress={() => {
                                        var Username = item.Userkey;
                                        e.setState({ Username: Username }); //de hien thi Username duoc kich chuot


                                        //can tim socketIdUsername co UsernameNguoiSend chua no thi moi emit ve no duoc
                                        ArrSocketId_UserSend = [];
                                        var UsernameNguoiSend = this.state.UsernameNguoiSend;
                                        var ArraySocketUsername = this.state.ArraySocketUsername;
                                        ArraySocketUsername.map(function (value, index) {
                                            var UserSocketId = value.UserSocketId;
                                            if (UserSocketId.indexOf(UsernameNguoiSend) > -1) {
                                                var ArrSocketId = UserSocketId.replace(UsernameNguoiSend, '');
                                                ArrSocketId_UserSend.push(ArrSocketId);
                                            }
                                        });
                                        console.log('ArrSocketId_UserSend:::', ArrSocketId_UserSend);
                                        e.setState({ ArrSocketId_UserSend: ArrSocketId_UserSend });
                                        var ArrSocketId_UserSend = this.state.ArrSocketId_UserSend;

                                        if (this.state.Username !== "") {
                                            this.socket.emit('client-muon-lay-ArrayMess-User', {
                                                NameUserSendUserItem: (this.state.UsernameNguoiSend + this.state.Username + "ChatUsername.docx"),
                                                ArrSocketId_UserSend: ArrSocketId_UserSend,
                                            });
                                            this.socket.on('server-trave-yeucau-ArrayMess-User', SaveDataMessengerApp_r => {
                                                console.log('server-trave-yeucau-ArrayMess-User::', SaveDataMessengerApp_r);
                                                var SaveDataMessengerApp = SaveDataMessengerApp_r;
                                                if (SaveDataMessengerApp[0] !== "") { //neu ArrayMessUsersendUserItem[0]  khac rong thi ta JSON.parser
                                                    SaveDataMessengerApp = JSON.parse(SaveDataMessengerApp_r);// Neu ArrayMessUsersendUserItem[0] == rong thi ta bo qua cau lenh trong if
                                                }
                                                e.setState({
                                                    ArrUserSendKey: SaveDataMessengerApp,
                                                    SaveDataMessengerApp: SaveDataMessengerApp
                                                });

                                            });

                                        }



                                        /*  GetTinNhan(this.state.Username) //khi kich chuot vao Username chon thi getTinNhan mang nay se suoc load ra
                                            .then(SaveDataMessengerApp_r => {
                                                console.log('SaveDataMessengerApp_r khi kich chuot vao Username ta se get tinnhan de lay tin nhan da luu len chua JSON.paser thi no van o dang JSON.string ::', SaveDataMessengerApp_r);
                                                console.log('SaveDataMessengerApp_r[0]::', SaveDataMessengerApp_r[0])
                                                if (SaveDataMessengerApp_r[0] == null || SaveDataMessengerApp_r[0] == '' || SaveDataMessengerApp_r[0] == 'undefined') {
                                                    console.log('SaveDataMessengerApp_r kiem tra xem nhay vao if (SaveDataMessengerApp_r === []) ', SaveDataMessengerApp_r);
                                                    e.setState({ ArrUserSendKey: SaveDataMessengerApp_r, SaveDataMessengerApp: SaveDataMessengerApp_r });
                                                    console.log('this.state.ArrUserSendKey get tin nhan khi kich chuot vao Username ta se get tinnhan de lay tin nhan da luu len ::', this.state.SaveDataMessengerApp_r);
                                                }
                                                else {
                                                    var SaveDataMessengerApp = JSON.parse(SaveDataMessengerApp_r);
                                                    console.log('ArrUserSendKey khi kich chuot vao Username ta se get tinnhan de lay tin nhan da luu len ::', SaveDataMessengerApp);
                                                    e.setState({ ArrUserSendKey: SaveDataMessengerApp, SaveDataMessengerApp: SaveDataMessengerApp });
                                                    console.log('this.state.ArrUserSendKey get tin nhan khi kich chuot vao Username ta se get tinnhan de lay tin nhan da luu len ::', this.state.SaveDataMessengerApp)

                                                }
                                            }); */

                                        var ArraySocketIdThoaMan1 = []; // moi lan nha class = skidUS thi set mang ArraySocketIdThoaMan rong neu khong cac mang truoc se conc cac manh username sau
                                        this.state.ArrayUserSocketId.map(function (value, index) {
                                            // console.log('value:::5555', value);
                                            // console.log('index:::6666', index);
                                            if (value.indexOf(Username) > -1) {
                                                var SocketId = value.replace(Username, '');
                                                ArraySocketIdThoaMan1.push(SocketId);
                                                e.setState({ ArraySocketIdThoaMan: ArraySocketIdThoaMan1 })
                                            }
                                        });
                                        //   console.log('this.state.ArraySocketIdThoaMan1:::', (this.state.ArraySocketIdThoaMan));

                                    }}>
                                        <Text style={styles.styleText} >{item.key + ": "}{item.Userkey}</Text>
                                    </TouchableOpacity>
                                }
                            />
                        </View>

                    </View>

                    <View style={{ flex: 4, backgroundColor: '#FFFFFF' }}>
                        <View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'row' }}>
                            <View style={{ flex: 3, backgroundColor: '#609A22' }}>
                                <FlatList
                                    // data={ArrUserSendKey1}
                                    //data = {ArrarySaveDataMessenger}
                                    data={this.state.ArrUserSendKey}
                                    renderItem={({ item }) =>

                                        <View style={{ flex: 1 }}>
                                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                                {/* <View style={{ flex: 4, flexDirection: 'row' }}> */}
                                                <View style={{ flex: 9 }}>
                                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                                        <Text key={item.key} style={{ flex: 2, color: 'red', fontSize: 10, }}>{item.key} {item.UserSend}</Text>
                                                        <Text key={item.key} style={{ flex: 7, fontSize: 8 }}>{":  " + item.messenger}</Text>
                                                        <Text style={{ flex: 1 }} />
                                                    </View>
                                                    <View>
                                                        <Image source={{ uri: (item.pathIma == null ? null : item.pathIma) }} style={{ height: (item.imaBase64 == null ? 0 : avataHeight), width: (item.imaBase64 == null ? 0 : avataWidth) }} >

                                                        </Image>

                                                    </View>
                                                </View>
                                                <View style={{ flex: 1 }} />
                                                {/* neu la coloum ta them the nay chen giua de tao khoang cach <Text style={{ flex: 1 }} />  */}
                                            </View>

                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 2 }} />
                                                <Text key={item.key} style={styles.styleUserSend_FromApp_Send}>
                                                    {
                                                        // this.state.messenger == null ? null : (item.UserNhan + item.messengerNhan)
                                                        item.key + (item.UserNhan == null ? null : item.UserNhan + ": ") + (item.messengerNhan == null ? null : item.messengerNhan)
                                                        //  item.key + item.UserNhan + item.messengerNhan
                                                    }
                                                </Text>
                                            </View>

                                        </View>
                                    }

                                />

                            </View>


                        </View>
                    </View>

                </View>

                <View style={{ flex: 2, backgroundColor: '#fff', height: 200, }} >

                    <View style={{ flex: 2, backgroundColor: '#fff', height: 80, }}>

                        <TextInput
                            onChangeText={text => this.setState({ messenger: text })}
                            value={this.state.messenger}
                            placeholder={"vui long nhap text"}
                            style={{ height: 80 }}
                        />
                    </View>



                    <View style={{ flex: 1, flexDirection: 'row', height: 100, }}>
                        <TouchableOpacity onPress={() => { this.sendEmit() }}>
                            <Image source={require('../../../api/Images/sendIcon.png')} style={styles.styleIcon} />
                        </TouchableOpacity>

                    </View>

                </View>

            </View>
        );
    }
}

const avataHeight = (height - 20) / 2;
const avataWidth = (avataHeight / (1050)) * 700;
const borderavata = (avataHeight / 2);
const styles = StyleSheet.create({
    styleUserSend_ToAPP_Nhan: {
        fontSize: 8,
        // backgroundColor: '#ffff',

    },
    styleUserSend_FromApp_Send: {
        fontSize: 10,
        // backgroundColor: '#ffff',
        color: 'blue',
        flex: 3,
    },
    UserOnline: {
        backgroundColor: '#DDD6DB',
        color: 'red'
    },
    styleStatus: {
        flex: 1, backgroundColor: '#FF82D3'
    },
    giaodien: {
        borderBottomWidth: 1, flexDirection: 'row'
    },
    trai: {
        flex: 1, backgroundColor: '#6FAC2D', justifyContent: 'center', alignItems: 'center'
    },
    phai: {
        flex: 3, justifyContent: 'center', alignItems: 'center'
    },
    styleText: {
        fontSize: 8,
    },
    styleFlatlist: {
        flex: 1, borderBottomWidth: 1
    },
    styleTextInput: {
        height: 8, width: 50, borderColor: 'gray', borderWidth: 1,
    },
    styleIcon: {
        width: 24,
        height: 24,
    }

})

{
    /**
     *
     * 
     * 
     * 
     * 
     *        
     *  <Textarea ></Textarea>
     *   <FlatList
                    data={this.state.ArraySocketUsername}
                    renderItem={({ item }) =>
                        <view >
                            <text>{item.UserSocketId}</text>
                            <text>{item.Username}</text>
                        </view>
                    }
                />
 
 
               <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Text> Component FreeAll </Text>
 
                $('#listSocket_id_User').html('');
$(ArraySocketUsername).each(function (index, value) {
                    $('#listSocket_id_User').append("<div class='skidUS' >" + value.UserSocketId + "</div>");
                $('#listSocket_id_User').append("<div class='US' >" + value.Username + "</div>");
                $('#listSocket_id_User').css("color", "blue");
                ArrayUserSocketId.push(value.UserSocketId);
                arrayUsername.push(value.Username);
                //console.log('ArrayUserSocketId::', ArrayUserSocketId);
            });
            
                 <View style={styles.styleFlatlist}>
                    <Text style={styles.styleText} >danh sach socket.Username</Text>
                    <FlatList
                        data={this.state.mangU1}
                        renderItem={({ item }) => //item = usernaem vi mangU1 chua username khong trung               // UsernameNguoiSend = usernaem_r lay tu getToken
                            <TouchableOpacity onPress={() => {
                                this.socket.emit("client-send-messenger", { UsernameNguoiNhan: item, UsernameNguoiSend: UsernameNguoiSend, DSsocketIdNguoiNhan: ArraySocketIdThoaMan, messenger: this.state.messenger });
                                // console.log('server dang send socket.usernam va messenger ca nhan', { socketUs: item.UsSoket, msText: this.state.messengerText, dsSoketUsername: this.state.dsSoketUsername, Username: item.Username });
 
 
                                //danh sach socket-id-username thoa nam kich chuot ArraySocketIdThoaMan
                                $('#UserOnline').html(''); //truoc khi vao vong lap xoa ve chong '' danh sach ListUser
                                $('.Username').map(function (index, value) { // <FlatList data={this.state.mangU1}  //touch Flatlist ,mangU1 chon 1 Username nha
                                    $(this).click(() => {
                                        var Username = item;
                                        this.setState({ Username: Username }); //de hien thi Username duoc kich chuot
                                        // $('#UserOnline').append( value );
                                        $('#UserOnline').html('');
                                        $('#UserOnline').append("<div class = 'user' >" + "Userane Online: " + Username + "</div>");
                                        $('#UserOnline').css("color", "#E61A5F");
                                        // alert(Username)
                                        //   console.log('value:::', value);
                                        //   console.log('index:::', index);
                                        var ArraySocketIdThoaMan = []; // moi lan nha class = skidUS thi set mang ArraySocketIdThoaMan rong neu khong cac mang truoc se conc cac manh username sau
                                        this.state.ArrayUserSocketId.map(function (value,index) {
                                            //        console.log('value:::5555', value);
                                            //       console.log('index:::6666', index);
                                            if (value.indexOf(Username) > -1) {
                                                var SocketId = value.replace(Username, '');
                                                ArraySocketIdThoaMan.push(SocketId);
                                                e.setState({ ArraySocketIdThoaMan: ArraySocketIdThoaMan })
                                            }
                                        });
                                        console.log('ArraySocketIdThoaMan:::', ArraySocketIdThoaMan.length + ": +" + Username + ": " + ArraySocketIdThoaMan);
                                        $(document).ready(() => {
                                            //khi nhan send
                                            //ham nhan send tin nhan 
                                        // goi o ham sendEmit
                                            //khi nhan send
                                            //ham nhan send tin nhan 
                                            this.setState({ 
                                                send: true, // khi chua gui bang flase nhe
                                            });
                                            console.log()
                                            this.state.send; 
 
                                            $('#send').click(() => {
                                                $('#ListMesseger').append("<div class='CmsSend'>" + UsernameNguoiSend + ": " + $('#messenger').val() + "</div>" + "<br/>");
                                                $('.CmsSend').css("color", "red");
                                                socket.emit("client-send-messenger", { UsernameNguoiNhan: Username, UsernameNguoiSend: UsernameNguoiSend, DSsocketIdNguoiNhan: ArraySocketIdThoaMan, messenger: $('#messenger').val() });
 
                                            });
                                        })
                                    });
                                });
 
 
                            }}>
                                <Text style={styles.styleText} >{item}</Text>
                            </TouchableOpacity>
                        }
                    />
                </View>
 
                <FlatList
                    data={this.state.ArraySocketUsername}
                    renderItem={({ item }) =>
                        <view >
                            <text>{item.UserSocketId}</text>
                            <text>{item.Username}</text>
                        </view>
                    }
                />
 
                <view>
                    <Text>{this.state.Username}</Text>
                    <TextInput
                        onChangeText={text => this.setState({ messenger: text })}
                        value={this.state.messenger}
                    />
                    <TouchableOpacity onPress={ ()=> {this.SendMesenger()} }>
                        <Text>send</Text>
                    </TouchableOpacity>
                </view>
 
 
            </View>
        );
    }
}
     * 
     * 
     * 
     * 
     * 
     *   //hien thi danh sach socket+id+Username
     socket.on('server-send-socket.id+Username', ArraySocketUsername => {
        console.log('ArraySocketUsername:::', ArraySocketUsername);
        var ArrayUserSocketId = [];
        var arrayUsername = [];
        
        $('#listSocket_id_User').html('');
        $(ArraySocketUsername).each(function (index, value) {
            $('#listSocket_id_User').append("<div class='skidUS' >" + value.UserSocketId + "</div>");
            $('#listSocket_id_User').append("<div class='US' >" + value.Username + "</div>");
            $('#listSocket_id_User').css("color", "blue");
            ArrayUserSocketId.push(value.UserSocketId);
            arrayUsername.push(value.Username);
            //console.log('ArrayUserSocketId::', ArrayUserSocketId);
        });
    
        var ArrayUserSocketId = [];
        var arrayUsername = [];
        ArraySocketUsername.map(function (value, index) {
            e.setState({
                UserSocketId: value.UserSocketId,
                Username: value.Username,
            });
            ArrayUserSocketId.push(value.UserSocketId);
            arrayUsername.push(value.Username);
            console.log('ArrayUserSocketId::', ArrayUserSocketId);
        });
        // Expected output: [1, 5, "a", 3, "f", "3", "b", "e"]
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
        var mangU1 = deduplicate(arrayUsername);
        console.log('mangU1111111', mangU1); //mang Username khong co phan tu lap
        
        
        e.setState({
            mangU1 : mangU1
        });
    
        
    
        $('#ListUser').html(''); //truoc khi vao vong lap xoa ve chong '' danh sach ListUser
        $(mangU1).each(function (index, value) { //hien thi username
            /////////////////////////////////////////////////
            if (value == null || value == 'undefined') {
                $('#ListUser').html('');
            }
            else {
                $('#ListUser').append("<div class='Username' >" + value + "</div>");
                $('#ListUser').css("color", "#E61A5F");
            }
        });
    
        //danh sach socket-id-username thoa nam kich chuot ArraySocketIdThoaMan
        $('#UserOnline').html(''); //truoc khi vao vong lap xoa ve chong '' danh sach ListUser
        $('.Username').map(function (index, value) {
            $(this).click(() => {
                var Username = mangU1[index];
                // $('#UserOnline').append( value );
                $('#UserOnline').html('');
                $('#UserOnline').append("<div class = 'user' >" + "Userane Online: " + Username + "</div>");
                $('#UserOnline').css("color", "#E61A5F");
                // alert(Username)
                //   console.log('value:::', value);
                //   console.log('index:::', index);
                var ArraySocketIdThoaMan = []; // moi lan nha class = skidUS thi set mang ArraySocketIdThoaMan rong neu khong cac mang truoc se conc cac manh username sau
                $(ArrayUserSocketId).each(function (index, value) {
                    //        console.log('value:::5555', value);
                    //       console.log('index:::6666', index);
                    if (value.indexOf(Username) > -1) {
                        var SocketId = value.replace(Username, '');
                        ArraySocketIdThoaMan.push(SocketId);
                    }
                });
                console.log('ArraySocketIdThoaMan:::', ArraySocketIdThoaMan.length + ": +" + Username + ": " + ArraySocketIdThoaMan);
                $(document).ready(() => {
                    //khi nhan send
                    $('#send').click(() => {
                        $('#ListMesseger').append("<div class='CmsSend'>" + UsernameNguoiSend + ": " + $('#messenger').val() + "</div>" + "<br/>");
                        $('.CmsSend').css("color", "red");
                        socket.emit("client-send-messenger", { UsernameNguoiNhan: Username, UsernameNguoiSend: UsernameNguoiSend, DSsocketIdNguoiNhan: ArraySocketIdThoaMan, messenger: $('#messenger').val() });
    
                    });
                })
            });
        });
        // hien thi user da duoc kich chuot va 
        console.log('ArrayUserSocketId::', ArrayUserSocketId);
        $('.skidUS').each(function (index, value) {
            $(this).click(() => {
                var UserSocketId = ArrayUserSocketId[index];
                var Username = arrayUsername[index];
                console.log('Username::::', Username);
                alert(Username);
                //  alert(ArrayDanhSachUser[index]);
                //loc username da duoc kich chuot
                ArraySocketIdThoaMan = []; // moi lan nha class = skidUS thi set mang ArraySocketIdThoaMan rong neu khong cac mang truoc se conc cac manh username sau
                $(ArrayUserSocketId).each(function (index, value) {
                    if (value.indexOf(Username) > -1) {
                        var SocketId = value.replace(Username, '');
                        ArraySocketIdThoaMan.push(SocketId);
                    }
                });
                console.log('ArrayUserThoaMan:::', ArraySocketIdThoaMan);
                //  socket.emit('client-send-danh-sach-socket.id-duoc-kich-chuot',ArraySocketIdThoaMan);
                //document.write(ArraySocketIdThoaMan.join());
            });
        });
    
    
    });
     */
}