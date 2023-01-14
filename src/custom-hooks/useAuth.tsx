import React, { useState, useEffect, useContext, createContext } from "react";
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
	getRedirectResult,
	sendEmailVerification,
	updatePassword,
	updateProfile,
	updateEmail
} from "firebase/auth";
import { useLocalStorage } from "./useLocalStorage";
import { auth } from "../firebase";

// google provider
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// creating the authContext that let to you pass the user object
// in the applications
const authContext = createContext();

// Provider componenet that wraps your app and makes auth object ...
// ... available to any child componenet that call useAuth()
export const ProviderAuth = ({ children }) => {
	// get user datat from the useProviderAuth()
	const auth = useProviderAuth();
	console.log("The Auth we get : ", auth);
	// pass the auth value along the Provider
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

// Provider hook that create auth object and handles state
// contain all the function of auth and store in the state and
// return the all authentication functions
const useProviderAuth = () => {
	// create a local state to store the object
	const [user, setUser] = useState(null);
	const [, setLocalStorage] = useLocalStorage("token", null);

	// wrap any firebase method we want to use making sure ..
	// ... to save the state
	const signin = async (email: string, password: string) => {
		try {
			let response: unknown = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			if (response) {
				setUser(response.user);
				setLocalStorage({ accessToken: user.accessToken });
				return response.user;
			}
		} catch (e) {
			console.log(
				"Error Occured in the firebase method in the use Provider hook : ",
				e
			);

			if (e.code === "auth/wrong-password") {
				throw { message: "Wrong Password !" };

			}

			if (e.code === "auth/too-many-requests") {
				throw { message: "Too many attempts !" };
			}

			if (e.code === "auth/user-not-found") {
				throw { message: "User is not Registered !" };
			}

			return "Something Went Wrong !";
		}
	};

	const signWithGoogle = async () => {
		try {
			let response = await signInWithRedirect(auth, provider);

			console.log("response : ", response);

			// this gives you a Google Access Token. You can use it to access Google APIs
			//const credential = GoogleAuthProvider.credentialFromResult(response)
			//const token = credential?.accessToken

			// The signed-in user info
			setUser(response?.user);
			setLocalStorage({ accessToken: user.accessToken });
			return response?.user;
		} catch (e) {
			// Catching Error for debuging
			console.error(
				"Error Occured in sign with the google fn:signWithGoogle : ",
				e
			);
			// handle error
			const errorCode = e.code;
			const errorMessage = e.message;
			// the email of the user's account used
			const email = e.email;
			// the AuthCredential type that are used
			const credential = GoogleAuthProvider.credentialFromError(e);
		}
	};

	// sign in with facebook
	const signWithFacebook = async () => {
		try {
			let response = await signInWithPopup(auth, facebookProvider);

			console.log("response : ", response);

			// this gives you a Google Access Token. You can use it to access Google APIs
			//const credential = GoogleAuthProvider.credentialFromResult(response)
			//const token = credential?.accessToken

			// The signed-in user info
			setUser(response?.user);
			setLocalStorage({ accessToken: user.accessToken });
			return response?.user;
		} catch (e) {
			console.log(
				await fetchSignInMethodsForEmail(auth, "jaidev999@gmail.com")
			);

			// Catching Error for debuging
			console.error(
				"Error Occured in sign with the facebook fn: signWithFacebook : ",
				e
			);
			// handle error
			const errorCode = e.code;
			const errorMessage = e.message;
			// the email of the user's account used
			const email = e.email;
			// the AuthCredential type that are used
			const credential = FacebookAuthProvider.credentialFromError(e);
		}
	};

	// for signing out
	const signout = async () => {
		try {
			return await signOut(auth);
		} catch (e) {
			console.log("Error Occured while signing out signout fn : ", e);
			return e?.message;
		}
	};

	// send a user a email verfication
	const send_email_verfication = async () => {
		try {
			// tell the firebase to send the verification mail
			await sendEmailVerification(auth.currentUser, {
				url: "http://localhost:3000/profile",
			});
			console.log("Email send !");
			return { message: "Email Verification link is send !" }
		} catch (e) {
			console.log(
				"Error Occured while sending the email verfication send_email_verfication fn : ",
				e
			);
			return e.message;
		}
	};

	// update the password
	const update_password = async (password: string) => {
		try {
			if (user) {
				await updatePassword(user, password);
				console.log("Password updated successfully !");
			}
		} catch (e) {
			console.log("Error Occured while updating the password : ", e);
			return e.message;
		}
	};

	// send a password reset mail
	const send_password_reset_mail = async (email: string) => {
		try {
			// firebase send the password reset link to email
			await sendPasswordResetEmail(auth, email, {
				url: "http://localhost:3000/login",
			});
			console.log("Email sent for reseting the password !");
			return { message: "Email sent successfully !" };
		} catch (e) {
			// ERROR HANDLING
			console.log(
				"Error Occured while sending the password reset mail send_password_reset_mail fn : ",
				e
			);
			console.log(e.message);

			if (e.code === "auth/user-not-found") {
				return { message: "No User Found with this email address !" };
			}
			return { message: e.message };
		}
	};

	// updating the user profile
	const update_profile = async (displayName: string, photoURL: string) => {
		try {
			await updateProfile(user, {
				displayName,
				photoURL
			})
		} catch (e) {
			console.log("Error Occured while update the profile uodate_profile fn : ", e)

			return {
				message: e.message
			}
		}
	}

	// updating the user email
	const update_email = async (email: string) => {
		try {
			if (email) {
				await updateEmail(user, email)
				return {
					message: "User's Email updated successfully !"
				}
			}
			return { message: "Email is not entered !" }
		} catch (e) {
			console.log("Error Occured while update the profile uodate_profile fn : ", e)
			return {
				message: e.message
			}


		}
	}

	useEffect(() => {
		// set user by checking the user state changed or not
		// that check the user info in the indexedDB
		onAuthStateChanged(auth, (user) => {
			console.log("On Auth StateChnaged: ", user);
			if (user) {
				setUser(user);
				setLocalStorage({ accessToken: user.accessToken });
				return;
			}
			setUser(user);
			return;
		});
	}, []);

	return {
		user,
		signin,
		signWithGoogle,
		signWithFacebook,
		signout,
		send_email_verfication,
		send_password_reset_mail,
		update_profile,
		update_email
	};
};

// Hook for the child component to get the auth object
// ... re-render when it changes
export const useAuth = () => useContext(authContext);
