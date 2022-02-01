import React, { useState, useEffect, useContext, createContext } from "react"
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	confirmPasswordReset,
	onAuthStateChanged
} from "firebase/auth"
import { auth } from "../firebase"

// creating the authContext that let to you pass the user object
// in the applications
const authContext = createContext()

// Provider componenet that wraps your app and makes auth object ...
// ... available to any child componenet that call useAuth()
export const ProviderAuth = ({ children }) => {
	// get user datat from the useProviderAuth()
	const auth = useProviderAuth()
	console.log("The Auth we get : ", auth)
	// pass the auth value along the Provider
	return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

// Provider hook that create auth object and handles state
// contain all the function of auth and store in the state and 
// return the all authentication functions
const useProviderAuth = () => {
	// create a local state to store the object
	const [user, setUser] = useState(null)

	// wrap any firebase method we want to use making sure ..
	// ... to save the state
	const signin = async (email: string, password: string) => {
		try {
			let response = await signInWithEmailAndPassword(auth, email, password)
			if (response) {
				setUser(response.user)
				return response.user
			}
		} catch (e) {
			console.log("Error Occured win the firebase method in the use Provider hook : ", e)
		}
	}

	useEffect(() => {
		// set user by checking the user state changed or not
		// that check the user info in the indexedDB
		onAuthStateChanged(auth, user => {
			if (user) {
				console.log(user)
				setUser(user)
			}
		})
	}, [])

	return {
		user,
		signin
	}
}

// Hook for the child component to get the auth object
// ... re-render when it changes
export const useAuth = () => useContext(authContext)
