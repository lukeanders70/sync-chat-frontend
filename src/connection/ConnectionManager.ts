import WebSocket from "ws";
import { CreateActivateMessage } from "./message/types/Activate";
import { BaseMessage, ValidateBaseMessage } from "./message/types/Base";
import { ConnectedMessage, ValidateConnectedMessage } from "./message/types/Connected";

export enum ConnectionStatus {
    Unconnected,
    Connected,
    Active,
}

export class ConnectionManager 
{
    private connection : WebSocket
    private clientName : string
    public connectionStatus : ConnectionStatus

    constructor(host : string, port : string, clientName : string) {

        this.connection = new WebSocket(host + ":" + port)
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

    private HandleOpen(event: WebSocket.Event) {
        console.log("Connection Open")
    }

    private HandleMessage(event: WebSocket.MessageEvent) {
        let eventData = event.data.toString()
        let eventDataParsed: BaseMessage = JSON.parse(eventData);
        let valid = ValidateBaseMessage(eventDataParsed)
        
        if(valid) {
            if(this.connectionStatus == ConnectionStatus.Active) {
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
                    let ActivateMessage = CreateActivateMessage(connectedMessage.connectionId, this.clientName)
                    this.SendMessage(ActivateMessage, false);
                }
                break;
            } case "active-response" : {
                this.SetActive()
                break;
            } default : {
                console.warn("Received unrecognized message for inactive connection : " + message.type)
            }
        }
    }

    private HandleActiveMessage(message: BaseMessage, messageString: string) {

    }

    public SendMessage(message : BaseMessage, forceActive : boolean = true) {
        if(!forceActive || this.connectionStatus == ConnectionStatus.Active) {
            console.log("outgoing message of type : " + message.type + " on connection of name " + this.clientName)
            this.connection.send(JSON.stringify(message))
        } else {
            console.log("tried to send a message on an inactive connection")
        }
    }

    private SetActive() {
        this.connectionStatus = ConnectionStatus.Active
        console.log("Connection Active")
    }

    private HandleError(event: WebSocket.ErrorEvent) {
        console.error("Error on websocket " + event.error)
    }

    private HandleClose(event: WebSocket.CloseEvent) {
        this.connectionStatus = ConnectionStatus.Unconnected
        console.log("Connection Closed")
    }
}