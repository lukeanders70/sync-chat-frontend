import { BaseMessage } from "../types/Base"

export interface ActiveClientListMessage extends BaseMessage{
    clientName: string
}

export function CreateActivateClientListMessage(clientName: string) : ActiveClientListMessage  {
    let activateClientListMessage : ActiveClientListMessage = {
        type: "activate-client-list",
        clientName: clientName
    }
    return activateClientListMessage
}

export function ValidateActiveClientListMessage(message: ActiveClientListMessage) {
    return message.clientName != undefined
}


export interface ActiveClientListResponseMessage extends BaseMessage {
    clientNames: string[] // list of active clients besides this one
}

export function ValidateActiveClientListResponseMessage(message: ActiveClientListResponseMessage) : boolean {
    return message.clientNames !== undefined
}
