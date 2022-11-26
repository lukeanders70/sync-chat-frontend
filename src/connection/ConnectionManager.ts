import { ActivateResponseMessage, CreateActivateMessage } from "./message/types/Activate";
import { ActiveClientListResponseMessage, CreateActivateClientListMessage } from "./message/types/ActiveClientList";
import { BaseMessage } from "./message/types/Base";
import { ConnectedMessage  } from "./message/types/Connected";
import { NewClientMessage } from "./message/types/NewClient";
import { RemoveClientMessage } from "./message/types/RemoveClient";
import { MessageHandler } from "./MessageHandler";

export enum ConnectionStatus {
    Unconnected,
    Connected,
    Active,
}

var connectionManagerInstance : ConnectionManager

export function GetOrCreateConnectionManager(host : string, port : string, clientName: string) {
    if(connectionManagerInstance === undefined) {
        connectionManagerInstance = new ConnectionManager(host, port, clientName)
    }
    return connectionManagerInstance
}

export function GetConnectionManager() {
    return connectionManagerInstance
}

export class ConnectionManager 
{
    public connectionStatus : ConnectionStatus
    public messageHandler : MessageHandler

    private connection : WebSocket
    private clientName : string
    private otherClients : Set<string>
    
    private ConnectionStatusChangedHandler? : (newStatus: ConnectionStatus) => void
    private OtherClientsChangedHandler? : (newClientsList: Set<string>) => void

    constructor(host : string, port : string, clientName : string) {

        const connectionString = "ws://" + host + ":" + port

        this.connection = new WebSocket(connectionString)
        this.connectionStatus = ConnectionStatus.Unconnected
        this.clientName = clientName
        this.otherClients = new Set<string>()
        this.messageHandler = new MessageHandler()

        this.SetMessageListeners()
    }

    ///////////////////
    // Base Handlers //
    ///////////////////

    private HandleOpen(event: Event) {
        console.log("Connection Open")
    }
    

    private HandleMessage(event: MessageEvent) {
        const eventData: string = event.data.toString()
        this.messageHandler.HandleMessage(eventData)
    }

    private HandleError(event: Event) {
        console.error("Error on websocket " + event)
    }

    private HandleClose(event: CloseEvent) {
        this.RemoveActiveListeners();
        this.SetConnectionStatus(ConnectionStatus.Unconnected)
    }

    //////////////////////
    // Message Handlers //
    /////////////////////

    private OnConnected(message : ConnectedMessage) {

        if(this.connectionStatus !== ConnectionStatus.Unconnected) {
            console.error("got connection message when status was not Unconnected")
            return;
        }
        this.SetConnectionStatus(ConnectionStatus.Connected)

        let ActivateMessage = CreateActivateMessage(message.connectionId, this.clientName)
        this.SendMessage(ActivateMessage, false);
    }

    private OnActivated(message : ActivateResponseMessage) {
        if(this.connectionStatus !== ConnectionStatus.Connected) {
            console.error("Got an activate message when connection status was not Connected")
            return;
        }
        if(message.success) {
            this.SetConnectionStatus(ConnectionStatus.Active)
            this.SetActivatedListeners()

            // get latest list of currently connected clients
            const activeClientListMessage = CreateActivateClientListMessage(this.clientName)
            this.SendMessage(activeClientListMessage)
        } else {
            console.error("Failed to Activate Connection")
        }
    }

    private OnActiveClientList(message: ActiveClientListResponseMessage) {
        message.clientNames.forEach(clientName => {
            this.otherClients.add(clientName)
        });

        if(this.OtherClientsChangedHandler !== undefined) {
            this.OtherClientsChangedHandler(this.otherClients)
        }
    }

    private OnNewClient(message: NewClientMessage) {
        console.log("OnNewClient")
        this.otherClients.add(message.clientName)
        if(this.OtherClientsChangedHandler !== undefined) {
            this.OtherClientsChangedHandler(this.otherClients)
        }
    }

    private OnRemoveClient(message: RemoveClientMessage) {
        this.otherClients.delete(message.clientName)
        if(this.OtherClientsChangedHandler !== undefined) {
            this.OtherClientsChangedHandler(this.otherClients)
        }
    }

    ////////////////////
    // Public Methods //
    ////////////////////

    public SendMessage(message : BaseMessage, forceActive : boolean = true) {
        if(!forceActive || this.connectionStatus === ConnectionStatus.Active) {
            console.log("outgoing message of type : " + message.type + " on connection of name " + this.clientName)
            this.connection.send(JSON.stringify(message))
        } else {
            console.log("tried to send a message on an inactive connection")
        }
    }

    // TODO: Make delegate helper and move that use that
    public SetConnectionStatusChangedHandler(newHandler: (newStatus: ConnectionStatus) => void){
        if(this.ConnectionStatusChangedHandler !== undefined) {
            console.warn("Setting connnection status handler over existing handler")
        }
        this.ConnectionStatusChangedHandler = newHandler;
    }

    // TODO: make delegate helper and move to use that
    public RemoveConnectionStatusChangedHandler(){
        this.ConnectionStatusChangedHandler = undefined
    }

    public SetOtherClientConnectionChangedHandler(newHandler: (newClients: Set<string>) => void) {
        if(this.OtherClientsChangedHandler !== undefined) {
            console.warn("Seeting on other clients changed handler over existing handler")
        }
        this.OtherClientsChangedHandler = newHandler
    }

    public RemoveOtherClientConnectionChangedHandler() {
        this.OtherClientsChangedHandler = undefined;
    }

    /////////////////////
    // Private Helpers //
    /////////////////////
    
    /**
     * Sets the internal state of conneciton status and fires delgate if required
     */
    private SetConnectionStatus(newStatus: ConnectionStatus) {
        this.connectionStatus = newStatus
        console.log("Connection Status Updated to Status: " + this.connectionStatus)
        if(this.ConnectionStatusChangedHandler !== undefined) {
            this.ConnectionStatusChangedHandler(this.connectionStatus)
        }
    }

    /**
     * Sets listeners that are always active on this connection
     */
    private SetMessageListeners() {
        this.connection.onopen = this.HandleOpen.bind(this)
        this.connection.onmessage = this.HandleMessage.bind(this)
        this.connection.onerror = this.HandleError.bind(this)
        this.connection.onclose = this.HandleClose.bind(this)

        this.messageHandler.ConnectedDelegate.AddHandler(this, this.OnConnected.bind(this))
        this.messageHandler.ActiveResponseDelegate.AddHandler(this, this.OnActivated.bind(this))
    }

    /**
     * Sets Listeners that are only active when the connection is activated
     */
    private SetActivatedListeners() {
        this.RemoveActiveListeners()

        this.messageHandler.ActiveClientListResponseDelegate.AddHandler(this, this.OnActiveClientList.bind(this))
        this.messageHandler.NewClientDelegate.AddHandler(this, this.OnNewClient.bind(this))
        this.messageHandler.RemoveClientDelegate.AddHandler(this, this.OnRemoveClient.bind(this))
    }

    /**
     * Removes all message delegates bound with this connection manager
     */
    private RemoveActiveListeners() {
        this.messageHandler.ActiveClientListResponseDelegate.ClearObjectHandlers(this)
        this.messageHandler.NewClientDelegate.ClearObjectHandlers(this)
        this.messageHandler.RemoveClientDelegate.ClearObjectHandlers(this)
    }
}