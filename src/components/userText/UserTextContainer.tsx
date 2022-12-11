import React, { ChangeEvent } from 'react'
import { ConnectionManager, GetConnectionManager } from '../../connection/ConnectionManager'
import { CreateAddLetterMessage, NewLetterMessage } from '../../connection/message/types/AddLetter'
import UserNameContainer from './UserNameContainer'
import UserTextCursor from './UserTextCursor'

type UserTextContainerProps = {
    primaryClient: boolean
    userName: string
}

type UserTextContainerState = {
    text: string,
    active: boolean
}

type TimedLetter = {
    letter: string
    time: EpochTimeStamp
}

const LetterLifespanMs : number = 5000

class UserTextContainer extends React.Component<UserTextContainerProps, UserTextContainerState> {
    state: UserTextContainerState = {
        text: '',
        active: false
    }

    // pointer to the global connection manager
    connectionManager : ConnectionManager;

    // list of all the letters, and their arrived time
    letters : TimedLetter[]

    // the current timer that is waiting to erase the last letter. Is reassigned when letter is erased
    letterEraseTimer: number = 0

    inputElement: React.RefObject<HTMLInputElement>;

    constructor(props: UserTextContainerProps){
        super(props);

        this.connectionManager = GetConnectionManager()
        this.letters = []

        this.inputElement = React.createRef();
    }

    componentDidMount(): void {
        this.connectionManager.messageHandler.NewLetterDelegate.AddHandler(this, this.handleNewLetter)
    }

    componentWillUnmount(): void{
        this.connectionManager.messageHandler.NewLetterDelegate.ClearObjectHandlers(this)
    }

    handleOnTextInputChange = (event : ChangeEvent<HTMLInputElement>) => {
        const letter = event.target.value
        this.addLetterToEnd(letter)
        event.target.value = ""

        const AddLetterMessage = CreateAddLetterMessage(letter)
        this.connectionManager.SendMessage(AddLetterMessage)
    }

    handleNewLetter = (message : NewLetterMessage) => {
        if(message.u === this.props.userName) {
            this.addLetterToEnd(message.l)
        }
    }

    addLetterToEnd = (newLetter: string) => {
        if(newLetter.length !== 1) {
            console.error("Can only add single letters, not longer strings")
            return
        }
        if(this.letters.length !== this.state.text.length) {
            console.warn("Out of Sync! letters array and text state should be the same size")
            return
        }

        this.setState({ text : this.state.text + newLetter}, () => {
            this.letters.push({
                letter: newLetter,
                time: Date.now()
            })
            // for when there are no letters currently on screen
            if(this.letterEraseTimer === 0) {
                this.setFirstLetterTimer()
            }
        })
    }

    lettersArrayToStringTEMP = (): string => {
        var s: string = ""
        this.letters.forEach(element => {
            s += element.letter
        });
        return s;
    }

    removeLetterFromStart = () => {
        if(this.letters.length !== this.state.text.length) {
            console.warn("Out of Sync! letters array and text state should be the same size")
            return
        }

        //TODO: add mutex so this is thread safe
        if(this.letters.length > 0 && this.state.text.length > 0) {
            this.setState({ text: this.state.text.substring(1)}, () => {
                this.letters.shift()
                this.letterEraseTimer = 0
                this.setFirstLetterTimer()
            })
        }
    }

    setFirstLetterTimer = () => {
        if(this.letterEraseTimer !== 0) {
            console.warn("tried to set a letter time, but one is already active")
            return
        }
        if(this.letters.length > 0) {
            const firstLetter : TimedLetter = this.letters[0]
            const timeToWait = LetterLifespanMs - (Date.now() - firstLetter.time)
            if(timeToWait < 10) { // selecting 10 so we don't have a lot of really short timers
                this.removeLetterFromStart()
            }  else {
                this.letterEraseTimer = window.setTimeout(this.removeLetterFromStart, timeToWait)
            }
        }
    }

    setTypeActive = () => {
        if (this.inputElement.current) this.inputElement.current.focus();
    }

    onTypeActive = () => {
        this.setState({active : true})
    }

    onTypeInactive = () => {
        this.setState({active : false})
    }

    getUserTextClasses = () : string => {
        var userTextContainerClasses: string = "userTextContainer "
        userTextContainerClasses += this.props.primaryClient ? "primary" : "secondary"
        return userTextContainerClasses
    }

    getUserTextInnerDividerClasses = () : string => {
        var userTextContainerClasses: string = "userTextInnerDivider "
        userTextContainerClasses += this.props.primaryClient ? "primary" : "secondary"
        return userTextContainerClasses
    }

    render() {

        return (
            <div className={this.getUserTextClasses()} onClick={this.setTypeActive}>
                <div className="userTextInnerContainer">
                    < UserNameContainer userName={this.props.userName} primaryClient={this.props.primaryClient}/>
                    <p className="userText">{this.state.text === "" ? " " : this.state.text}</p>
                </div>
                < UserTextCursor active={this.state.active} primaryClient={this.props.primaryClient} />
                <div className='userTextInnerInputContainer'>
                    {this.props.primaryClient ? 
                        <input 
                            id="primaryTextInput"
                            type="text"
                            ref={this.inputElement}
                            maxLength={1}
                            onChange={this.handleOnTextInputChange}
                            onFocus={this.onTypeActive}
                            onBlur={this.onTypeInactive}
                        /> : 
                        <div />
                    }
                </div>
            </div>
        )
    }
}

export default UserTextContainer