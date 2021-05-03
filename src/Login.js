import React, { useState, useEffect, useContext } from "react";
import { Link, navigate } from "@reach/router";
import firebase from 'firebase'

import UserContext from './UserContext.js'

const Login = () => {
    const user = useContext(UserContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmail = (e) => setEmail(e.target.value);

    const handlePassword = (e) => setPassword(e.target.value);

    const handleLogin = (e) => {
        e.preventDefault()

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((r) => {
                console.log("Login :", r);
            }, console.error);
    };

    useEffect(() => {
        // initial checking
        console.log("user", user)
        if(user) {
            navigate('/home')
        } else {
            return
        }
    });

    return (
        <div>
            {user ? <div>Loading</div> : (
            <form onSubmit={handleLogin}>
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
                        Login
                    </button>
                    <Link to="/createAccount">Create An Account</Link>
                </div>
            </form>
            )}
        </div>
    );
};

export default Login
