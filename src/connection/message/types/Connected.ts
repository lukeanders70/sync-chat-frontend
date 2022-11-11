import { BaseMessage } from "../types/Base"

export interface ConnectedMessage extends BaseMessage{
    // letter
    connectionId: string
}

export function ValidateConnectedMessage(message : ConnectedMessage) : boolean {
    return message.connectionId != null && message.connectionId != ""
}
