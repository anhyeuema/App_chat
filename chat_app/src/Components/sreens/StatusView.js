




import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
import ImagePicker from 'react-native-image-picker'; //yarn add react-native-image-picker// react-native link react-native-image-picker
import RNFetchBlob from 'react-native-fetch-blob'; //yarn add react-native-fetch-blob//react-native link

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',

    },
};


export default class Status extends Component {

    constructor(props) {
        super(props);
        this.socket = io('http://192.169.0.103:3500', { jsonp: false });
        this.state = {
            mang: [
                { key: '1', tuoi: 19, ten: 'nguyennam' },
                { key: '2', tuoi: 19, ten: 'nguyennam' },
                { key: '3', tuoi: 19, ten: 'nguyennam' },
                { key: '4', tuoi: 19, ten: 'nguyennam' },
            ],
            resData: [],
            refresh: false,
            avatarSource: null,
            avatarSourceUpLoadBase64: null,
            page: 1,
            txt: 'hello',
        }
    }

    componentDidMount() {
        var uri = 'http://192.168.216.2:81/App_Chat_Web/DemoFlatList/DemoFlat2.php?trang=1';
        var uri1 = 'http://192.168.216.2:81/App_Chat_Web/DemoFlatList/DemoFlat.php';
        this.setState({ refresh: true });
        fetch(uri)
            .then(res => {
                //  console.log('res::', res);
                console.log("res._bodyInit::::", res._bodyInit);
                var a = JSON.parse(res._bodyInit);
                console.log('a:::', a);

                this.setState({
                    resData: a,
                    refresh: false,
                });
                console.log('this.state.resData:::', this.state.resData);
            })
            .catch(e => console.log(e));
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
                const source = { uri: response.uri };

                // You can also display the image using data:
                // response.data la base64

                // const sourceBase64 = response.data;
                const sourceBase64 = { uri: 'data:image/jpeg;base64,' + response.data };// uri de hien thi tran web nhang ta the hien ca o web nen chi chuyen base64
                console.log(sourceBase64);
                this.setState({
                    avatarSourceUpLoadBase64: response.data,
                    avatarSource: source,
                    // messengerImage: sourceBase64,

                });
            }
        });
    }

    uploadToServer() {
        RNFetchBlob.fetch('POST', 'http://192.168.216.2:81/App_Chat_Web/DemoFlatList/upload.php', {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        }, [
                // element with property `filename` will be transformed into `file` in form data
                { name: 'image', filename: 'image.png', type: 'image/png', data: this.state.avatarSourceUpLoadBase64 },
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
                console.log("resp:::::",resp);
                console.log("resp.path:::::",resp.path);
            }).catch((err) => {
                console.log(err);
            })
    }



    gotoMessenger() {
        //  alert('1');
        const navigator = this.props.navigator;
        navigator.push({ name: 'MESSENGER' });

    }

    Refresh() {
        fetch('http://192.168.216.2:81/App_Chat_Web/DemoFlatList/DemoFlat1.php')
            .then(res => {
                // console.log('res::', res);
                var a = JSON.parse(res._bodyInit);
                this.setState({
                    resData: a,
                    refresh: false,
                });
                console.log('this.state.resData:::', this.state.resData);
            })
            .catch(e => console.log(e))
    }
    render() {
        const imagpicker = this.state.avatarSource == null ? null :
            <Image source={this.state.avatarSource} style={{ width: 100, height: 100 }} />
        return (
            <View style={styles.styleStatus}>
                <Text>Component Status</Text>
                <TouchableOpacity onPress={() => {
                    this.refs.danhsach.scrollToEnd()
                }}>  
                 <Text>{this.state.txt}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.ShowImage_piker()}>
                    <Text>Choose Image picker</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.uploadToServer()}>
                    <Text>upload image To Server PHP</Text>
                </TouchableOpacity>
                {imagpicker}

                <FlatList

                    ref="danhsach"
                    onEndReachedThreshold={0.3}
                    onEndReached={() => {
                        const page = 1;
                        this.setState({
                            txt: '123',
                            page: page + 1
                        });
                    }}
                    // horizontal={true}
                    refreshing={this.state.refresh}
                    onRefresh={() => this.Refresh()}


                    data={this.state.resData}
                    renderItem={({ item }) =>
                        <View style={styles.giaodien}>

                            <View style={styles.trai}>
                                <TouchableOpacity onPress={() => this.gotoMessenger()} >
                                    <Image source={{ uri: item.HINH }} style={{ width: 80, height: 80, borderRadius: 40 }} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.phai}>
                                <Text style={styles.styleText} >{item.NAME}</Text>
                                <Text style={styles.styleText} >{item.MOTA}</Text>
                                <Text style={styles.styleText} >{item.key}</Text>
                            </View>
                        </View>
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styleStatus: {
        flex: 1, backgroundColor: '#FF82D3'
    },
    giaodien: {
        borderBottomWidth: 1, padding: 50, flexDirection: 'row'
    },
    trai: {
        flex: 1, backgroundColor: '#6FAC2D', justifyContent: 'center', alignItems: 'center'
    },
    phai: {
        flex: 3, justifyContent: 'center', alignItems: 'center'
    },
    styleText: {
        fontSize: 10,
    }

})
