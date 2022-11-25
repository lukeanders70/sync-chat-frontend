import React, { Component, useState } from 'react'

type UserTextContainerProps = {
    userName: string
}

type UserTextContainerState = {
    text: string
}

class UserTextContainer extends React.Component<UserTextContainerProps, UserTextContainerState> {
    state: UserTextContainerState = {
        text: ''
    }

    public AddLetter = () => {
        
    }

    render() {
        return (
            <div className="userTextContainer">
                <h1>{this.props.userName}</h1>
                <p>{this.state.text}</p>
            </div>
        )
    }
}

export default UserTextContainer