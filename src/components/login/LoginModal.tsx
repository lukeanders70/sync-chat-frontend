import React, { ChangeEvent, Component, useState } from 'react'

type LoginModalProps = {
    onSetName: (newName: string) => void
}

function LoginModalContainer(props: LoginModalProps) {
    const [typedName, setTypedName] = useState("")

    const handleTypedNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setTypedName(event.target.value)
    }
    return (
        <div id="background">
            <div id="loginModalContainer">
                <div id="loginModalContainerInner">
                    <h1 id="wordmark">Sync Chat</h1>
                    <input type="text" id="usernameInputField" name="name" placeholder="Name" onChange={handleTypedNameChanged}></input>
                    <br/>
                    <button type="button" id="loginButton" onClick={() => {props.onSetName(typedName)}}>Submit</button> 
                </div>
            </div>
        </div>
    )
}

export default LoginModalContainer