import React from 'react'
import { GetConnectionManager, ConnectionManager, ConnectionStatus } from '../connection/ConnectionManager';

type MainProps = {
    name: string
}

type MainState = {
    connectionStatus: ConnectionStatus
}

class Main extends React.Component<MainProps, MainState> {
    state: MainState = {
        connectionStatus: ConnectionStatus.Unconnected
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
                <h1>{this.props.name} : {this.state.connectionStatus}</h1>
            </div>
        )
    }
}

export default Main