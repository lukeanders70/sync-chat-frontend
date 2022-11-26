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

class UserTextContainer extends React.Component<UserTextContainerProps, UserTextContainerState> {
    state: UserTextContainerState = {
        text: ''
    }

    connectionManager : ConnectionManager;

    constructor(props: UserTextContainerProps){
        super(props);

        this.connectionManager = GetConnectionManager()
    }

    componentDidMount(): void {
        this.connectionManager.messageHandler.NewLetterDelegate.AddHandler(this, this.handleNewLetter)
    }

    componentWillUnmount(): void{
        this.connectionManager.messageHandler.NewLetterDelegate.ClearObjectHandlers(this)
    }

    handleOnChange = (event : ChangeEvent<HTMLInputElement>) => {
        const letter = event.target.value
        this.setState({ text: this.state.text + letter})
        event.target.value = ""

        const AddLetterMessage = CreateAddLetterMessage(letter)
        this.connectionManager.SendMessage(AddLetterMessage)
    }

    handleNewLetter = (message : NewLetterMessage) => {
        if(message.u === this.props.userName) {
            this.setState({ text : this.state.text + message.l})
        }
    }

    render() {
        return (
            <div className="userTextContainer">
                <h1>{this.props.userName}</h1>
                <p>{this.state.text}</p>
                {this.props.primaryClient ? <input type="text" maxLength={1} onChange={this.handleOnChange}/> : <div />}
            </div>
        )
    }
}

export default UserTextContainer