import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
import ImagePicker from 'react-native-image-picker'; //yarn add react-native-image-picker// react-native link react-native-image-picker
import RNFetchBlob from 'react-native-fetch-blob'; //yarn add react-native-fetch-blob//react-native link
import getToken from '../../../api/getToken';

var e;
const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',

    },
};

export default class FreeAll extends Component {
    constructor(props) {
        super(props);
        this.socket = io('http://192.168.216.2:2400', { jsonp: false });
        this.socket.on('connect', (data) => {
            //  console.log('data app ket lang nghe connect tu ser nodjs', data);
            getToken('@Username')
                .then(UsernameNguoiSend => {
                    console.log('Username_r.. UsernameNguoiSend tai FressALL::', UsernameNguoiSend);
                    this.socket.emit('client-send-Username', UsernameNguoiSend);
                    console.log('App dang-emit send to getToken -Username -UsernameNguoiSend-ca-nhan trong coment FressALL::::', UsernameNguoiSend);
                });
        });

        this.socket.on('socketId-da-disconnect', socketId => {
            console.log('socketId-da-disconnect: data la', socketId);
            getToken('@Username')
                .then(UsernameNguoiSend => {
                    console.log('Username_r.. UsernameNguoiSend socketId-da-disconnect FressALL::', UsernameNguoiSend);
                    this.socket.emit('client-xoa-Username', socketId + UsernameNguoiSend); //co ket noi cai la gui luon username
                    console.log('app dang emit socketId ma server nodejs -da-disconnect: data la', socketId + UsernameNguoiSend);
                });
        });

        e = this;
        this.state = {
            UsernameNguoiSend: '', //lay username da luu emit toi server de cong voi socket.id cua server de tao socket+id+username

            // ArraySocketUsername -  ArrayUserSocketId = arrayUsername (loc Useranem trung) == mangU1 chua Usernam duoc tich
            ArraySocketUsername: [],// mang nay khong can setState o app ArraySocketUsername: [], //danh sach socket+id+Username
            ArrayUserSocketId: [], //danh sach socket+id
            arrayUsername: [], //danh sach Useranme co lap 
            mangU: [],  //danh sach username khong lap de chon Username
            Username: '',

            ArraySocketIdThoaMan: [], // mang dach sach socketId thoa man la socketid co trong Username duoc tich touchableopacity; ArraySocketIdThoaMan = socket+id+Useranme - Usernaem (ma TouchableOpacty nhan onPress);

            messenger: '', //messenger tu TextInput

            // send: false, //bien co tac dung set gia tri neu set send neu send duoc setState({ send: true }) thi se gui send data ngay
        }







        /*
                this.socket = io('http://192.168.216.2:2400', { jsonp: false });
                this.socket.on('connect', (data) => {
                    console.log('data app ket lang nghe connect tu ser nodjs', data);
                    getToken('@Username')
                        .then(UsernameNguoiSend => {
                            console.log('Username_r.. UsernameNguoiSend tai FressALL::', UsernameNguoiSend);
                            e.setState({ UsernameNguoiSend: UsernameNguoiSend });
                            console.log('Username_r.. UsernameNguoiSend  this.state.UsernameNguoiSend FressALL::', this.state.UsernameNguoiSend);
                         //   this.socket.emit('client-send-Username', UsernameNguoiSend);
                            this.socket.emit('client-send-Username',  this.state.UsernameNguoiSend);
                            console.log('App dang-emit send to getToken -Username -UsernameNguoiSend-ca-nhan trong coment FressALL::::',this.state.UsernameNguoiSend);
                        });
                });
                this.socket.on('socketId-da-disconnect', socketId => {
                    console.log('socketId-da-disconnect: data la', socketId);
                    this.socket.emit('client-xoa-Username', socketId + this.state.UsernameNguoiSend); //co ket noi cai la gui luon username
                    console.log('app dang emit socketId ma server nodejs -da-disconnect: data la', socketId + this.state.UsernameNguoiSend);
                }); 
        */

        getToken('@Username')
            .then(async (Username_r) => {
                await e.setState({ UsernameNguoiSend: Username_r });
            });
        console.log('this.state.UsernameNguoiSend', this.state.UsernameNguoiSend);

        this.socket.on('server-send-socket.id+Username', async (ArraySocketUsername) => {
           // console.log('ArraySocketUsername:::', ArraySocketUsername);
          //  console.log('ArraySocketUsername.length:::', ArraySocketUsername.length);
            var ArrayUserSocketId1 = [];
            var arrayUsername1 = [];
            ArraySocketUsername.map(function (value, index) {
              //  console.log('ArrayUserSocketId index::', index);
                var UserSocketId = value.UserSocketId;
                var Username = value.Username;
               // console.log('UserSocketId value::', UserSocketId);
              //  console.log('Username value::', Username);
                ArrayUserSocketId1.push(UserSocketId);
                arrayUsername1.push(Username);
               // console.log('ArrayUserSocketI1::', ArrayUserSocketId1);
               // console.log('arrayUsername1::', arrayUsername1);

            });
          //  console.log('ArrayUserSocketI1 ngoai map::', ArrayUserSocketId1);
          // console.log('arrayUsername1 ngoai map::', arrayUsername1);
          //  console.log('ArrayUserSocketI1.length ngoai map::', ArrayUserSocketId1.length);
          //  console.log('arrayUsername1.length ngoai map::', arrayUsername1.length);

            await e.setState({
                ArrayUserSocketId: ArrayUserSocketId1,
                arrayUsername: arrayUsername1,
            });
           // console.log('this.state.ArrayUserSocketId:::', this.state.ArrayUserSocketId);
           // console.log('this.state.arrayUsername:::', this.state.arrayUsername);
          //  console.log('this.state.arrayUsername.length.:::', (this.state.arrayUsername).length);
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
            var m =  mangU1.leng;
            for(i=0; i< m; i++){
                MangUserKey.push({"key": i, Userkey: mangU1[i]});
                console.log('MangUserKey::::',MangUserKey);
            }
            console.log('MangUserKey::::',MangUserKey);

            //mang hung du lieu mangU1 ma tao mang moi ArrUserKey co chua key 
            var ArrUserKey =[]; 
            mangU1.map( function(value, index){ //index thay cho key
                var UserKey = { key: index, Userkey: value};
                ArrUserKey.push(UserKey);
            });
            console.log('ArrUserKey1::::',ArrUserKey);

            await e.setState({
                mangU: ArrUserKey
            });

        });

    }

