import React from 'react'

type UserTextLetterSpanProps = {
    letter: string
    isFading: boolean
}

type UserTextLetterSpanState = {
}

export const FadeTime: number = 300;

class UserTextLetterContainer extends React.Component<UserTextLetterSpanProps, UserTextLetterSpanState> {
    isFading: boolean = false

    fadeOut = () => {
        if(!this.isFading) {
            this.isFading = true;
        }
    };

    getUserTextLetterClasses = () : string => {
        var userTextLetterSpanClasses: string = "userTextLetterSpan "
        userTextLetterSpanClasses += this.props.isFading ? "fade-out" : ""
        return userTextLetterSpanClasses
    }

    componentDidUpdate(prevProps: Readonly<UserTextLetterSpanProps>, prevState: Readonly<UserTextLetterSpanState>, snapshot?: any): void {
        if(this.props.isFading) {
            this.fadeOut()
        }
    }
    
    componentDidMount(): void {
        if(this.props.isFading) {
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