import React, { useState, useEffect, useContext } from "react";
import { Link, navigate, Redirect } from "@reach/router";
import firebase from 'firebase'

import UserContext from './UserContext.js'

const CreateAccount = () => {
    const user = useContext(UserContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmail = (e) => setEmail(e.target.value);

    const handlePassword = (e) => setPassword(e.target.value);

    const handleSignUp = (e) => {
        e.preventDefault()

        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((r) => {
                console.log("Login :", r);
            }, console.error);
    };

    useEffect(() => {
        // initial checking
        /*console.log("user", user)
        if(user) {
            navigate('/home')
        } else {
            return
        }*/
    });

    return (
        <div>
            {user ? <Redirect to="/" noThrow /> : (
            <form onSubmit={handleSignUp}>
                <div>
                    <label htmlFor="email"></label>
                    <input
                        type="email"
                        value={email}
                        placeholder="Email"
                        id="email"
                        onChange={handleEmail}
                    />
                </div>
                <div>
                    <label htmlFor="password"></label>
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        id="password"
                        onChange={handlePassword}
                    />
                </div>
                <div>
                    <button type="submit">
                        Create An Account
                    </button>
                    <Link to="/login">Sign Up</Link>
                </div>
            </form>
            )}
        </div>
    );
};

export default CreateAccount
