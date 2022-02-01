// using React from the compiling
import React, { useState, useEffect }from "react"
import { Link } from "@reach/router"
import styled from "styled-components"
import { 
	Button, 
	Input,
	Navbar
} from "../components"

const SubmitButton = styled(Button)`
	border-radius: 0.6em;
`

const Container = styled.div`
	width: 100%;
	height: 100vh;
	display: grid;
	place-items: center;
	background-color: ${props => {
		console.log(props.theme)
		return props.theme.__background
	}};
`

const Form = styled.form`
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
`

const FormGroup = styled.div`
	padding: 0.4em 0em;
`

const ButtonWrapper = styled(FormGroup)`
	display: grid;
	place-items: center;
`

const MyLink = styled(Link)`
	text-decoration: none;
	font-weight: 500;
	font-family: system-ui;
`

const Heading = styled.h2`
	color: ${props => props.theme.__textColor};
`

const Login = () => {

	return (
		<>
			<Navbar />
			<Container>
				<Form>
					<Heading>Login into Alaric</Heading>
					<hr />
					<FormGroup>
						<Input type="email" placeholder="Email" required />
					</FormGroup>
					<FormGroup>
						<Input type="password" placeholder="Password" required />
					</FormGroup>
					<ButtonWrapper>
						<SubmitButton type="submit" primary medium>Login</SubmitButton>
					</ButtonWrapper>
					<MyLink to="">Forgot Password !</MyLink>
				</Form>
			</Container>
		</>
	)
}

export default Login
