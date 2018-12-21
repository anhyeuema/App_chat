import React, { Component } from 'react';
import { View, Text, TouchableOpacity, } from 'react-native';
import Drawer from 'react-native-drawer';
import ControlPanel from './ControlPanal/Controlpanal';
import Main from './Main';
export default class Trangchu extends Component {

    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffff' }}>
                <Text>Trangchu</Text>
                <Drawer

                    tapToClose={true} //hien controlra cho tapToClose={true}
                    openDrawerOffset={0.4} // 20% gap on the right side of drawer
                    
                    ref={(ref) => this._drawer = ref}
                    content = {< ControlPanel navigator={this.props.navigator} />}
                >
                    <Main OnControl ={() => this.openControlPanel()}   />
                </Drawer>
            </View>
        );
    }
}
