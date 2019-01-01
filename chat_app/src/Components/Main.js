import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';

import Home from './sreens/Home';
import  Messenger  from './sreens/Messenger';
import Status from './sreens/Status';



export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'status'
        };
    }


    
    OnContolPanal() {
        const OnControl = this.props.OnControl; // khai bao bien OnControl de huong gia tri tu Tranhcu.js truyen sang OnControl ={() => this.openControlPanel()
        OnControl();
    }
    
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffff' }}>
                <View style={{ flex: 1, backgroundColor: '#F2F2F2' }} >
                <Text style={styles.styleText} >Main</Text>
                <TouchableOpacity onPress={() =>this.OnContolPanal()}>
                    <Text style={styles.styleText}>GOTO OnControl</Text>
                </TouchableOpacity>
                </View>
                

                <View style={{ flex: 10, backgroundColor: '#ffff' }}>
                    <TabNavigator>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'home'}
                            title="Home"
                            //  renderIcon={() => <Image source={...} />}
                            //  renderSelectedIcon={() => <Image source={...} />}
                         //   badgeText="1"
                            onPress={() => this.setState({ selectedTab: 'home' })}>
                            <Home />
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'messenger'}
                            title="Messenger"
                            // renderIcon={() => <Image source={...} />}
                            //  renderSelectedIcon={() => <Image source={...} />}
                            //  renderBadge={() => <CustomBadgeView />}
                            onPress={() => this.setState({ selectedTab: 'messenger' })}>
                            <Messenger />
                        </TabNavigator.Item>

                         <TabNavigator.Item
                            selected={this.state.selectedTab === 'status'}
                            title="Status"
                            //  renderIcon={() => <Image source={...} />}
                            //  renderSelectedIcon={() => <Image source={...} />}
                            //badgeText="1"
                            onPress={() => this.setState({ selectedTab: 'status' })}>
                            <Status />
                        </TabNavigator.Item>
                    </TabNavigator>
                </View>

            </View>
        );
    }
}

styles = StyleSheet.create({
    styleText: {
        fontSize: 6,
    },
});
