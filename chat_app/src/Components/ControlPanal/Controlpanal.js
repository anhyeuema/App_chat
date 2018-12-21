import React, { Component } from 'react';
import { View,Text,TouchableOpacity, } from 'react-native';


export default class Controlpanal extends Component {

    gotoAuthentication() {
        const navigator = this.props.navigator;
        navigator.push({name:'AUTHENTICATION'});
    }

    gotoUser() {
        const navigator = this.props.navigator;
        navigator.push({name:'USER'});
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#E61A5F'}}>
                <Text>Controlpanal</Text>
                <TouchableOpacity onPress={() => this.gotoAuthentication()} >
                    <Text>GO TO AUTHENTICATION</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.gotoUser()} >
                    <Text>GO TO USER</Text>
                </TouchableOpacity>
            </View>
        );
    }
}