    sendEmit() {
        /*
        this.setState({ //lay gia tri send khi da setState (*****)
            send: true, // khi chua gui bang flase nhe
        }); */
        var dataEmit = { UsernameNguoiNhan: Username, UsernameNguoiSend: UsernameNguoiSend, DSsocketIdNguoiNhan: ArraySocketIdThoaMan, messenger: this.state.messenger };
        this.socket.emit("client-send-messenger", dataEmit);
        console.log('server dang send socket.usernam va messenger ca nhan', { socketUs: item.UsSoket, msText: this.state.messengerText, dsSoketUsername: this.state.dsSoketUsername, Username: item.Username });
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'row' }}>
              
                <View style={{ flex: 1, backgroundColor: '#007ACC'}}>
                    <Text style={styles.styleText} >danh sach socket.id+Username</Text>
                    <FlatList
                        data={this.state.mangU}
                        renderItem={({ item }) => //item = usernaem vi mangU1 chua username khong trung               // UsernameNguoiSend = usernaem_r lay tu getToken
                            <TouchableOpacity onPress={() => {
                                var Username = item.Userkey;
                                e.setState({ Username: Username }); //de hien thi Username duoc kich chuot
                                // alert(Username)
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

              
                <View style={{ flex: 2,  backgroundColor: '#F0F0F0' }}>
                    <Text style={styles.UserOnline}>UserOnline: {this.state.Username}</Text>
                 
                    <TextInput
                            onChangeText={text => this.setState({ messenger: text })}
                            value={this.state.messenger}
                            placeholder={"vui long nhap text"}
                    />
                   
                    <TouchableOpacity onPress={() => { this.sendEmit() }}>
                        <Text>send</Text>
                    </TouchableOpacity>
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    UserOnline: {
        backgroundColor: 'red'
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