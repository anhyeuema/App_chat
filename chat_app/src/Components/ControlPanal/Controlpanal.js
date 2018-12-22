import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';


import global from '../../../api/global';
import getToken from '../../../api/getToken';
import User from '../User/User';

export default class Controlpanal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            //     username: null,
            USER: null,
        };
        //   global.OnSignIn = this.OnSignIn.bind(this); //khai bao ham lobal.onSignIn = ham this.onSignIn.bind(this) o day
        // global.OnSignIn = () =>{ this.OnSignIn1()}; //khai bao ham lobal.onSignIn = ham this.onSignIn.bind(this) o day
        global.OnSignIn = this.OnSignIn1.bind(this);
    }



    OnSignIn1(Users) {
        getToken('@Users')
            .then(Users1 => {
                console.log('Users:::::', Users1);
                this.setState({
                    // USER = false na de y ham  JXSControl = this.state.USER ? SignIn : SignIned;
                    // co nghia la SignIned tuong uong voi USER = false nghia la se nhay vao ham SignIned
                    USER: Users1, // USER = username1 nghia la USER != null thi se nhay ham
                    //const JXSControl = this.state.USER ? SignIn : SignIned; tu ham nay ta se co SignIned
                    isLogin: true
                });
                console.log('this.state.USER::::', this.state.USER);
                if (this.state.USER !== null) { //co username tra ve thi la da SignIned
                    // USER = false na de y ham  JXSControl = this.state.USER ? SignIn : SignIned;
                     // co nghia la SignIned tuong uong voi USER = false nghia la se nhay vao ham SignIned
                     this.setState({
                      //  isLogin: true
                     });
                } 
                console.log('this.state.isLogin::::', this.state.isLogin);
            });

        /*
        console.log('Username VE CHO THONG TIN NGUOI DUNG KHI DANG NHAP THANH CONG::::', Users);
        this.setState({
            // USER = false na de y ham  JXSControl = this.state.USER ? SignIn : SignIned;
            // co nghia la SignIned tuong uong voi USER = false nghia la se nhay vao ham SignIned
            USER: Users // USER = username1 nghia la USER != null thi se nhay ham
            //const JXSControl = this.state.USER ? SignIn : SignIned; tu ham nay ta se co SignIned

        });
        console.log('this.state.USER::::', this.state.USER);
        */
        /*
        this.setState({
            username: username1,
        });
        /*
        if (this.state.username !== null) { //co username tra ve thi la da SignIned
           // USER = false na de y ham  JXSControl = this.state.USER ? SignIn : SignIned;
            // co nghia la SignIned tuong uong voi USER = false nghia la se nhay vao ham SignIned
            USER: false,
        } */
    }

    ImagPicker() {

    }



    LogOut() { //xoa token
        this.setState({ username: mull });
        saveToken('@token', '');
        this.setState({
            // USER = false na de y ham  JXSControl = this.state.USER ? SignIn : SignIned;
            // co nghia la SignIned tuong uong voi USER = false nghia la se nhay vao ham SignIned
            USER: true,

        });
    }

    gotoAuthentication() {
        const navigator = this.props.navigator;
        navigator.push({ name: 'AUTHENTICATION' });
    }

    gotoUser() {
        const navigator = this.props.navigator;
        navigator.push({ name: 'USER' });
    }

    render() {
        const { styleSignIn, txtSignInStyle, styleAvata } = styles;
        const SignIn = (
            <View style={{ flex: 1, backgroundColor: '#E61A5F', justifyContent: 'center', alignItems: 'center', }}>
                <Image
                    style={{ width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', }}
                    source={require('../../../public/imgaes/gaixinh.jpg')}
                />


                <TouchableOpacity onPress={() => this.gotoAuthentication()} style={styleSignIn}>
                    <Text style={txtSignInStyle}>SingIn</Text>
                </TouchableOpacity>

                <Text>nguyen anh{this.state.USER ? this.state.USER : ''}</Text>

            </View>
        );

        const SignIned = (
            <View style={{ flex: 1, backgroundColor: '#E61A5F', justifyContent: 'center', alignItems: 'center', }}>
                <TouchableOpacity onPress={() => this.ImagPicker()} style={styleAvata} >
                    <Text>Doi Avata</Text>
                </TouchableOpacity>
                <Image
                    style={{ width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', }}
                    source={require('../../../public/imgaes/gaixinh.jpg')}
                />
                <Text>nguyen van anh{this.state.username}</Text>
                <TouchableOpacity onPress={() => this.gotoUser()} style={styleSignIn} >
                    <Text>changInfo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.LogOut()} style={styleSignIn} >
                    <Text>LogOut</Text>
                </TouchableOpacity>

            </View>
        );
        //USER = null ? dung thi SignIn
        //USER != null ? dung thi SignIned
       // const JXSControl = this.state.USER ? SignIned : SignIn;
       // const JXSControl = this.state.isLogin ? SignIn : SignIned ;
                                            //? true : false
       const JXSControl = this.state.isLogin ? SignIned:SignIn;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Text>Controlpanalfffff</Text>
                {JXSControl}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    styleSignIn: {
        width: 150, height: 30,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#95CF57',
        borderTopLeftRadius: 20, borderTopRightRadius: 15,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 15,
        marginTop: 10,
    },
    styleSignOut: {

    },
    txtSignInStyle: {
        justifyContent: 'center', alignItems: 'center'
    },
    styleAvata: {
        width: 150, height: 30,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#95CF57',
        borderTopLeftRadius: 20, borderTopRightRadius: 15,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 15,
        marginBottom: 10,
    }
})