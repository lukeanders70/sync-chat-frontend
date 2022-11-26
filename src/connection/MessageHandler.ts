import { ActivateResponseMessage } from "./message/types/Activate";
import { ActiveClientListResponseMessage } from "./message/types/ActiveClientList";
import { AddLetterMessage, NewLetterMessage, ValidateAddLetterMessage } from "./message/types/AddLetter";
import { BaseMessage, ValidateBaseMessage } from "./message/types/Base";
import { ConnectedMessage } from "./message/types/Connected";
import { NewClientMessage } from "./message/types/NewClient";
import { RemoveClientMessage } from "./message/types/RemoveClient";

class MessageDelegate<T extends BaseMessage> {
    // map of bound object reference, to message handler
    private handlers : Map<any, ((message : T) => void)[] > = new Map()

    Handle = (messageString: string) => {
        const message: T = JSON.parse(messageString);
        this.handlers.forEach((value: ((message : T) => void)[], key: any) => {
            value.forEach((handler: (message : T) => void ) => {
                handler(message);
            });
        });
    }

    AddHandler = (objectReference: any, handler: (message : T) => void) => {
        if(this.handlers.has(objectReference)) {
            this.handlers.get(objectReference)?.push(handler)
        } else {
            this.handlers.set(objectReference, [handler])
        }
    }

    ClearObjectHandlers = (objectReference: any) => {
        this.handlers.delete(objectReference)
    }

    ClearAllHandelrs = () => {
        this.handlers.clear()
    }
}

export class MessageHandler {

    // private delegates : Map<string, string> = new Map()
    HandleMessage = (messageString: string) => {
        let eventDataParsed: BaseMessage = JSON.parse(messageString);
        let valid = ValidateBaseMessage(eventDataParsed)
        if(!valid) {
            console.warn("Failed to Validate Base Message: " + messageString)
            return;
        }
        switch(eventDataParsed.type) {
            case "connected" : {
                this.ConnectedDelegate.Handle(messageString)
                break;
            } 
            case "activate-response" : {
                this.ActiveResponseDelegate.Handle(messageString)
                break;
            }
            case "active-client-list-response" : {
                this.ActiveClientListResponseDelegate.Handle(messageString)
                break;
            }
            case "new-client" : {
                this.NewClientDelegate.Handle(messageString)
                break;
            }
            case "remove-client" : {
                this.RemoveClientDelegate.Handle(messageString)
                break;
            }
            case("add-letter") : {
                this.AddLetterDelegate.Handle(messageString)
                break;
            }
            case("new-letter") : {
                this.NewLetterDelegate.Handle(messageString)
            }
        }
    }

    // delegates
    public ConnectedDelegate: MessageDelegate<ConnectedMessage> = new MessageDelegate<ConnectedMessage>()
    public ActiveResponseDelegate: MessageDelegate<ActivateResponseMessage> = new MessageDelegate<ActivateResponseMessage>()
    public ActiveClientListResponseDelegate: MessageDelegate<ActiveClientListResponseMessage> = new MessageDelegate<ActiveClientListResponseMessage>()
    public NewClientDelegate: MessageDelegate<NewClientMessage> = new MessageDelegate<NewClientMessage>()
    public RemoveClientDelegate: MessageDelegate<RemoveClientMessage> = new MessageDelegate<RemoveClientMessage>()
    public AddLetterDelegate: MessageDelegate<AddLetterMessage> = new MessageDelegate<AddLetterMessage>()
    public NewLetterDelegate: MessageDelegate<NewLetterMessage> = new MessageDelegate<NewLetterMessage>()
}