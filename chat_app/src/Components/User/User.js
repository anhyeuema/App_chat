import React, { Component } from 'react';
import { View, TouchableOpacity, Text,  } from 'react-native';

export default class User extends Component {
    render() {
        return(
            <View style={{ flex: 1, backgroundColor: '#ffff'}}>
                <Text>Component User</Text>
            </View>
        );
    }
}