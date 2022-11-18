// using React from the compiling
import React, { useState, useEffect } from "react";
import { Link, navigate } from "@reach/router";
import styled from "styled-components";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Button, Input, Navbar, Sidebar, Notification } from "../components";
import { Illustrations } from "../assets";
import { useAuth } from "../custom-hooks";
import Modal from "../Modal";

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
	const [message, setMessage] = useState<string>("");
	const [formLoading, setFormLoading] = useState<boolean>(false)
	const [isFormValid, setIsFormValid] = useState<boolean>(true);
	const { user, signin, signWithGoogle, signWithFacebook, send_email_verfication } = useAuth();

	/*
	 * Logn Form 
	 * - Prevent Page from defalt reloading
	 * - setting the form validation to false
	 * - show the loading indicator in the form 
	 * - check if the email and password pressent there or not
	 * - if the user logged in check the user is verified or not
	 * - and sending the email verification and at the end hides the
	 * loader 
	 */
	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			// prevent page from reloading
			e.preventDefault();

			setIsFormValid(false)
			setFormLoading(true)

			if (!email && !password) {
				console.log("Please enter the email and Password : ");
				setMessage("Please enter the email and Password : ");
				return null;
			}

			const response = await signin(email, password);

			console.log("Response : ", response)

			if (response) {
				if (response.emailVerified === false) {
					await send_email_verfication(response.email)
					setMessage("Please verify the email, Verification link sent to the email address!")
					setFormLoading(false)
					setIsFormValid(true)
				}
			}

		} catch (e) {
			// error occured !
			console.log("Error Occured while logining in fn: handleLogin -", e);
			setMessage(e.message);
			setFormLoading(false)
			setIsFormValid(true)
		}
	};

	// function that handle the each input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {

			// get the target name
			let name = e.target.name;
			let value = e.target.value;

			// get the form element 
			let form = e.target.parentElement.parentElement

			setIsFormValid(form.checkValidity())

			if (name === "email") {
				setEmail(value);
			}

			if (name === "password") {
				setPassword(value);
			}

		} catch (e) {
			console.error("Error Occured in the fn:handleChange - ", e);
			setMessage("Something Went Wrong !");
		}
	};

	/*
	 * checking if the user logged in or not and check the user
	 * is verified or not
	 */
	if (user) {
		if (user.emailVerified) {
			navigate("/");
		}
	}

	return (
		<>
			{/*<Navbar />*/}
			<Container>
				<Form onSubmit={handleLogin}>
					<Heading>Login into Alaric</Heading>
					<Notification message={message} setMessage={setMessage} error />
					<FormGroup>
						<Input
							type="email"
							name="email"
							placeholder="Email"
							onChange={handleChange}
							required
							data-test="login-input-email"
						/>
					</FormGroup>
					<FormGroup>
						<Input
							type="password"
							name="password"
							placeholder="Password"
							onChange={handleChange}
							autoComplete="off"
							required
							data-test="login-input-password"
						/>
					</FormGroup>
					<ButtonWrapper>
						<SubmitButton
							type="submit"
							data-test="login-submit-button"
							disabled={!isFormValid}
							primary
							medium
						>
							{formLoading ? (
								<ScaleLoader
									data-test="login-loader-button"
									color="white"
									css="display: block;"
									radius={2}
									margin={2}
									loading={true}
									height={15}
									width={4}
								/>) : "Login"}
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
								data-test="login-google"
								onClick={() => {
									signWithGoogle();
								}}
							/>
							<img
								src={Illustrations.Facebook}
								alt="google facebook"
								data-test="login-facebook"
								onClick={() => {
									signWithFacebook();
								}}
							/>
						</ThridPartyLogin>
					</PageFooter>
				</Form>
			</Container>
		</>
	);
};

export default Login;
