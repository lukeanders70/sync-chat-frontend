import { ActivateResponseMessage, CreateActivateMessage, ValidateActivateResponseMessage } from "./message/types/Activate";
import { BaseMessage, ValidateBaseMessage } from "./message/types/Base";
import { ConnectedMessage, ValidateConnectedMessage } from "./message/types/Connected";

export enum ConnectionStatus {
    Unconnected,
    Connected,
    Active,
}

var connectionManagerInstance : ConnectionManager

export function GetConnectionManager(host : string, port : string, clientName: string) {
    if(connectionManagerInstance === undefined) {
        connectionManagerInstance = new ConnectionManager(host, port, clientName)
    }
    return connectionManagerInstance
} 

export class ConnectionManager 
{
    private connection : WebSocket
    private clientName : string
    public connectionStatus : ConnectionStatus
    private ConnectionStatusChangedHandler? : (newStatus: ConnectionStatus) => void

    constructor(host : string, port : string, clientName : string) {

        console.log("constructing connection manager")
        const connectionString = "ws://" + host + ":" + port

        this.connection = new WebSocket(connectionString)
        this.connectionStatus = ConnectionStatus.Unconnected
        this.clientName = clientName

        this.SetMessageListeners()
    }

    private SetMessageListeners() {
        this.connection.onopen = this.HandleOpen.bind(this)
        this.connection.onmessage = this.HandleMessage.bind(this)
        this.connection.onerror = this.HandleError.bind(this)
        this.connection.onclose = this.HandleClose.bind(this)
    }

    private HandleOpen(event: Event) {
        console.log("Connection Open")
    }

    private HandleMessage(event: MessageEvent) {
        let eventData = event.data.toString()
        let eventDataParsed: BaseMessage = JSON.parse(eventData);
        let valid = ValidateBaseMessage(eventDataParsed)
        
        if(valid) {
            if(this.connectionStatus === ConnectionStatus.Active) {
                this.HandleActiveMessage(eventDataParsed, eventData)
            } else {
                this.HandleInActivateMessage(eventDataParsed, eventData)
            }
        } else {
            console.error("Received Message that was not valid Base Message")
        }
    }

    private HandleInActivateMessage(message: BaseMessage, messageString: string) {
        switch(message.type) {
            case "connected" : {
                let connectedMessage: ConnectedMessage = JSON.parse(messageString)
                let valid = ValidateConnectedMessage(connectedMessage)
                if(valid) {
                    if(this.ConnectionStatusChangedHandler !== undefined) {
                        this.ConnectionStatusChangedHandler(this.connectionStatus);
                    }
                    this.connectionStatus = ConnectionStatus.Connected
                    let ActivateMessage = CreateActivateMessage(connectedMessage.connectionId, this.clientName)
                    this.SendMessage(ActivateMessage, false);
                }
                break;
            } case "active-response" : {
                let activateResponseMessage: ActivateResponseMessage = JSON.parse(messageString)
                let valid = ValidateActivateResponseMessage(activateResponseMessage)
                if(valid) {
                    if(activateResponseMessage.success){
                        this.SetActive()
                    } else {
                        console.error("unable to activate connection!")
                    }
                } else {
                    console.error("activate response message was not valid")
                }
                break;
            } default : {
                console.warn("Received unrecognized message for inactive connection : " + message.type)
            }
        }
    }

    private HandleActiveMessage(message: BaseMessage, messageString: string) {

    }

    public SendMessage(message : BaseMessage, forceActive : boolean = true) {
        if(!forceActive || this.connectionStatus === ConnectionStatus.Active) {
            console.log("outgoing message of type : " + message.type + " on connection of name " + this.clientName)
            this.connection.send(JSON.stringify(message))
        } else {
            console.log("tried to send a message on an inactive connection")
        }
    }

    public SetConnectionStatusChangedHandler(newHandler: (newStatus: ConnectionStatus) => void){
        if(this.ConnectionStatusChangedHandler !== undefined) {
            console.warn("Setting connnection status handler over existing handler")
        }
        this.ConnectionStatusChangedHandler = newHandler;
    }

    public RemoveConnectionStatusChangedHandelr(){
        this.ConnectionStatusChangedHandler = undefined
    }

    private SetActive() {
        this.connectionStatus = ConnectionStatus.Active
        if(this.ConnectionStatusChangedHandler !== undefined) {
            this.ConnectionStatusChangedHandler(this.connectionStatus);
        }
        console.log("Connection Active")
    }

    private HandleError(event: Event) {
        console.error("Error on websocket " + event)
    }

    private HandleClose(event: CloseEvent) {
        this.connectionStatus = ConnectionStatus.Unconnected
        if(this.ConnectionStatusChangedHandler !== undefined) {
            this.ConnectionStatusChangedHandler(this.connectionStatus);
        }
        console.log("Connection Closed")
    }
}