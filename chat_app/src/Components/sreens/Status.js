
import NavigationExperimental from 'react-native-deprecated-custom-components';

import React, { Component } from 'react';

import StatusView from './StatusView';
import Messenger from './Messenger';
import chatCaNhan from './chatCaNhan';

export default class Status extends Component {
    render() {
        return (
            <NavigationExperimental.Navigator
                initialRoute={{ name: 'STATUS' }}
                renderScene={(route,navigator) => {
                    switch (route.name) {
                        case 'MESSENGER': return <Messenger navigator={navigator} />;
                        case 'STATUS': return <StatusView navigator={navigator} />;
                        default: return <chatCaNhan navigator={navigator} />
                    }
                }}
            />
        );
    }
}
