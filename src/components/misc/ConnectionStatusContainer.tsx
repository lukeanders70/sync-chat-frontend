import React from 'react'
import { ConnectionStatus } from '../../connection/ConnectionManager'

type ConnectionStatusContainerProps = {
    connectionStatus: ConnectionStatus
}

type ConnectionStatusContainerState = {
}

class ConnectionStatusContainer extends React.Component<ConnectionStatusContainerProps, ConnectionStatusContainerState> {
    state: ConnectionStatusContainerState = {}

    connectionStatusToString = (status : ConnectionStatus) : string => {
        switch(status){
            case(ConnectionStatus.Active): {
                return "active"
            }
            case(ConnectionStatus.Connected): {
                return "connected"
            }
            case(ConnectionStatus.Unconnected): {
                return "unconnected"
            }
        }
    }

    render() {

        return (
            <div id='ConnectionStatusContainer' className={this.connectionStatusToString(this.props.connectionStatus)}>
                {this.connectionStatusToString(this.props.connectionStatus)}
            </div>
        )
    }
}

export default ConnectionStatusContainer