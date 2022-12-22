import { v4 as uuid } from 'uuid';
import React, { ChangeEvent, ReactElement } from 'react'
import { ConnectionManager, GetConnectionManager } from '../../connection/ConnectionManager'
import { CreateAddLetterMessage, NewLetterMessage } from '../../connection/message/types/AddLetter'
import UserNameContainer from './UserNameContainer'
import UserTextCursor from './UserTextCursor'
import UserTextLetterContainer, { FadeTime } from './UserTextLetter'

type UserTextContainerProps = {
    primaryClient: boolean
    userName: string
}

type UserTextContainerState = {
    letters : TimedLetter[],
    active: boolean
}

type TimedLetter = {
    letter: string
    startTime: EpochTimeStamp
    faded: boolean
    k: string // key
}

const LetterLifespanMs : number = 5000

class UserTextContainer extends React.Component<UserTextContainerProps, UserTextContainerState> {
    state: UserTextContainerState = {
        letters : [],
        active: false
    }

    // pointer to the global connection manager
    connectionManager : ConnectionManager;

    // list of all the letters, and their arrived time

    // the current timer that is waiting to erase the last letter. Is reassigned when letter is erased
    letterUpdateTimer: number = 0

    inputElement: React.RefObject<HTMLInputElement>;

    constructor(props: UserTextContainerProps){
        super(props);

        this.connectionManager = GetConnectionManager()

        this.inputElement = React.createRef();
    }

    componentDidMount(): void {
        this.connectionManager.messageHandler.NewLetterDelegate.AddHandler(this, this.handleNewLetter)
        this.letterUpdateTimer = window.setInterval(() => this.updateLetterTimes(200), 200);
        
    }

    componentWillUnmount(): void{
        this.connectionManager.messageHandler.NewLetterDelegate.ClearObjectHandlers(this)
        clearInterval(this.letterUpdateTimer)
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

        const newLetters = [...this.state.letters];
        newLetters.push({
            letter: newLetter,
            startTime: Date.now(),
            faded: false,
            k: uuid()
        })
        this.setState({ letters : newLetters})
    }

    updateLetterTimes = (elapsedTime: number) => {
        var newLetters: TimedLetter[] = []
        this.state.letters.forEach(element => {
            const buffer = 100
            const shouldAdd = (LetterLifespanMs + FadeTime + buffer) - (Date.now() - element.startTime) >= 0
            if(shouldAdd) {
                newLetters.push({
                    letter: element.letter,
                    startTime: element.startTime,
                    k: element.k,
                    faded: (Date.now() - element.startTime) > LetterLifespanMs
                })
            }
        });
        this.setState({letters: newLetters})
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

    getInnerText = () : ReactElement => {
        return this.state.letters.length > 0 ? <p className="userText">
            {this.state.letters.map((element, i) => <UserTextLetterContainer 
                letter={element.letter}
                isFading={element.faded}
                key={element.k}
            />)}
        </p> : <p> </p>
    }

    render() {

        return (
            <div className={this.getUserTextClasses()} onClick={this.setTypeActive}>
                <div className="userTextInnerContainer">
                    < UserNameContainer userName={this.props.userName} primaryClient={this.props.primaryClient}/>
                    {this.getInnerText()}
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