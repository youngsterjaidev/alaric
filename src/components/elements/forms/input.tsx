import styled from "styled-components"
import { primaryFont } from "../../../utils"

export const Input = styled.input`
	background: ${props => props.theme.__line};
	border-radius: 0.6em;
	padding: 1em;
	min-width: 20em;
	border: none;
	font-family: ${primaryFont};
	font-weight: 600;
	outline: none;
	transition: color 0.2s linear outline 0.2s linear;

	&::placeholder {
		color: ${props => props.theme.__placeholder};
		font-weight: 500;
	}

	&:disabled {
		cursor: not-allowed;
	}

	&:focus {
		color: ${props => props.theme.__placeholder};
		outline: 4px solid ${props => props.theme.__outlineColor};
	}

	@media (max-width: 550px) {
		min-width: auto;
	}
`
