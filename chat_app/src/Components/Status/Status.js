/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components'; //yarn add react-native-deprecated-custom-components

import StatusPublic from './StatusPublic';
import StatusUser from './StatusUser';
import StatusFriend from './StatusFriend';
import StatusCaNhan from './StatusCaNhan';
import ChatUsername from './ChatUsername';



export default class Status1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timePassed: false,
        }
    }

    /*
    componentDidMount() {

        /*
        var time = 6000;
        //sau 1 khoang thoi gian vi du time = 60000(ms)=60(s) thi ap se lai  thuc hien ham refreshTokenApp(); 1 lan
        setInterval(() => {
           //cu sau time tinh bang miligiay  thi thuc hien ham refreshTokenApp()  lan
           refreshTokenApp();
        }, time);//tinh bang mili  giay (1000ms= 1s)
        */
        

        /*
        setTimeout(() => {
            this.setState({
                timePassed: true //neu timePassed = true khac voi khi bat dat = false sau 1 khoang thoi gian 10000(ms) thi ap se lai  thuc hien ham refreshTokenApp(); 1 lan
            });
            refreshTokenApp();
        }, 10000);
        */
      /*  
    }
    */
    render() {
        return (
            <NavigationExperimental.Navigator
                initialRoute={{ name: 'CHAT_USERNAME' }}

                renderScene={(route, navigator) => {
                    switch (route.name) {
                        case 'STATUS_PUBLIC': return <StatusPublic navigator={navigator} />;
                        case 'STATUS_USER': return <StatusUser navigator={navigator} User={route.User} />;
                        case 'STATUS_CANHAN': return <StatusCaNhan navigator={navigator} User={route.User} StatusUser_item={ route.StatusUser_item } />;
                        case 'CHAT_USERNAME': return <ChatUsername navigator={navigator} User={route.User} StatusUser_item={ route.StatusUser_item } />;
                       
                        
                        default: return <StatusFriend navigator={navigator} />;
                    
                    }
                }}
            />
        );
    }
}
