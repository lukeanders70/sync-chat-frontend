export interface BaseMessage {
    type: string
}

export function ValidateBaseMessage(message: BaseMessage) : boolean {
    return message.type != null && message.type != ""
}