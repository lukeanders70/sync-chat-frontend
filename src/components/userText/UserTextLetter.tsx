import React from 'react'

type UserTextLetterSpanProps = {
    letter: string
    isFading: boolean
    removeLetter: () => void // function to remove this letter from the list (after fading out)
}

type UserTextLetterSpanState = {
}

class UserTextLetterContainer extends React.Component<UserTextLetterSpanProps, UserTextLetterSpanState> {
    isFading: boolean = false

    fadeOut = () => {
        console.log("fadeOut: " + this.props.letter)
        if(!this.isFading) {
            console.log("not yet fading: " + this.props.letter)
            this.isFading = true;
            setTimeout(() => this.props.removeLetter(), 300)
        }
    };

    getUserTextLetterClasses = () : string => {
        var userTextLetterSpanClasses: string = "userTextLetterSpan "
        userTextLetterSpanClasses += this.props.isFading ? "fade-out" : ""
        return userTextLetterSpanClasses
    }

    componentDidUpdate(prevProps: Readonly<UserTextLetterSpanProps>, prevState: Readonly<UserTextLetterSpanState>, snapshot?: any): void {
        console.log("DidUpdate: " + this.props.letter)
        if(this.props.isFading) {
            console.log("isfading: " + this.props.letter)
            this.fadeOut()
        }
    }
    
    componentDidMount(): void {
        console.log("DidMount: " + this.props.letter)
        if(this.props.isFading) {
            console.log("isfading: " + this.props.letter)
            this.fadeOut()
        }
    }

    render() {

        return (
            <span className={this.getUserTextLetterClasses()}>
                {this.props.letter}
            </span>
        )
    }
}

export default UserTextLetterContainer