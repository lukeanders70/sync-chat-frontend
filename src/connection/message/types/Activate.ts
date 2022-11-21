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
    return message.connectionId != undefined && message.connectionId != "" && message.clientName != undefined && message.clientName != ""
}


export interface ActivateResponseMessage extends BaseMessage {
    connectionId: string
    clientName: string
    success: boolean
}

export function ValidateActivateResponseMessage(message: ActivateResponseMessage) : boolean {
    return message.connectionId !== undefined && message.clientName !== undefined && message.success !== undefined
}
