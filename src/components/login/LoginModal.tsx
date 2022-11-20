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
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" onChange={handleTypedNameChanged}></input>
                <button type="button" onClick={() => {props.onSetName(typedName)}}>Submit</button> 
            </div>
        </div>
    )
}

export default LoginModalContainer