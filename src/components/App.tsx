import React, { Component, ReactElement, useState } from 'react'
import LoginModalContainer from './login/LoginModal'
import Main from './Main'
import Stylesheet from './Stylesheet'

type AppProps = {

}

type AppState = {
    name: string, // name of the user
}

class App extends React.Component<AppProps, AppState> {
    state: AppState = {
        name: ""
    }

    handleSetName = (newName: string): void => {
        this.setState( {name: newName} )
    }

    render() {
        return (
            <div id="appContainer">
                <Stylesheet />
                { this.state.name != "" ? <Main name={this.state.name}/> : <LoginModalContainer onSetName={this.handleSetName}/> }
            </div>
        )
    }
}

export default App