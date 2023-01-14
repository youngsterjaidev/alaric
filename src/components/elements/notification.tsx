import { useState, useEffect } from "react"
import styled from "styled-components";
import {IoCloseSharp} from "react-icons/io5"

interface MessageProps {
	error: boolean | undefined,
	success: boolean | undefined,
}


interface ContainerProps {
	error: boolean | undefined,
	success: boolean | undefined,
	feedback: string
}

const Container = styled.div<ContainerProps>`
	display: flex;
	flex-flow: row nowrap;
	grid-gap: 1rem;
	padding: ${props => props.feedback ? "0.2rem 0.5rem" : "0rem"};
	box-sizing: border-box;
	border: ${props => {
		if(!props.feedback) return "none"

		if(props.error) return `1px solid ${props.theme.__error}`

		if(props.success) return `1px solid ${props.theme.__success}`

		return "none"
	}};
	background: ${props => {

		if(props.error) return props.theme.__error

		if(props.success) return props.theme.__success

		return "none"
	}};
	border-radius: 4px;
`

const Message = styled.div<MessageProps>`
	color: ${props => {
		return props.theme.__buttonColor
	}};
`

const Icon = styled.div`
	display: grid;
	place-items: center;

	& > path {
    color: ${(props) => props.theme.__textColor};
		stroke: white;
	}
`

export const Notification = ({ message, setMessage, error, success }) => {
	const [feedback, setFeedback] = useState("")

	useEffect(() => {
		setFeedback(message)
	}, [message])

  return (
    <Container error={error} success={success} feedback={message}>
			<Message error={error} success={success}>{message}</Message>
			{message ? (
				<Icon onClick={() => setMessage("")}>
					<IoCloseSharp color="#fff" />
				</Icon>
			) : null}
    </Container>
  );
};
