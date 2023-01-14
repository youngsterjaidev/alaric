import styled from "styled-components";
import { primaryFont, typeScale } from "../../../utils/";

interface Props {
  primary?: boolean;
  secondary?: boolean;
  subtle?: boolean;
  text?: boolean;
  large?: boolean;
  medium?: boolean;
  small?: boolean;
}

export const Button = styled.button<Props>`
  font-family: ${primaryFont};
  font-size: ${typeScale.paragraph};
  font-weight: 600;
  line-height: 28px;
  padding: 0.1em 2rem;
  border: none;
  cursor: pointer;
  border-radius: 4em;
  display: block;
  background-color: transparent;
  transition: background-color 0.2s linear border 0.2s linear;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
		filter: grayscale(0.5);
	}

  ${(props) =>
    props.large &&
    `
		padding: 1.6em 2.4em;	
		min-width: 12.5em;
	`}

  ${(props) =>
    props.medium &&
    `
		padding: 0.4em 1.2em;	
		min-width: 10em;
	`}

	${(props) =>
    props.small &&
    `
		padding: 0.3em 1.0em;	
		min-width: 7.5em;
	`}

	${(props) =>
    props.primary &&
    `
		border: 2px solid ${props.theme.__primary};
		background-color: ${props.theme.__primary};
		color: ${props.theme.__buttonColor};

		&:hover {
			background-color: ${props.theme.__primaryHoverColor};
		}

		&:focus {
			outline: 4px solid ${props.theme.__outlineColor};
		}
	`}

	${(props) =>
    props.secondary &&
    `
		border: 2px solid ${props.theme.__primary};
		background: ${props.theme.__background};
		color: ${props.theme.__primary};

		&:hover {
			border: 2px solid ${props.theme.__primaryHoverColor};
			color: ${props.theme.__buttonColor};
		}

		&:focus {
			outline: 4px solid ${props.theme.__outlineColor};
		}
	`}

	${(props) =>
    props.subtle &&
    `
		border: 2px solid ${props.theme.__line};
		color: ${props.theme.__primary};

		&:hover {
			color: ${props.theme.__primaryHoverColor};
		}

		&:focus {
			outline: 4px solid ${props.theme.__outlineColor};
		}
	`}

	${(props) =>
    props.text &&
    `
		color: ${props.theme.__primary};

		&:hover {
			color: ${props.theme.__primaryHoverColor};
		}

		&:focus {
			background: ${props.theme.__line};
		}
	`}
`;
