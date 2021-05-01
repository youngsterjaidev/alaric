import React, { useState, useEffect } from 'react'
import { Redirect, navigate } from '@reach/router' 
import firebase from 'firebase'

const Loading = () => {
    const [isLogin, setIsLogin] = useState(undefined)

    useEffect(() => {
        // check already user is login
        let user = firebase.auth().currentUser
        if(!user) {
            console.log("User", user)
            navigate('/home')
        } else {
            console.log("User is not Login")
            navigate('/login')
        }
    }, [])

    return (
        <div>
            <div>Wait a minute</div>
            {isLogin ? (
                <Redirect to="/home"  />
            ) : (
                <Redirect to="/login" noThrow />
            )}
        </div>
    )
}

export default Loading
