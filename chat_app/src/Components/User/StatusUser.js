import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ImageBackground, TouchableOpacity, TextInput, AsyncStorage, Dimensions } from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
import ImagePicker from 'react-native-image-picker'; //yarn add react-native-image-picker// react-native link react-native-image-picker
import RNFetchBlob from 'react-native-fetch-blob'; //yarn add react-native-fetch-blob//react-native link
import getToken from '../../../api/getToken';

import global from '../../../api/global';

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',

    },
};
const SaveTinNhan = async (Username, ArrayMesse) => {
    try {


        await AsyncStorage.setItem(Username, ArrayMesse)
        return 'SAVE MESSENGER CHO' + Username + 'THANH_CONG';

    } catch (e) {
        return e;
    }
}

const GetTinNhan = async (Username) => {
    try {
        var value = await AsyncStorage.getItem(Username);
        if (value !== null) {
            return value;
        }
        return [];

    } catch (e) {
        return console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbb', e);;

    }
}

var e;

const { width, height } = Dimensions.get('window');

export default class User extends Component {
    constructor(props) {
        super(props);


        e = this;
        this.state = {

            dataUser: [
                { key: JSON.stringify(0), avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                { key: "1", StatusMe: 'statusImage1', imaBase64: require('../../../api/ImageAvata/3.jpg') },
                { key: "2", StatusMe: 'statusImage2', imaBase64: require('../../../api/ImageAvata/4.jpg') },
                { key: "3", StatusMe: 'statusImage3', imaBase64: require('../../../api/ImageAvata/5.jpg') },


            ],
            User: '',
            refresh: false,

            textStatus: '', //text Trang thai,
            imaBase64: '', //image kieu base64,
            n: 0, //dem so lan lang nghe server-share-status-public-congKhai de tao 1 mang nhan statusPublic
            //  SaveArrStatusPublic: [], //de hung du lieu moi vao 
            SaveArrStatusPublic: [
                { key: JSON.stringify(0), avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
            ],
            ArrayAvatarAnhBia: [
                { key: JSON.stringify(0), avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') }
            ],
            // ArrayStatusPublic: [],
            imaPath: '', //duong dan anh,

            ArrayStatus: [],
            ArrayStatusItem: [
                { key: JSON.stringify(0), avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') }
            ],

            soPage: 1,
            Nms: '',

            UserClick: '', //username  gui di server de tu UserClick nay ta se readFile tu server he hien thi  len



        };
        global.OnUser = this.getUser.bind(this);


        getToken('@Username')
            .then(user => {
                console.log('user000000000000000000', user);
                e.setState({ User: user });
                var dataYeuCau = {
                    UserYeuStatus: this.state.User,
                    soPage: this.state.soPage,
                    UserClick: this.state.UserClick
                }
                console.log('dataYeuCau::::', dataYeuCau);
                this.socket.emit('client-yeucau-status-User', dataYeuCau);
                console.log('dataYeuCau::::', dataYeuCau);

            });




        this.socket = io.connect('http://192.168.216.2:2800', { jsonp: false });

        this.socket.on('connect', () => {
            console.log('this.state.User o User.js', this.state.User);
            this.socket.emit('client-send-Username', this.state.User);
            console.log(' serser app dang emit this.state.User o User.js', this.state.User);
        });
        this.socket.on('disconnect', (socketId) => {
            console.log('socketId-da-disconnect: data la', socketId);
            this.socket.emit('client-xoa-Username', socketId + this.state.User); //co ket noi cai la gui luon username
            console.log('tu User.js app dang emit socketId ma server nodejs -da-disconnect: data la', this.state.User);
        });


        this.socket.on('server-trave-status-public-congKhai', dataStatusPubic => {
            console.log('dataStatusPubic::::', dataStatusPubic);
            var ArrayStatus_r = dataStatusPubic.Sms;
            var Nms = dataStatusPubic.Nms;
            console.log('SaveArrStatusPublic_R:::::', ArrayStatus_r);
            console.log('SaveArrStatusPublic_R[0]:::::', ArrayStatus_r[0]);
            if (ArrayStatus_r[0] == null || ArrayStatus_r[0] == 'undefined' || ArrayStatus_r == '') {
                var c = (this.state.ArrayAvatarAnhBia).concat([]);
                e.setState({
                    ArrayStatus: [],
                    ArrayStatusItem: c,
                });
                console.log('this.state.ArrayStatusItem cmd get STATUS ::', this.state.ArrayStatusItem);

            } else {
                console.log(' Status cho :' + this.state.User, ArrayStatus_r);
                var ArrayStatus_r = JSON.parse(ArrayStatus_r);
                var c = (this.state.ArrayAvatarAnhBia).concat(ArrayStatus_r);
                e.setState({
                    ArrayStatus: ArrayStatus_r,
                    ArrayStatusItem: c,
                    Nms: Nms - ArrayStatus_r.length,
                });
                console.log('this.state.ArrayStatusItem cmd get STATUS ::', this.state.ArrayStatusItem);

            }

        })


        this.socket.on('server-share-status-public-congKhai', DataStatusPublic => {
            console.log('DataStatusPublic:::', DataStatusPublic);
            e.setState({ n: (parseInt(this.state.Nms) + 1) });


            //can the hien status theo thoi gian hien taji vua dang roi moi toi qua khu nen ta can dao lai gia tri key trong status
            //them 1 bien mang  moi de luu chu no
            var status = { User: DataStatusPublic.User, StatusMe: DataStatusPublic.StatusMe, imaBase64: DataStatusPublic.imaBase64, imaPath: DataStatusPublic.imaPath };
            var ArrayStatus = this.state.ArrayStatus;
            ArrayStatus.unshift(status);
            // console.log(' ArrayStatus.unshift::::', ArrayStatus);
            var ArrayStatusThem = this.state.ArrayStatusItem;

            //  var p = this.state.Nms - ArrayStatusThem.length;


            var User = DataStatusPublic.User;
            var StatusMe = DataStatusPublic.StatusMe;
            var imaBase64 = DataStatusPublic.imaBase64;
            var imaPath = DataStatusPublic.imaPath;
            var statePublic = {
                key: JSON.stringify(this.state.Nms + ArrayStatusThem.length),
                User: User == null ? null : User,
                StatusMe: StatusMe = null ? null : StatusMe,
                imaBase64: imaBase64 == null ? null : imaBase64,
                imaPath: imaPath == null ? null : imaPath
            };
            ArrayStatusThem.push(statePublic);
            //   console.log('ArrayStatusThem::::', ArrayStatusThem);

            // var c = (this.state.ArrayAvatarAnhBia).concat(ArrayStatusThem);
            var c = (ArrayStatusThem)

            e.setState({
                ArrayStatus: ArrayStatus,
                ArrayStatusItem: c,
            });
            console.log(',this.state.ArrayStatus::::', this.state.ArrayStatus);
            console.log(',this.state.ArrayStatusItem::::', this.state.ArrayStatusItem);
            //chuyen mnag ve dang JSON.stringify moi luu duoc 
            var ArrayStatus = JSON.stringify(this.state.ArrayStatus);
            // var User = this.state.Username;

            /*
            SaveTinNhan(this.state.User + "StatusPublic", ArrayStatus); //luu tin nha cho ten duoc tich
            GetTinNhan(this.state.User + "StatusPublic") //khi kich chuot vao User chon thi getTinNhan mang nay se suoc load ra
                .then(ArrayStatus => {
                    //  console.log('SaveDataMessengerApp get tinnhan sendemit  ::', SaveArrStatusPublic);
                });
            */

        })



        /*
        this.socket.on('server-share-status-public-congKhai', DataStatusPublic => {
            //  console.log('DataStatusPublic:::', DataStatusPublic);
            e.setState({ n: (parseInt(this.state.n) + 1) });

            //key se duoc tang len oi khi thay 1 lang nhe moi server-share-status-public-congKhai
            // JSON.tringigy de dua key ve string k phai munber de no ho tro doc key o flatlist

            
           // var TheSaveArrStatusPublic = this.state.SaveArrStatusPublic;
         //   var p = ((this.state.n) + 1);
          //  console.log('p::::::', p);
         //   var m = (TheSaveArrStatusPublic.length + 1);
         //   console.log('m:::::::', m);
        //    var statusPublic = { key: JSON.stringify(m), User: DataStatusPublic.User, StatusMe: DataStatusPublic.StatusMe, imaBase64: DataStatusPublic.imaBase64, imaPath: DataStatusPublic.imaPath };
         //   console.log('statusPublic:::::::', statusPublic);
         //   TheSaveArrStatusPublic.push(statusPublic);
        //    console.log('TheSaveArrStatusPublic::', TheSaveArrStatusPublic);
        //    // mang SaveArrStatusPublic se duoc set la e gia tri moi duoc push them doi tung statusPublic
        //    e.setState({ SaveArrStatusPublic: TheSaveArrStatusPublic });
        //    console.log('this.state.SaveArrStatusPublic on server-share-status-public-congKhai::::', this.state.SaveArrStatusPublic);
        //    //chuyen mnag ve dang JSON.stringify moi luu duoc 
        //    var SaveArrStatusPublic = JSON.stringify(this.state.SaveArrStatusPublic);
        //    // var User = this.state.Username;
        //    SaveTinNhan(this.state.User + "StatusPublic", SaveArrStatusPublic); //luu tin nha cho ten duoc tich
       //     GetTinNhan(this.state.User + "StatusPublic") //khi kich chuot vao User chon thi getTinNhan mang nay se suoc load ra
       //         .then(SaveArrStatusPublic => {
       //             //  console.log('SaveDataMessengerApp get tinnhan sendemit  ::', SaveArrStatusPublic);
        //        }); 


            //can the hien status theo thoi gian hien taji vua dang roi moi toi qua khu nen ta can dao lai gia tri key trong status
            //them 1 bien mang  moi de luu chu no
            var status = { User: DataStatusPublic.User, StatusMe: DataStatusPublic.StatusMe, imaBase64: DataStatusPublic.imaBase64, imaPath: DataStatusPublic.imaPath };
            var ArrayStatus = this.state.ArrayStatus;
            ArrayStatus.unshift(status);
            // console.log(' ArrayStatus.unshift::::', ArrayStatus);
            var ArrayStatusThem = [];
            for (i = 0; i < ArrayStatus.length; i = i + 1) {
                var User = ArrayStatus[i].User;
                var StatusMe = ArrayStatus[i].StatusMe;
                var imaBase64 = ArrayStatus[i].imaBase64;
                var imaPath = ArrayStatus[i].imaPath;
                var statePublic = { key: JSON.stringify(i + 1), User: User == null ? null : User, StatusMe: StatusMe = null ? null : StatusMe, imaBase64: imaBase64 == null ? null : imaBase64, imaPath: imaPath == null ? null : imaPath };
                ArrayStatusThem.push(statePublic);
            }
            //   console.log('ArrayStatusThem::::', ArrayStatusThem);
            var c = (this.state.ArrayAvatarAnhBia).concat(ArrayStatusThem);
            //   console.log('CCC::::', c);
            e.setState({
                ArrayStatus: ArrayStatus,
                ArrayStatusItem: c,
            });
            console.log(',this.state.ArrayStatus::::', this.state.ArrayStatus);
            console.log(',this.state.ArrayStatusItem::::', this.state.ArrayStatusItem);
            //chuyen mnag ve dang JSON.stringify moi luu duoc 
            var ArrayStatus = JSON.stringify(this.state.ArrayStatus);
            // var User = this.state.Username;
            SaveTinNhan(this.state.User + "StatusPublic", ArrayStatus); //luu tin nha cho ten duoc tich
            GetTinNhan(this.state.User + "StatusPublic") //khi kich chuot vao User chon thi getTinNhan mang nay se suoc load ra
                .then(ArrayStatus => {
                    //  console.log('SaveDataMessengerApp get tinnhan sendemit  ::', SaveArrStatusPublic);
                });

        })
        */

    }


    getUser(User1) { //User1 la Username tu trang chu bang  global  truyen qua cho User.js
        e.setState({ User: User1 });
        console.log('User1 la Username tu trang chu bang  global  truyen qua cho User.js', this.state.User);
    }

    componentDidMount() {

        /* GetTinNhan(this.state.User + "StatusPublic")
             .then(SaveArrStatusPublic_R => {
                 console.log('SaveArrStatusPublic_R[0]:::::', SaveArrStatusPublic_R[0]);
                 if (SaveArrStatusPublic_R[0] == null || SaveArrStatusPublic_R == 'undefined' || SaveArrStatusPublic_R == '') {
                     e.setState({ SaveArrStatusPublic: [] });
                 } else {
                     console.log('da xoa tin nhan cho :' + this.state.User, SaveArrStatusPublic_R);
                     var SaveArrStatusPublic_R1 = JSON.parse(SaveArrStatusPublic_R);
                     e.setState({ SaveArrStatusPublic: SaveArrStatusPublic_R1 });
                     console.log('this.state.SaveArrStatusPublic get tin nhan khi kich chuot vao Username ta se get ::', this.state.SaveArrStatusPublic);
 
                 }
 
             }); */

        /*

       GetTinNhan(this.state.User + "StatusPublic")
           .then(ArrayStatus_r => {
               console.log('SaveArrStatusPublic_R:::::', ArrayStatus_r);
               console.log('SaveArrStatusPublic_R[0]:::::', ArrayStatus_r[0]);
               if (ArrayStatus_r[0] == null || ArrayStatus_r[0] == 'undefined' || ArrayStatus_r == '') {
                   var c = (this.state.ArrayAvatarAnhBia).concat([]);
                   e.setState({
                       ArrayStatus: [],
                       ArrayStatusItem: c,
                   });
                   console.log('this.state.ArrayStatusItem cmd get STATUS ::', this.state.ArrayStatusItem);

               } else {
                   console.log(' Status cho :' + this.state.User, ArrayStatus_r);
                   var ArrayStatus_r = JSON.parse(ArrayStatus_r);
                   var c = (this.state.ArrayAvatarAnhBia).concat(ArrayStatus_r);
                   e.setState({
                       ArrayStatus: ArrayStatus_r,
                       ArrayStatusItem: c,
                   });
                   console.log('this.state.ArrayStatusItem cmd get STATUS ::', this.state.ArrayStatusItem);

               }

           });
       */


    }

    changedAvata() {

    }

    editAnhBia() {
        e.setState({ avata: '' })
    }

    Share() {
        //test textStatus
        e.setState({ textStatus: this.state.textStatus + 'Tính năng dịch trang web trên Chrome có thể là một tính năng vô cùng tiện lợi đối với nhiều người dùng nhưng do được kích hoạt tự động nên khiến nhiều người dùng cảm thấy khó chịu, do đó việc tắt tính năng dịch trang web trê' })
        this.socket.emit('client-share-status-public-congKhai', { User: this.state.User, StatusMe: this.state.textStatus, imaBase64: this.state.imaBase64, imaPath: this.state.imaPath });
    }

    Delete() {
        /* 
       alert(0);
       var ArrayAvatarAnhBia = [
           { key: JSON.stringify(0), avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') }
       ];
       var ArrayAvatarAnhBiaString = JSON.stringify(ArrayAvatarAnhBia);
       SaveTinNhan(this.state.User + "StatusPublic", ArrayAvatarAnhBiaString); //luu tin nha cho ten duoc tich
     
        GetTinNhan(this.state.User + "StatusPublic") //khi kich chuot vao User chon thi getTinNhan mang nay se suoc load ra
             .then(SaveArrStatusPublic_R => {
                 if (SaveArrStatusPublic_R[0] == null || SaveArrStatusPublic_R == 'undefined' || SaveArrStatusPublic_R == '') {
                     e.setState({ SaveArrStatusPublic: [] });
                 } else {
                     console.log('da xoa tin nhan cho :' + this.state.User, SaveArrStatusPublic_R);
                     var SaveArrStatusPublic_R1 = JSON.parse(SaveArrStatusPublic_R);
                     e.setState({ SaveArrStatusPublic: SaveArrStatusPublic_R1 });
                     console.log('SaveArrStatusPublic DELETE  ::', this.state.SaveArrStatusPublic);
                 }
             }); */

        SaveTinNhan(this.state.User + "StatusPublic", ''); //luu tin nha cho ten duoc tich

        GetTinNhan(this.state.User + "StatusPublic") //khi kich chuot vao User chon thi getTinNhan mang nay se suoc load ra
            .then(ArrayStatus_r => {
                console.log('SaveArrStatusPublic_R:::::', ArrayStatus_r);
                console.log('SaveArrStatusPublic_R[0]:::::', ArrayStatus_r[0]);
                if (ArrayStatus_r[0] == null || ArrayStatus_r[0] == 'undefined' || ArrayStatus_r[0] == '') {
                    var c = (this.state.ArrayAvatarAnhBia).concat([]);
                    e.setState({
                        ArrayStatus: [],
                        ArrayStatusItem: c,
                    });
                    console.log('ArrayStatusItem DELETE  ::', this.state.ArrayStatusItem);
                } else {
                    console.log('da xoa STATUS cho :' + this.state.User, ArrayStatus_r);
                    var ArrayStatus_r = JSON.parse(ArrayStatus_r);
                    var c = (this.state.ArrayAvatarAnhBia).concat(ArrayStatus_r);
                    e.setState({
                        ArrayStatus: [],
                        ArrayStatusItem: c,
                    });
                    console.log('ArrayStatusItem DELETE  ::', this.state.ArrayStatusItem);
                }
            });

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

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#ffff' }} >
                <Text>Component User</Text>
                <TouchableOpacity onPress={() => { this.Delete() }}>
                    <Text>XOA Status</Text>
                </TouchableOpacity>
                <FlatList
                    //load tin nhan  cu ve
                    refreshing={this.state.refresh} //hien thi xoay xoay // neu = flase hien xoa khi dung day
                    onRefresh={() => { // khi keo tren dung day thi se nhay vao ham onRefresh su ly load them du lieu
                        e.setState({ refresh: true }); // truosc khi thu hien lay du lieu mang ve

                        /*
                        e.setState({
                            dataUser: [
                                { key: JSON.stringify(0), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                { key: "1", StatusMe: 'toi khong bao gio dong long dau hinh nhu no binh tinh lai roi' },
                                { key: "2", StatusMe: 'toi khong bao gio dong long dau' },
                                { key: "3", StatusMe: 'toi khong bao gio dong long dau' }, { key: "4", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                { key: "5", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                            ],
                            refresh: false,
                        });
                        */
                        e.setState({
                           soPage: (parseInt(this.state.soPage) + 1),
                         //  n: (parseInt(this.state.n) + 1),
                            
                        });
                        var dataYeuCau = {
                            UserYeuStatus: this.state.User,
                            soPage: this.state.soPage
                        }
                        console.log('dataYeuCau::::', dataYeuCau);
                        this.socket.emit('client-yeucau-status-public-congkhai', dataYeuCau);
                        console.log('dataYeuCau::::', dataYeuCau);

                        e.setState({
                            refresh: false,
                        })

                    }}

                    //load them tin nhan moi ve
                    onEndReachedThreshold={0.5} //so khong la gi keo xuong day ma qua day 0.1 thi se nhay vao onEndReched
                    onEndReached={() => {
                        // e.setState({ refresh: true }); // truosc khi thu hien lay du lieu mang ve

                        /*  e.setState({
                               dataUser: [
                                 //  { key: JSON.stringify(0), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                 //  { key: "1", StatusMe: 'toi khong bao gio dong long dau hinh nhu no binh tinh lai roi' },
                                 //  { key: "2", StatusMe: 'toi khong bao gio dong long dau' },
                                //   { key: "3", StatusMe: 'toi khong bao gio dong long dau' }, { key: "4", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                  // { key: "5", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                  // { key: JSON.stringify(6), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                   { key: "7", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                   { key: "8", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                               ],
                               refresh: false,
                           }); */

                           e.setState({
                            soPage: (parseInt(this.state.soPage) - 1),
                          //  n: (parseInt(this.state.n) + 1),
                             
                         });
                         var dataYeuCau = {
                             UserYeuStatus: this.state.User,
                             soPage: this.state.soPage
                         }
                         console.log('dataYeuCau::::', dataYeuCau);
                         this.socket.emit('client-yeucau-status-public-congkhai', dataYeuCau);
                         console.log('dataYeuCau::::', dataYeuCau);
 
                         e.setState({
                             refresh: false,
                         })

                    }}


                    //data={this.state.SaveArrStatusPublic}
                    data={this.state.ArrayStatusItem}

                    renderItem={({ item }) =>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>




                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ height: item.avata == null ? null : avataHeight }}>

                                    <View style={{ height: (item.anhbia == null ? 0 : avataHeight), marginBottom: (item.anhbia == null ? 0 : 30), flexDirection: 'row', }}>
                                        <TouchableOpacity onPress={() => { alert(1) }}>
                                            <ImageBackground source={item.anhbia} style={{ height: (item.anhbia == null ? 0 : avataHeight), width: (item.anhbia == null ? 0 : width) }}>
                                                <View style={{ flexDirection: 'row', backgroundColor: '', height: (item.anhbia == null ? 0 : avataHeight) }} >
                                                    <View style={{ flex: 1, backgroundColor: '', height: (item.avata == null ? 0 : avataWidth) }} >

                                                        <View style={{ height: (item.avata == null ? 0 : (avataWidth / 2)) }} ></View>

                                                        <View style={{ backgroundColor: '', borderRadius: (item.avata == null ? 0 : (avataWidth / 2)) }}  >
                                                            <TouchableOpacity onPress={() => { alert(2) }}>
                                                                <Image source={item.avata} style={{ height: (item.avata == null ? 0 : avataWidth), width: (item.avata == null ? 0 : avataWidth), borderRadius: (item.avata == null ? 0 : (avataWidth / 2)) }}  ></Image>

                                                                <Text style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 40 }} >{item.avata == null ? null : 'changAvata'}</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, }} />
                                                    <View style={{ flex: 1, }}>
                                                        <View style={{ flex: 5 }} />
                                                        <TouchableOpacity style={{ flex: 1 }}
                                                            onPress={() => { this.editAnhBia() }}>
                                                            <Text>{item.anhbia == null ? null : 'edit'}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View >



