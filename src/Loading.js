import React, { useState, useEffect, useContext } from 'react'
import { Redirect, navigate } from '@reach/router' 
import firebase from 'firebase'

import UserContext from './UserContext.js'

const Loading = () => {
    const [isLogin, setIsLogin] = useState(false)
    const user = useContext(UserContext)

    useEffect(() => {
        console.log("The User Will Be ", user)
    })

    return (
        <div>
            <div>Wait a minute</div>
            {user ? <Redirect to="/home" noThrow /> : <Redirect to="/login" noThrow />}
        </div>
    )
}

export default Loading
