import React, { ReactElement } from 'react'
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
        this.state.connectionStatus = this.connectionManager.connectionStatus
    }

    componentDidMount(): void {
        this.connectionManager.SetConnectionStatusChangedHandler(this.handleConnectionStatusChanged)
        this.connectionManager.SetOtherClientConnectionChangedHandler(this.handleOtherClientsChanged)
    }

    componentWillUnmount(): void{
        this.connectionManager.RemoveConnectionStatusChangedHandler()
        this.connectionManager.RemoveOtherClientConnectionChangedHandler()
    }

    handleConnectionStatusChanged = (newStatus: ConnectionStatus) => {
        this.setState({ connectionStatus: newStatus })
    }

    handleOtherClientsChanged = (newOtherClients: Set<string>) => {
        console.log("handleOtherClientsChanged")
        let otherClients: string[] = []
        newOtherClients.forEach((clientName : string) => {
            otherClients.push(clientName)
        })
        this.setState({ connectionNames: otherClients.sort()})
    }

    getComponentForClientName = (clientName: string): ReactElement => {
        return <UserTextContainer userName={clientName}/>
    }

    render(){
        return (
            <div id="mainContainer">
                <p>connection status: {this.state.connectionStatus}</p>
                <UserTextContainer userName={this.props.name}/>
                {this.state.connectionNames.map((clientName : string) => this.getComponentForClientName(clientName))}
            </div>
        )
    }
}

export default Main