                                    <View style={{ height: (item.avata) == null ? 0 : 40, marginLeft: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }} >
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100, marginLeft: (item.avata) == null ? 0 : 20 }} onPress={() => { this.addFriend() }} >
                                            <Text >{item.avata == null ? null : 'Add Friend'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100 }} onPress={() => { this.Meesenger() }} >
                                            <Text >{item.avata == null ? null : 'Meesenger'} </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100 }} onPress={() => { this.more() }} >
                                            <Text >{item.avata == null ? null : 'more'} </Text>
                                        </TouchableOpacity>
                                    </View>


                                </View>

                                <View style={{ height: (item.avata) == null ? 0 : 50, marginTop: (item.avata == null ? 0 : 70), marginBottom: (item.avata == null ? 0 : 90), justifyContent: 'center', alignItems: 'center' }} >
                                    <TextInput
                                        onChangeText={text => this.setState({ textStatus: text })}
                                        value={this.state.textStatus}
                                        placeholder={item.avata == null ? null : "what us your mind ?"}
                                    />
                                    <View style={{ marginTop: (item.avata == null ? 0 : 10), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.about() }} >
                                            <Text >{item.avata == null ? null : 'Status'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.ShowImage_piker() }} >
                                            <Text >{item.avata == null ? null : 'Photo'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.Friend() }} >
                                            <Text >{item.avata == null ? null : 'Friends'}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.Share() }} >
                                            <Text >{item.avata == null ? null : 'Share'}</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                                <View style={{ marginTop: (item.StatusMe == null ? 0 : 10), marginBottom: (item.StatusMe == null ? 0 : 5), height: (item.imaBase64 == null ? 0 : avataHeight), justifyContent: 'center', alignItems: 'center' }}>
                                    <View key={item.key}
                                        style={{
                                            marginTop: (item.StatusMe == null ? 0 : 10),
                                            marginBottom: (item.StatusMe == null ? 0 : 5),
                                            height: (item.imaBase64 == null ? 0 : avataHeight),
                                            justifyContent: 'center', alignItems: 'center'
                                        }}
                                    >
                                        <TouchableOpacity onPress={()=> {
                                            e.setState({ UserClick: item.User });
                                        }}>
                                            <Text>{item.User == null ? null : item.User + ": "}</Text>
                                        </TouchableOpacity>
                                      
                                        <Text>{item.key == null ? null : item.key}</Text>
                                        <Text
                                            key={item.key}
                                            style={{
                                                marginTop: (item.StatusMe == null ? 0 : 10),
                                                marginBottom: (item.StatusMe == null ? 0 : 5),
                                                height: (item.imaBase64 == null ? 0 : avataHeight),
                                                justifyContent: 'center', alignItems: 'center'
                                            }} >{item.StatusMe == null ? null : item.StatusMe}</Text>
                                        <ImageBackground source={item.imaBase64 == null ? null : item.imaBase64} style={{ height: (item.imaBase64 == null ? 0 : avataHeight), width: (item.imaBase64 == null ? 0 : avataWidth), justifyContent: 'center', alignItems: 'center' }}>

                                        </ImageBackground>
                                    </View>

                                </View>
                            </View>

                            <View style={{ height: 500, flex: 1 }}>
                                {
                                    this.state.ArrayStatusItem.map(function (value, index) {

                                        <Text>{value.StatusMe}</Text>
                                    })
                                }
                            </View>

                        </View>



                    }
                />

            </View>
        );
    }
}

