import React from 'react'
import { GetConnectionManager, ConnectionManager, ConnectionStatus } from '../connection/ConnectionManager';
import { AddLetterMessage } from '../connection/message/types/AddLetter';
import UserTextContainer from './userText/UserTextContainer';

type MainProps = {
    name: string
}

type MainState = {
    connectionStatus: ConnectionStatus
    connectionNames: string[]
}

class Main extends React.Component<MainProps, MainState> {
    state: MainState = {
        connectionStatus: ConnectionStatus.Unconnected,
        connectionNames: []
    }

    connectionManager : ConnectionManager;

    constructor(props: MainProps){
        super(props);
        this.connectionManager = GetConnectionManager("localhost", "8999", props.name)
        this.connectionManager.SetConnectionStatusChangedHandler(this.handleConnectionStatusChanged)

        this.state.connectionStatus = this.connectionManager.connectionStatus
    }

    handleConnectionStatusChanged = (newStatus: ConnectionStatus) => {
        this.setState({ connectionStatus: newStatus })
    }

    render(){
        return (
            <div id="mainContainer">
                <UserTextContainer userName={this.props.name}/>
            </div>
        )
    }
}

export default Main