import { BaseMessage } from "./Base"

// This defines a message sent from the client to inform the server about a new letter
export interface AddLetterMessage extends BaseMessage {
    l: string //letter
}

export function CreateAddLetterMessage(letter : string) {
    const letterMessage : AddLetterMessage = {
        type: "add-letter",
        l: letter
    }
    return letterMessage
}

export function ValidateAddLetterMessage(message: AddLetterMessage) {
    return message.l != undefined && message.l.length == 1
}

// This defines a message sent from the server to inform clients about a new letter from a specific user
export interface NewLetterMessage extends BaseMessage {
    l: string, //letter
    u: string //user
}

export function CreateNewLetterMessage(letter : string, user : string) : NewLetterMessage {
    let letterMessage : NewLetterMessage = {
        type: "new-letter",
        l: letter,
        u: user
    }
    return letterMessage
}