const avataHeight = (height - 20) / 2;
const avataWidth = (avataHeight / (1050)) * 700;
const borderavata = (avataHeight / 2);
const styles = StyleSheet.create({
    AnhBiaStyle: {
        flex: 1, flexDirection: 'row', width: avataWidth, height: avataHeight, justifyContent: 'center', alignItems: 'center'
    },
    avtaStyle: {
        flex: 1, width: (avataHeight / 2), height: (avataHeight / 2), borderRadius: (avataHeight / 4)
    },
    styleText: {
        fontSize: 8,
    },
})



{/* 

 <View style={{ flex: 1, backgroundColor: '#ffff' }} >
                <Text>Component User</Text>
                <FlatList
                    //load tin nhan  cu ve
                    refreshing={this.state.refresh} //hien thi xoay xoay // neu = flase hien xoa khi dung day
                    onRefresh={() => { // khi keo tren dung day thi se nhay vao ham onRefresh su ly load them du lieu
                        e.setState({ refresh: true }); // truosc khi thu hien lay du lieu mang ve
                        e.setState({
                            dataUser: [
                                { key: JSON.stringify(0), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                { key: "1", StatusMe: 'toi khong bao gio dong long dau hinh nhu no binh tinh lai roi' },
                                { key: "2", StatusMe: 'toi khong bao gio dong long dau' },
                                { key: "3", StatusMe: 'toi khong bao gio dong long dau' }, { key: "4", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                { key: "5", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                            ],
                            refresh: false,
                        });
                    }}

                    //load them tin nhan moi ve
                    onEndReachedThreshold={0.5} //so khong la gi keo xuong day ma qua day 0.1 thi se nhay vao onEndReched
                    onEndReached={() => {
                        // e.setState({ refresh: true }); // truosc khi thu hien lay du lieu mang ve
                          e.setState({
                               dataUser: [
                                 //  { key: JSON.stringify(0), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                 //  { key: "1", StatusMe: 'toi khong bao gio dong long dau hinh nhu no binh tinh lai roi' },
                                 //  { key: "2", StatusMe: 'toi khong bao gio dong long dau' },
                                //   { key: "3", StatusMe: 'toi khong bao gio dong long dau' }, { key: "4", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                  // { key: "5", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                  // { key: JSON.stringify(6), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                   { key: "7", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                   { key: "8", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                               ],
                               refresh: false,
                           }); 
                        }}


                        data={this.state.dataUser}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ height: item.avata == null ? null : avataHeight }}>
    
                                        <View style={{ height: (item.anhbia == null ? 0 : avataHeight), marginBottom: (item.anhbia == null ? 0 : 30), flexDirection: 'row', }}>
                                            <TouchableOpacity onPress={() => { alert(1) }}>
                                                <ImageBackground source={item.anhbia} style={{ height: (item.anhbia == null ? 0 : avataHeight), width: (item.anhbia == null ? 0 : width) }}>
                                                    <View style={{ flexDirection: 'row', backgroundColor: '', height: (item.anhbia == null ? 0 : avataHeight) }} >
                                                        <View style={{ flex: 1, backgroundColor: '', height: (item.avata == null ? 0 : avataWidth) }} >
    
                                                            <View style={{ height: (item.avata == null ? 0 : (avataWidth / 2)) }} ></View>
    
                                                            <View style={{ backgroundColor: '', borderRadius: (item.avata == null ? 0 : (avataWidth / 2)) }}  >
                                                                <TouchableOpacity onPress={() => { alert(2) }}>
                                                                    <Image source={item.avata} style={{ height: (item.avata == null ? 0 : avataWidth), width: (item.avata == null ? 0 : avataWidth), borderRadius: (item.avata == null ? 0 : (avataWidth / 2)) }}  ></Image>
    
                                                                    <Text style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 40 }} >{item.avata == null ? null : 'changAvata'}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        <View style={{ flex: 1, }} />
    
                                                    </View>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        </View >
    
                                        <View style={{ height: (item.avata) == null ? 0 : 40, marginLeft: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }} >
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100, marginLeft: (item.avata) == null ? 0 : 20 }} onPress={() => { this.addFriend() }} >
                                                <Text >{item.avata == null ? null : 'Add Friend'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100 }} onPress={() => { this.Meesenger() }} >
                                                <Text >{item.avata == null ? null : 'Meesenger'} </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100 }} onPress={() => { this.more() }} >
                                                <Text >{item.avata == null ? null : 'more'} </Text>
                                            </TouchableOpacity>
                                        </View>
    
    
                                    </View>
    
                                    <View style={{ height: (item.avata) == null ? 0 : 50, marginTop: (item.avata == null ? 0 : 70), marginBottom: (item.avata == null ? 0 : 10), justifyContent: 'center', alignItems: 'center' }} >
                                        <TextInput
                                            onChangeText={text => this.setState({ textStatus: text })}
                                            value={this.state.textStatus}
                                            placeholder={item.avata == null ? null : "what us your mind ?"}
                                        />
                                        <View style={{ marginTop: (item.avata == null ? 0 : 10), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.about() }} >
                                                <Text >{item.avata == null ? null : 'Status'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.Photos() }} >
                                                <Text >{item.avata == null ? null : 'Photo'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.Friend() }} >
                                                <Text >{item.avata == null ? null : 'Friends'}</Text>
                                            </TouchableOpacity>
    
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.Share() }} >
                                                <Text >{item.avata == null ? null : 'Share'}</Text>
                                            </TouchableOpacity>
    
                                        </View>
                                    </View>
    
                                    <View style={{ marginBottom: (item.anhbia == null ? 0 : 20) }}>
                                        <Text>{item.StatusMe == null ? null : item.StatusMe}</Text>
                                        <ImageBackground source={item.imaPost} style={{ height: (item.imaPost == null ? 0 : avataHeight), width: (item.imaPost == null ? 0 : avataWidth) }}>
    
                                        </ImageBackground>
    
                                    </View>
                                </View>
    
    
                            </View>
    
    
    
                        }
                    />
    
                </View>


*/}