// using React from the compiling
import React, { useState, useEffect }from "react"
import styled from "styled-components"
import { Button, Input } from "../components"
import { Link } from "@reach/router"

const Nav = styled.nav`
	padding: 0.5em 1em;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	background-color: ${props => props.theme.__background};
	justify-content: space-between;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
`

const Form = styled.form`
	width: auto;
	display: flex;
	flex-flow: row nowrap;
`

const MyLink = styled(Link)`
	text-decoration: none;
	margin-right: 1em;
	font-weight: 600;
	color: ${props => props.theme.__textColor};
`

const MyButton = styled(Button)`
	margin-left: 0.5em;
	border-radius: 0.6em;
`

export const Navbar = () => {
	return (
		<Nav>
			<div>
				<MyLink to="">Home</MyLink>
				<MyLink to="">Live</MyLink>
				<MyLink to="">Help</MyLink>
			</div>
			<div>
			<Form>
				<Input list="browsers" type="search" placeholder="search" />
					<datalist id="browsers">
						<option value="Edge" />
						<option value="Firefox" />
						<option value="Chrome" />
						<option value="Opera" />
						<option value="Safari" />
					</datalist>
				<MyButton type="submit" primary small>Search</MyButton>
			</Form>
			</div>
		</Nav>
	)
}


