import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ListView, TextInput, Image } from 'react-native';

import ImagePicker from 'react-native-image-picker'; //yarn add react-native-image-picker// react-native link react-native-image-picker
import io from 'socket.io-client/dist/socket.io.js';
import RNFetchBlob from 'react-native-fetch-blob'; //yarn add react-native-fetch-blob//react-native link

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};


var e;
const DATA = [
    { hoten: 'Mr.nam', namsinh: '1998' },
    { hoten: 'Mr.yen', namsinh: '2000' },
    { hoten: 'Mr.hanh', namsinh: '2003' },
];
export default class Messenger extends Component {
    constructor(props) {
        super(props);
        e = this;
        this.socket = io('http://192.168.0.101:3500', { jsonp: false });
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: ds.cloneWithRows(DATA),
            messengerText: '',
            username: '',
            messengerImage: null,
            resDATA: '',
            id: '',

            ImagePk: null,
            ImageWebBase64: null,
        };




        this.socket.on('server-send-messenger-from-app-to-AppAndWeb', async (mesT) => {
            console.log('app dang nhan messenger text');
            await e.setState({
                messengerText: mesT.ms,
                username: mesT.un,

            });
            const res = await {
                messengerText1: this.state.messengerText,
                username1: this.state.username,
            };
            await e.setState({
                resDATA: res,
                dataSource: ds.cloneWithRows(res),
            });

            console.log('this.state.messengerText::', this.state.messengerText);
            console.log('this.state.username:::', this.state.username);
            console.log('this.state.dataSource:::', this.state.dataSource);
            console.log('this.state.resDATA:::', this.state.resDATA);
        });


        //lang nghe su kien app send server nodejs va tu server nodejs tra ve App va web
        this.socket.on('server-send-imagePK-fromApp-toAppWeb', async (imagePIK) => {
            console.log('dang nhan image picker tu server');
            console.log('imagePIK::::', imagePIK);
            await e.setState({
                ImagePk: imagePIK,
            });
            res = await {
                ImagePk_1: this.state.ImagePk
            }
            await e.setState({
                resDATA: '',
                dataSource: ds.cloneWithRows(res),
            });
            console.log('this.state.ImagePk::::', this.state.ImagePk);
        });

        //app lang nghe su kien web gui imgae sang server va tu server ve app
        this.socket.on('server-send-imageBase64-fromweb-toAppAndWeb', async (imageWebBase64) => {
            console.log('app dang nhap image tu web');
            console.log('imageWebBase64:::::', imageWebBase64);
            var imageWebBase64_uri = { uri: 'data:image/jpeg;base64,' + imageWebBase64 };
            console.log('imageWebBase64_uri:::::', imageWebBase64_uri);
            e.setState({
                ImageWebBase64: imageWebBase64_uri
            });
            res = {
                ImageWebBase64_1: this.state.ImageWebBase64
            }
            e.setState({
                resDATA: res,
                dataSource: ds.cloneWithRows(res),
            });
            console.log('this.state.ImageWebBase64:::::', this.state.ImageWebBase64);
            console.log('this.state.ImageWebBase64.uri:::::', this.state.ImageWebBase64.uri);
        })


    }

    EmitText() {
        const MS = 'anhyeuem'
        //  const Ms = this.state.messengerText;
        this.socket.emit('app-send-messenger-text', MS);
        console.log('app_send_messenge::');
    }
    EmitImage() {

        this.socket.emit('app-send-image-picker', this.state.messengerImage);
        console.log('app dang gui image picker');
    }

    taohang(property) {
        return (
            <View style={{ flex: 1, backgroundColor: '#D6ECF8' }}>
                {/*<Text>{console.log(property.messengerText1)}</Text> */}
                <Text>{property.messengerText1}</Text>
                <Text>{console.log(property.messengerText1)}</Text>
                <Image
                    source={property.ImagePk_1}
                    style={{ width: 100, height: 100 }}
                />
            </View>

        );
    };

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
                const source = { uri: response.uri };

                // You can also display the image using data:
                // response.data la base64
                
               // const sourceBase64 = response.data;
                const sourceBase64 = { uri: 'data:image/jpeg;base64,' + response.data };// uri de hien thi tran web nhang ta the hien ca o web nen chi chuyen base64
                console.log(sourceBase64);
                this.setState({
                    avatarSource: source,
                    messengerImage: sourceBase64,

                });
            }
        });
    }

    uploadToServer() {
        RNFetchBlob.fetch('POST', 'http://192.168.0.103:1500/reactNative/Upload', {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        }, [
                // element with property `filename` will be transformed into `file` in form data
                { name: 'avatar', filename: 'avatar.png', data: this.state.messengerImage },
                // custom content type
                //    { name: 'avatar-png', filename: 'avatar-png.png', type: 'image/png', data: binaryDataInBase64 },
                // part file from storage
                //   { name: 'avatar-foo', filename: 'avatar-foo.png', type: 'image/foo', data: RNFetchBlob.wrap(path_to_a_file) },
                // elements without property `filename` will be sent as plain text
                { name: 'name', data: 'user' },
                {
                    name: 'info', data: JSON.stringify({
                        mail: 'example@example.com',
                        tel: '12345678'
                    })
                },
            ]).then((resp) => {
                // ...
            }).catch((err) => {
                // ...
            })
    }
    render() {
        const ImagePk_A = this.state.ImagePk == null ? null :
            <Image source={this.state.ImagePk} style={{ width: 100, height: 100 }} />
        const ImageWebBase64_A = this.state.ImageWebBase64 == null ? null :
            < Image source={this.state.ImageWebBase64} style={{ width: 100, height: 100 }} />

        const messengerImage_A = this.state.messengerImage == null ? null :
            < Image source={this.state.messengerImage} style={{ width: 100, height: 100 }} />
       
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFF' }}>

                <View style={{ flex: 1, backgroundColor: '#766F82' }}>


                    <Text>Component Messenger</Text>

                    <TextInput
                        onChangeText={text => this.setState({ messengerText: Text })}
                        value={this.state.messengerText}
                        placeholder={"Enter Messenger"}
                    />

                    <TouchableOpacity onPress={() => this.EmitText()}>
                        <Text>Enter Text</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.ShowImage_piker()}>
                        <Text>ShowImage_piker</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.EmitImage()}>
                        <Text>EmitImage</Text>
                    </TouchableOpacity>

                    {ImagePk_A}
                    {ImageWebBase64_A}
                    {messengerImage_A}
                </View>
                <View style={{ flex: 1, backgroundColor: '#B6DFCA' }}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.taohang}
                    />
                </View>

            </View>
        );
    }
}
