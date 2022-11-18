// using React from the compiling
import React, { useState, useEffect } from "react";
import { Link, navigate } from "@reach/router";
import styled from "styled-components";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Button, Input, Navbar, Sidebar, Notification } from "../components";
import { Illustrations } from "../assets";
import { useAuth } from "../custom-hooks";
import { createUser } from "../utils/service.ts"
import Modal from "../Modal";

const SubmitButton = styled(Button)`
	border-radius: 4em;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Container = styled.div`
	width: 100%;
	min-height: 100vh;
	display: grid;
	place-items: center;
	align-items: center;
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

const CreateAccount = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [formLoading, setFormLoading] = useState<boolean>(false)
	const [isFormValid, setIsFormValid] = useState<boolean>(true);
	const { user, signin, signWithGoogle, signWithFacebook } = useAuth();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			// prevent page from reloading
			e.preventDefault();

			setIsFormValid(false)
			setFormLoading(true)

			let response = await createUser({ username: "test", email, password })

			console.log("Response :", response)
		} catch (e) {
			// error occured !
			console.error("Error Occured while logining in fn: handleLogin -", e);
			setMessage("Something Went Wrong !");
		}
	};

	// function that handle the each input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			// get the target name
			let name = e.target.name;
			let value = e.target.value;

			// get the form element
			let form = e.target.parentElement.parentElement;

			setIsFormValid(form.checkValidity());

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

	if (user) {
		navigate("/");
	}

	return (
		<>
			<Container>
				<Form onSubmit={handleLogin}>
					<Heading>Beacome the member</Heading>
					<Notification message={message} setMessage={setMessage} error />
					<FormGroup>
						<Input
							type="text"
							name="username"
							placeholder="Username"
							onChange={handleChange}
							required
							data-test="login-input-username"
						/>
					</FormGroup>
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
									color="white"
									css="display: block;"
									radius={2}
									margin={2}
									loading={true}
									height={15}
									width={4}
								/>) : "Create An Account"}
						</SubmitButton>
					</ButtonWrapper>
					<MyLink to="/login">Login</MyLink>
				</Form>
			</Container>
		</>
	);
};

export default CreateAccount;
