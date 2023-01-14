import styled from "styled-components";
import { primaryFont } from "../../../utils";

export const Select = styled.select`
  background: ${(props) => props.theme.__line};
  border-radius: 4em;
  padding: 1em 2.4em;
  min-width: 20em;
  border: none;
  font-family: ${primaryFont};
  font-weight: 600;
  outline: none;
  color: ${(props) => props.theme.__success};
  transition: color 0.2s linear outline 0.2s linear;

  &::placeholder {
    color: ${(props) => props.theme.__placeholder};
    font-weight: 600;
    font-size: 12px;
  }

  &:disabled {
    cursor: not-allowed;
  }

  &:focus {
    color: ${(props) => props.theme.__placeholder};
    outline: 4px solid ${(props) => props.theme.__outlineColor};
  }

  @media (max-width: 550px) {
    min-width: auto;
    width: 100%;
  }
`;
