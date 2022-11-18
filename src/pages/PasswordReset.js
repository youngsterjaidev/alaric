import React, { useState } from "react";
import { Link, navigate } from "@reach/router";
import styled from "styled-components";
import { Button, Input, Notification } from "../components";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useAuth } from "../custom-hooks";

const Container = styled.div`
	display: grid;
	place-items: center;
	min-height: 100vh;
	padding: 2em 2em 2em 1em;
	background: ${(props) => props.theme.__background};
	color: ${(props) => props.theme.__textColor};
`;

const Form = styled.form`
	text-align: center;

	& > :not(div:nth-of-type(1)) {
		display: flex;
		justify-content: center;
		padding: 0.4rem;
	}
`;

const SubmitButton = styled(Button)`
	border-radius: 4em;
`;

const MyLink = styled(Link)`
	text-decoration: none;
	font-weight: 800;
	padding: 0.5rem 0rem;
	font-family: system-ui;
	color: ${(props) => props.theme.__textColor};
`;

function PasswordReset() {
	const [email, setEmail] = useState("");
	const [showBtn, setShowBtn] = useState(true);
	const [formLoading, setFormLoading] = useState(false)
	const [message, setMessage] = useState("");
	const { send_password_reset_mail } = useAuth();

	const handleEmail = (e) => {
		setEmail(e.target.value);
		let pass = document.getElementById("resetForm").checkValidity();
		setShowBtn(!pass);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setFormLoading(true)
			const res = await send_password_reset_mail(email);
			console.log("Email Send Successfully !");
			setMessage(res.message)
			setFormLoading(false)
		} catch (e) {
			console.log("Error Occured while sending the email !", e);
		}
	};

	return (
		<Container>
			<Form id="resetForm" onSubmit={handleSubmit}>
				<h2>Password Reset</h2>
					<Notification message={message} setMessage={setMessage} error />
				<div>
					<Input
						type="email"
						id="email"
						value={email}
						placeholder="Enter your email address"
						onChange={handleEmail}
						data-test="password-test-input-email"
						required
					/>
				</div>
				<div>
				<SubmitButton
							type="submit"
							data-test="password-reset-submit-button"
							disabled={showBtn}
							primary
							medium
						>
							{formLoading ? (
							<ScaleLoader
								data-test="password-reset-loader-button"
								color="white"
								css="display: block;"
								radius={2}
								margin={2}
								loading={true}
								height={15}
								width={4}
							/> ) : "Send Reset Link"}
						</SubmitButton>
				</div>
				<div>
					
					<MyLink to="/login">Login</MyLink>
				</div>
			</Form>
		</Container>
	);
}

export default PasswordReset;
