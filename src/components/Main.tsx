import React, { Component, useState } from 'react'

type MainProps = {
    name: string
}
type MainState = {
}

class Main extends React.Component<MainProps, MainState> {
    state = {
        name: ""
    }

    render(){
        return (
            <div id="mainContainer">
                <h1>{this.props.name}</h1>
            </div>
        )
    }
}

export default Main