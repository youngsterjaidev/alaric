import React, { useState, useEffect, useContext, createContext } from "react"
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	confirmPasswordReset,
	fetchSignInMethodsForEmail,
	signInWithRedirect,	
	signInWithPopup,
	onAuthStateChanged,
	GoogleAuthProvider,
	FacebookAuthProvider,
	getRedirectResult
} from "firebase/auth"
import { useLocalStorage} from "./useLocalStorage.tsx"
import { auth } from "../firebase"

// google provider
const provider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

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
	const [localStorage, setLocalStorage] = useLocalStorage("token", null)

	// wrap any firebase method we want to use making sure ..
	// ... to save the state
	const signin = async (email: string, password: string) => {
		try {
			let response = await signInWithEmailAndPassword(auth, email, password)
			if (response) {
				setUser(response.user)
				setLocalStorage({ accessToken: user.accessToken})
				return response.user
			}
		} catch (e) {
			console.log("Error Occured in the firebase method in the use Provider hook : ", e)
		}
	}

	const signWithGoogle = async () => {
		try {
			let response = await signInWithRedirect(auth, provider)

			console.log("response : ", response )

			// this gives you a Google Access Token. You can use it to access Google APIs
			//const credential = GoogleAuthProvider.credentialFromResult(response)
			//const token = credential?.accessToken

			// The signed-in user info
			setUser(response?.user)
				setLocalStorage({ accessToken: user.accessToken})
			return response?.user
		} catch(e) {

			// Catching Error for debuging
			console.error("Error Occured in sign with the google fn:signWithGoogle : ", e)
			// handle error
			const errorCode = e.code
			const errorMessage = e.message
			// the email of the user's account used
			const email = e.email
			// the AuthCredential type that are used
			const credential = GoogleAuthProvider.credentialFromError(e)
		}
	}

	// sign in with facebook
	const signWithFacebook = async () => {
		try {
			let response = await signInWithPopup(auth, facebookProvider)

			console.log("response : ", response )

			// this gives you a Google Access Token. You can use it to access Google APIs
			//const credential = GoogleAuthProvider.credentialFromResult(response)
			//const token = credential?.accessToken

			// The signed-in user info
			setUser(response?.user)
			setLocalStorage({ accessToken: user.accessToken})
			return response?.user
		} catch(e) {

			console.log(await fetchSignInMethodsForEmail(auth, "jaidev999@gmail.com"))

			// Catching Error for debuging
			console.error("Error Occured in sign with the facebook fn: signWithFacebook : ", e)
			// handle error
			const errorCode = e.code
			const errorMessage = e.message
			// the email of the user's account used
			const email = e.email
			// the AuthCredential type that are used
			const credential = FacebookAuthProvider.credentialFromError(e)
		}
	}

	const singup = () => {}

	useEffect(() => {
		// set user by checking the user state changed or not
		// that check the user info in the indexedDB
		onAuthStateChanged(auth, user => {
			console.log("On Auth StateChnaged: ", user)
			if (user) {
				setUser(user)
				setLocalStorage({ accessToken: user.accessToken})
				return
			}
			setUser(user)
			return 
		})
	}, [])

	return {
		user,
		signin,
		signWithGoogle,
		signWithFacebook
	}
}

// Hook for the child component to get the auth object
// ... re-render when it changes
export const useAuth = () => useContext(authContext)
