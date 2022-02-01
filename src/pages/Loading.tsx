import React, { useState, useEffect, useContext } from 'react'
import { Redirect, navigate } from '@reach/router'
import firebase from 'firebase/compat/app'

import UserContext from '../UserContext.js'
import { useAuth } from '../custom-hooks/'

const Loading = () => {
    const [isLogin, setIsLogin] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        console.log("The User Will Be ", user)
    })

    // check if the user is null send the user to login page

    // if the user  is login send the user to home page

    return (
        <div>
            <div>Wait a minute</div>
            {user ? <Redirect to="/home" noThrow /> : <Redirect to="/login" noThrow />}
        </div>
    )
}

export default Loading
