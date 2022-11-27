import { timeStamp } from 'console'
import React, { ChangeEvent, Component, useState } from 'react'
import { ConnectionManager, GetConnectionManager } from '../../connection/ConnectionManager'
import { AddLetterMessage, CreateAddLetterMessage, NewLetterMessage } from '../../connection/message/types/AddLetter'

type UserTextContainerProps = {
    primaryClient: boolean
    userName: string
}

type UserTextContainerState = {
    text: string
}

type TimedLetter = {
    letter: string
    time: EpochTimeStamp
}

const LetterLifespanMs : number = 5000

class UserTextContainer extends React.Component<UserTextContainerProps, UserTextContainerState> {
    state: UserTextContainerState = {
        text: ''
    }

    // pointer to the global connection manager
    connectionManager : ConnectionManager;

    // list of all the letters, and their arrived time
    letters : TimedLetter[]

    // the current timer that is waiting to erase the last letter. Is reassigned when letter is erased
    letterEraseTimer: number = 0

    constructor(props: UserTextContainerProps){
        super(props);

        this.connectionManager = GetConnectionManager()
        this.letters = []
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
        if(newLetter.length != 1) {
            console.error("Can only add single letters, not longer strings")
            return
        }
        if(this.letters.length !== this.state.text.length) {
            console.warn("Out of Sync! letters array and text state should be the same size")
            return
        }

        //TODO: add mutex so this is thread safe
        this.letters.push({
            letter: newLetter,
            time: Date.now()
        })
        this.setState({ text : this.state.text + newLetter})

        // for when there are no letters currently on screen
        if(this.letterEraseTimer === 0) {
            this.setFirstLetterTimer()
        }
    }

    removeLetterFromStart = () => {
        if(this.letters.length !== this.state.text.length) {
            console.warn("Out of Sync! letters array and text state should be the same size")
            return
        }

        //TODO: add mutex so this is thread safe
        if(this.letters.length > 0 && this.state.text.length > 0) {
            this.letters.shift()
            this.setState({ text: this.state.text.substring(1)})
            this.letterEraseTimer = 0
            this.setFirstLetterTimer()
        }
    }

    setFirstLetterTimer = () => {
        if(this.letterEraseTimer !== 0) {
            console.warn("tried to set a letter time, but one is alreayd active")
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

    render() {
        return (
            <div className="userTextContainer">
                <h1>{this.props.userName}</h1>
                <p>{this.state.text}</p>
                {this.props.primaryClient ? <input type="text" maxLength={1} onChange={this.handleOnTextInputChange}/> : <div />}
            </div>
        )
    }
}

export default UserTextContainer