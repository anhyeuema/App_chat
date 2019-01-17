import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ImageBackground, TouchableOpacity, TextInput, AsyncStorage, Dimensions } from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
import ImagePicker from 'react-native-image-picker'; //yarn add react-native-image-picker// react-native link react-native-image-picker
import RNFetchBlob from 'react-native-fetch-blob'; //yarn add react-native-fetch-blob//react-native link
import getToken from '../../../api/getToken';

import global from '../../../api/global';

var e;

const { width, height } = Dimensions.get('window');

export default class User extends Component {
    constructor(props) {
        super(props);
        e = this;
        this.state = {
            dataUser: [
                { key: JSON.stringify(0), avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                { key: "1", StatusMe: 'statusImage1', imaPost: require('../../../api/ImageAvata/3.jpg') },
                { key: "2", StatusMe: 'statusImage2', imaPost: require('../../../api/ImageAvata/4.jpg') },
                { key: "3", StatusMe: 'statusImage3', imaPost: require('../../../api/ImageAvata/5.jpg') },


            ],
            User: '',
            refresh: false,

            textStatus: '', //text Trang thai
        };
        global.OnUser = this.getUser.bind(this);

    }

    getUser(User1) { //User1 la Username tu trang chu bang  global  truyen qua cho User.js
        e.setState({ User: User1 });
        console.log('User1 la Username tu trang chu bang  global  truyen qua cho User.js', this.state.User);
    }

    componentDidMount() {
        // this.getUser();
    }

    changedAvata() {

    }

    edit() {

    }

    render() {

        const item = { key: JSON.stringify(0), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') };
        return (
            <View style={{ flex: 1, backgroundColor: '#ffff' }}>
                <Text>Component User</Text>

                <View style={{ flex: item.anhbia == null ? 0 : 1, backgroundColor: '#EE89AB' }}>
                    <View style={{ flex: item.anhbia == null ? 0 : 6 }} >
                        <View style={{ flex: item.anhbia == null ? 0 : 2 }}>
                            <ImageBackground source={item.anhbia == null ? null : item.anhbia} style={{ flex: (item.anhbia == null) ? 0 : 1, width: avataWidth, height: avataHeight, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 1, flexDirection: 'row' }} >
                                    <View style={{ flex: item.anhbia == null ? 0 : 3 }} />
                                    <View style={{ flex: item.anhbia == null ? 0 : 1, flexDirection: 'row' }}>
                                        <View style={{ flex: item.anhbia == null ? 0 : 1 }}>
                                            <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 1 }} />
                                        </View>
                                        <View style={{ flex: item.anhbia == null ? 0 : 1 }} >
                                            <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 1 }} />
                                            <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 1 }} onPress={() => { this.edit() }}  >
                                                <Text style={{ flex: item.anhbia == null ? 0 : 2 }}></Text>
                                                <Text style={{ flex: item.anhbia == null ? 0 : 1 }}>{item.anhbia == null ? null : 'edit'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        <View style={{ flex: item.anhbia == null ? 0 : 1, backgroundColor: '#88CE66' }} />
                    </View >

                    <View style={{ flex: 1 }}>
                        <View style={{ flex: item.anhbia == null ? 0 : 4, backgroundColor: '#DC4D41' }} />
                        <View style={{ flex: item.anhbia == null ? 0 : 1 }}>
                            <TouchableOpacity onPress={() => { this.changedAvata() }} >
                                <Image source={item.avata == null ? null : item.avata} style={styles.avtaStyle}>

                                </Image>
                                <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 2 }} onPress={() => { this.CameraAvata() }} >
                                    <Text >{item.avata == null ? null : 'CameraAvata'}</Text>
                                </TouchableOpacity>
                                <Text style={{ flex: item.anhbia == null ? 0 : 2 }} />
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 2 }} onPress={() => { this.addFriend() }} >
                            <Text >{item.avata == null ? null : 'Add Friend'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 2 }} onPress={() => { this.Meesenger() }} >
                            <Text >{item.avata == null ? null : 'Meesenger'} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 2 }} onPress={() => { this.more() }} >
                            <Text >{item.avata == null ? null : 'more'} </Text>
                        </TouchableOpacity>
                    </View>


                    <View style={{ flex: item.anhbia == null ? 0 : 1 }} />


                    <View style={{ flex: item.anhbia == null ? 0 : 1, flexDirection: 'row' }} >
                        <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 2 }} onPress={() => { this.about() }} >
                            <Text >{item.avata == null ? null : 'about'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 2 }} onPress={() => { this.Photos() }} >
                            <Text >{item.avata == null ? null : 'Photos'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 2 }} onPress={() => { this.Friend() }} >
                            <Text >{item.avata == null ? null : 'Friend'}</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={{ flex: 1 }} >
                        <TextInput
                            onChangeText={text => this.setState({ textStatus: text })}
                            value={this.state.textStatus}
                            placeholder={item.avata == null ? null : "what us your mind ?"}
                        />
                        <View style={{ flex: item.anhbia == null ? 0 : 1, flexDirection: 'row' }} >
                            <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 2 }} onPress={() => { this.about() }} >
                                <Text >{item.avata == null ? null : 'Status'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 2 }} onPress={() => { this.Photos() }} >
                                <Text >{item.avata == null ? null : 'Photo'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: item.anhbia == null ? 0 : 2 }} onPress={() => { this.Friend() }} >
                                <Text >{item.avata == null ? null : 'Friends'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </View>






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

                                <View style={{  height: (item.avata) == null ? 0 : 50, marginTop: (item.avata == null ? 0 : 70), marginBottom: (item.avata == null ? 0 : 10), justifyContent: 'center', alignItems: 'center' }} >
                                    <TextInput
                                        onChangeText={text => this.setState({ textStatus: text })}
                                        value={this.state.textStatus}
                                        placeholder={item.avata == null ? null : "what us your mind ?"}
                                    />
                                    <View style={{ marginTop: (item.avata == null ? 0 : 10),  flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100  }} onPress={() => { this.about() }} >
                                            <Text >{item.avata == null ? null : 'Status'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{  height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100 }} onPress={() => { this.Photos() }} >
                                            <Text >{item.avata == null ? null : 'Photo'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100 }} onPress={() => { this.Friend() }} >
                                            <Text >{item.avata == null ? null : 'Friends'}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100 }} onPress={() => { this.Share() }} >
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