import React, { Component, useState } from 'react'

interface LoginModalProps {
}

function LoginModalContainer(props: LoginModalProps) {
    return (
        <div id="background">
            <div id="loginModalContainer">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name"></input>
                <button type="button">Submit</button> 
            </div>
        </div>
    )
}

export default LoginModalContainer