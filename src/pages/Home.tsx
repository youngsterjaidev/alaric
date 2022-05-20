// using React from the compiling
import React, { useState, useEffect } from "react";
import { Navbar } from "../components";
import styled from "styled-components";
import { Select, Input, Dropdown, Button } from "../components";
import { GoLocation, GoCalendar } from "react-icons/go";
import { IoTimeOutline } from "react-icons/io5"
import { useFindStops } from "../custom-hooks";
import {Illustrations} from "../assets/index";

const Container = styled.div`
	width: 100%;
	background: ${(props) => props.theme.__background};
	margin-top: 2em;
	height: 100vh;
	display: grid;
	place-items: center;
	padding: 2em 1em;
	transition: background-color 0.4s linear;
`;

const SearchBusesContainer = styled.div`
	width: 100%;
	border-radius: 0.5em;
	padding: 1rem;
	background: ${(props) => props.theme.__container};
`;

const Form = styled.form`
	display: grid;
	grid-template-columns: 1.5fr 1.5fr 1fr;

	& > div {
		padding: 1em;
	}

	& > div:nth-of-type(3) {
		grid-row-start: 1;
		grid-row-end: 3;
		grid-column-start: 3;
		display: grid;
		place-items: center;
	}
`;

const Icon = styled.div`
	padding: 0em 0.5em;

	& > svg {
		color: ${(props) => props.theme.__textColor};
	}
`;

const Row = styled.div`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
`;

const Heading = styled.h1`
	text-align: center;
	font-weight: 800;
	color: ${(props) => props.theme.__textColor};
`;

const Marquee = styled.marquee`
	font-size: 298px;
	font-weight: bold;
	-webkit-text-stroke: 2px linear-gradient(to right, ${props => props.theme.__primary}, ${props => props.theme.__textColor});
	color: ${props => props.theme.__background};
	letter-spacing: -24px;
	text-transform: lowerspace;
`

const Home = (props) => {
	const [, setStop, feedback] = useFindStops();

	console.log(props);

	return (
		<>
			<Navbar />
			<Container>
				<SearchBusesContainer>
					<Heading>Search the buses</Heading>
					<Form>
						<div>
							<Row>
								<Icon>
									<GoLocation size={28} />
								</Icon>
								<Dropdown
									setData={setStop}
									feedback={feedback}
									placeholder="From"
								/>
							</Row>
						</div>
						<div>
							<Row>
								<Icon>
									<IoTimeOutline size={28} />
								</Icon>
								<Dropdown
									setData={setStop}
									feedback={feedback}
									placeholder="To"
								/>
							</Row>
						</div>
						<div>
							<Row>
								<Icon>
									<GoCalendar size={28} />
								</Icon>
								<Button type="submit" primary medium>
									Search
								</Button>
							</Row>
						</div>
						<div>
							<Row>
								<Select defaultValue="government">
									<option value="private">Mera</option>
									<option value="government">Government</option>
								</Select>
							</Row>
						</div>
						<div>
							<Row>
								<Input type="text" placeholder="Bus Name (optional)" />
							</Row>
						</div>
					</Form>
				</SearchBusesContainer>
			</Container>
			<Container style={{ marginTop: 0 }}>
				<Marquee direction="right" style={{ fontSize: "180px" ,color:"white" }}>
					<img src={Illustrations.Alaric} alt="" style={{width:"500px"}} /> </Marquee>
				<Marquee truespeed="120" style={{color:"white"}} ><img src={Illustrations.Alaric} alt="" style={{width:"600px"}} /></Marquee>
				<Marquee direction="right" scrollamount="10" style={{ fontSize: "180px",color:"white" }}><img src={Illustrations.Alaric} alt="" style={{width:"500px"}} /></Marquee>
			</Container>
		</>
	);
};

export default Home;
