import React, { ChangeEvent, Component, ReactElement, useState } from 'react'

type UserNameContainerProps = {
    primaryClient: boolean
    userName: string
}

type UserNameContainerState = {
}

const LetterLifespanMs : number = 5000

class UserNameContainer extends React.Component<UserNameContainerProps, UserNameContainerState> {
    state: UserNameContainerState = {}

    constructor(props: UserNameContainerProps){
        super(props);
    }

    getUserNameInnerClasses = () : string => {
        var userNameContainerClasses: string = "userNameInnerContainer "
        userNameContainerClasses += this.props.primaryClient ? "primary" : "secondary"
        return userNameContainerClasses
    }

    render() {

        return (
            <div className='userName'>
                <div className={this.getUserNameInnerClasses()}>
                    {this.props.userName}
                </div>
            </div>
        )
    }
}

export default UserNameContainer