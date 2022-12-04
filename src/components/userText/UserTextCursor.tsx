import React from 'react'

type UserTextCursorProps = {
    primaryClient: boolean
    active: boolean
}

type UserTextCursorState = {
    visible: boolean
}

const BlinkTimeMs : number = 500

class UserTextCursor extends React.Component<UserTextCursorProps, UserTextCursorState> {
    state: UserTextCursorState = {
        visible: true
    }

    // the current timer that is waiting to change the visibility status of the cursor (make it blink)
    blinkTimer: number = 0

    constructor(props: UserTextCursorProps){
        super(props);
        this.conditionallySetCursorTimer()
    }

    componentDidUpdate(oldProps : UserTextCursorProps) {
        this.conditionallySetCursorTimer();
    }

    shouldCursorBlink = (): boolean => {
        return this.props.active && this.props.primaryClient
    }

    isCursorBlinking = (): boolean => {
        return this.blinkTimer != 0
    }

    toggleVisibility = (): void => {
        this.setState({ visible: !this.state.visible })
    }

    conditionallySetCursorTimer = (): void => {
        console.log("conditionallySetCursorTimer")
        if(this.shouldCursorBlink()) {
            console.log("should blink")
            if(!this.isCursorBlinking()) {
                console.log("is not blinking")
                this.setState({ visible: true })
                this.blinkTimer = window.setInterval(this.toggleVisibility, BlinkTimeMs)
            }
            console.log("is bliking")
        } else {
            console.log("should not blink")
            window.clearInterval(this.blinkTimer)
            this.blinkTimer = 0;
            if(!this.state.visible) {
                console.log("is not visible")
                this.setState({ visible: true })
            } else {
                console.log("is visibl")
            }
        }
    }

    getUserTextCursorClasses = () : string => {
        var userTextContainerClasses: string = "userTextInnerDivider"
        userTextContainerClasses += this.props.primaryClient ? " primary" : " secondary"
        userTextContainerClasses += this.state.visible ? " inactive" : " active"
        return userTextContainerClasses
    }

    render() {
        return (
            <div className={this.getUserTextCursorClasses()}></div>
        )
    }
}

export default UserTextCursor