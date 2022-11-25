import { BaseMessage } from "./Base"

// This defines a message sent from the server to a client informing of a new client connection
// from a different client
export interface RemoveClientMessage extends BaseMessage {
    clientName: string
}
