import { BaseMessage } from "../types/Base"

export interface ActivateMessage extends BaseMessage{
    connectionId: string
    clientName: string
}

export function CreateActivateMessage(connectionId : string, clientName: string) : ActivateMessage  {
    let activateMessage : ActivateMessage = {
        type: "activate",
        connectionId: connectionId,
        clientName: clientName
    }
    return activateMessage
}

export function ValidateActivateMessage(message: ActivateMessage) {
    return message.connectionId != null && message.connectionId != "" && message.clientName != null && message.clientName != ""
}
