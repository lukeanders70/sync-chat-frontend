import React, { Component, useState } from 'react'

interface UserTextContainerProps {
    userName: string
}

function UserTextContainer(props: UserTextContainerProps) {
    return (
        <div className="userTextContainer">
            <h1>{props.userName}</h1>
        </div>
    )
}

export default UserTextContainer