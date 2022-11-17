import React, { Component, useState } from 'react'
import LoginModalContainer from './login/LoginModal'
import Main from './Main'
import Stylesheet from './Stylesheet'

interface AppProps {
}

function App(props: AppProps) {

    return (
        <div id="appContainer">
            <Stylesheet />
            <Main />
            <LoginModalContainer />
        </div>
    )
}

export default App