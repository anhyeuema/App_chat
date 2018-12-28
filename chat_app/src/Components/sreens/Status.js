
import NavigationExperimental from 'react-native-deprecated-custom-components';

import React, { Component } from 'react';


import chatCaNhan from './chatCaNhan';

import StatusView from './StatusView';
import Messenger from './Messenger';
import thongbao from './thongbao';

export default class Status extends Component {
    render() {
        return (
            <NavigationExperimental.Navigator
                initialRoute={{ name: 'STATUS' }}
                renderScene={(route,navigator) => {
                    switch (route.name) {
                        case 'MESSENGER': return <Messenger navigator={navigator} />;
                        case 'STATUS': return <StatusView navigator={navigator} />;
                        case 'CHATCANHAN': return <chatCaNhan navigator={navigator} />;
                        case 'THONGBAO': return <thongbao navigator={navigator} />;
                       // default: return <chatCaNhan navigator={navigator} />;
                    }
                }}
            />
        );
    }
}
