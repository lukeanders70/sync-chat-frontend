import { hostname } from 'os';
import React, { ReactElement } from 'react'
import { ConnectionManager, ConnectionStatus, GetOrCreateConnectionManager } from '../connection/ConnectionManager';
import { AddLetterMessage } from '../connection/message/types/AddLetter';
import ConnectionStatusContainer from './misc/ConnectionStatusContainer';
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

        var host: string = "";
        switch(process.env.NODE_ENV){
            case 'development':
                host="localhost"
                break;
            case 'production':
                host="3.88.252.157"
                break;
            case 'test':
                host="localhost"
                break;
        }

        this.connectionManager = GetOrCreateConnectionManager(host, "8999", props.name)
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
        return <UserTextContainer userName={clientName} primaryClient={false}/>
    }

    render(){
        return (
            <div id="mainContainer">
                <ConnectionStatusContainer connectionStatus={this.state.connectionStatus}/>
                <UserTextContainer userName={this.props.name} primaryClient={true}/>
                {this.state.connectionNames.map((clientName : string) => this.getComponentForClientName(clientName))}
            </div>
        )
    }
}

export default Main