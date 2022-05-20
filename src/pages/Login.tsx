// using React from the compiling
import React, { useState, useEffect } from "react";
import { Link, navigate } from "@reach/router";
import styled from "styled-components";
import { Button, Input, Navbar, Notification } from "../components";
import { Illustrations } from "../assets";
import { useAuth } from "../custom-hooks"

const SubmitButton = styled(Button)`
	border-radius: 4em;
`;

const Container = styled.div`
	width: 100%;
	min-height: 100vh;
	display: grid;
	place-items: center;
	align-items: end;
	background-color: ${(props) => {
		console.log(props.theme);
		return props.theme.__background;
	}};
	transition: background-color 0.4s linear;

	@media (max-width: 600px) {
		align-items: center;
	}
`;

const Form = styled.form`
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	width: 100%;
`;

const FormGroup = styled.div`
	padding: 0.4em 0em;

	@media (max-width: 600px) {
		width: 80%;
	}
`;

const ButtonWrapper = styled(FormGroup)`
	display: grid;
	place-items: center;
`;

const MyLink = styled(Link)`
	text-decoration: none;
	font-weight: 800;
	padding: 0.5rem 0rem;
	font-family: system-ui;
	color: ${(props) => props.theme.__textColor};
`;

const Heading = styled.h2`
	color: ${(props) => props.theme.__textColor};
`;

const H3 = styled.h3`
	text-align: center;
	color: ${(props) => props.theme.__textColor};
`;

const PageFooter = styled.div`
	padding-top: 3rem;
	padding-bottom: 1rem;
`;

const ThridPartyLogin = styled.div`
	width: 100%;
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	padding: 0.5rem;
	align-items: center;

	& > img {
		width: 50px;
		margin: 0rem 01rem;
		cursor: pointer;
	}
`;

const Login = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { user, signin, signWithGoogle, signWithFacebook } = useAuth()

	const handleLogin = (e: React.SubmitButton) => {
		try {
			// prevent page from reloading
			e.preventDefault();

			if (!email && !password) {
				console.log("Please enter the email and Password : ");
				return null;
			}

			signin(email, password);
		} catch (e) {
			// error occured !
			console.error("Error Occured while logining in fn: handleLogin -", e);
		}
	};

	// function that handle the each input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			// get the target name
			let name = e.target.name
			let value = e.target.value

			if (name === "email") {
				setEmail(value)
				return
			}

			if (name === "password") {
				setPassword(value)
				return
			}

			return
		} catch (e) {
			console.error("Error Occured in the fn:handleChange - ", error)
		}
	}

	if (user) {
		navigate("/")
	}

	return (
		<>
			<Navbar />
			<Container>
				<Form>
					<Heading>Login into Alaric</Heading>
					<FormGroup>
						<Input
							type="email"
							name="email"
							placeholder="Email"
							onChange={handleChange}
							required
						/>
					</FormGroup>
					<FormGroup>
						<Input
							type="password"
							name="password"
							placeholder="Password"
							onChange={handleChange}
							required
						/>
					</FormGroup>
					<ButtonWrapper>
						<SubmitButton type="submit" primary medium>
							Login
						</SubmitButton>
					</ButtonWrapper>
					<MyLink to="/passwordReset">Forgot Password !</MyLink>
					<MyLink to="/createAccount">Create An Account !</MyLink>
					{/*<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
						<circle
							cx="12"
							cy="12"
							r="6"
							mask="url(#moon-mask)"
							fill="currentColor"
						/>
						<g stroke="currentColor">
							<line x1="12" y1="1" x2="12" y2="3" />
							<line x1="12" y1="21" x2="12" y2="23" />
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
							<line x1="1" y1="12" x2="3" y2="12" />
							<line x1="21" y1="12" x2="23" y2="12" />
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
						</g>
						<mask id="moon-mask">
							<rect x="0" y="0" width="100%" height="100%" fill="white" />
							<circle cx="24" cy="10" r="6" fill="black" />
						</mask>
					</svg>*/}
					<PageFooter>
						<H3>Login With</H3>
						<ThridPartyLogin>
							<img
								src={Illustrations.Google}
								alt="google image"
								onClick={() => { signWithGoogle() }}
							/>
							<img
								src={Illustrations.Facebook}
								alt="google image"
								onClick={() => { signWithFacebook() }}
							/>
						</ThridPartyLogin>
					</PageFooter>
				</Form>
			</Container>
		</>
	);
};

export default Login;
