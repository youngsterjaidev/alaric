import React, { createContext } from 'react'

const UserContext = createContext([
    {
        uid: "anything"
    }
], () => {})

export default UserContext
