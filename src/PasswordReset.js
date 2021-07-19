import React, { useState } from "react"
import firebase from "firebase/app"
import styled from "styled-components"

const Button = styled.button`
    width: 100%;
    display: block;
    padding: 1em;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 10px;

    &:disabled {
        background: grey;
        color: #fff;
    }
`

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2em 2em 2em 1em;
`

const Form = styled.form``

function PasswordReset() {
    const [email, setEmail] = useState("")
    const [showBtn, setShowBtn] = useState(true)

    const handleEmail = (e) => {
        setEmail(e.target.value)
        let pass = document.getElementById("resetForm").checkValidity()
        setShowBtn(!pass)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const Auth = await firebase.auth()
            const result = await Auth.sendPasswordResetEmail(email)
            console.log("Email Send Successfully !")
        } catch (e) {
            console.log("Error Occured while sending the email !", e)
        }
    }

    return (
        <Container>
            <Form id="resetForm" onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmail}
                    required
                />
                <Button
                    type="submit"
                    disabled={showBtn}
                >Reset Password</Button>
            </Form>
        </Container>
    )
}

export default PasswordReset
