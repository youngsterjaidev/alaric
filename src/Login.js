import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import firebase from 'firebase'

const Login = () => {
    const [isLogin, setIsLogin] = useState(false);
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
    });

    return (
        <div>
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
        </div>
    );
};

export default Login
