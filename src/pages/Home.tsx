// using React from the compiling
import React, { useState } from "react";
import { Navbar } from "../components";
import styled from "styled-components";
import { Select, Input, Dropdown, Button } from "../components";
import { GoLocation, GoCalendar } from "react-icons/go";
import { IoTimeOutline } from "react-icons/io5";
import {
  findBusByStopIds,
  useFindStops,
  useFindDocById,
} from "../custom-hooks";

const Container = styled.div`
  width: 100%;
  background: ${(props) => props.theme.__background};
  min-height: 100vh;
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

  & > div:nth-of-type(5) {
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 3;
    display: grid;
    place-items: center;
  }

  @media (max-width: 550px) {
    display: block;

    & > div {
      padding: 0.5em;
    }

    & > div:nth-of-type(5) {
      grid-row-start: 6;
      grid-row-end: 6;
      grrid-column-start: 1;
    }
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

const Marquee = styled.div`
  font-size: 23ch;
  font-weight: bold;
  -webkit-text-stroke: 2px
    linear-gradient(
      to right,
      ${(props) => props.theme.__primary},
      ${(props) => props.theme.__textColor}
    );
  color: ${(props) => props.theme.__textColor};
  letter-spacing: -14px;
  text-transform: lowerspace;

  @media (max-width: 550px) {
    font-size: 7ch;
  }
`;

const Home = (props) => {
  const [finalSource, setFinalSource] = useState<any>({});
  const [finalDestination, setFinalDestination] = useState<any>({});

  const [sourceValue, setSourceValue] = useState("");
  const [destinationValue, setDestinationValue] = useState("");
  const [source, setSource, sourceFeedback] = useFindStops();
  const [destination, setDestination, destinationFeedback] = useFindStops();
  const [, , , , resultDoc, , handleDocId] = useFindDocById();

  console.log(props);

  // handle submit
  const handleSubmit = (e) => {
    try {
      // prevent from page reloading
      e.preventDefault();

      console.log("Source and destination : ", source, destination);
      handleDocId("routes", "HPSHIR0001");
      findBusByStopIds("routes", "stops", source.stopId, destination.stopId);
    } catch (e) {
      console.log("Error Occured while handleSubmit fn : ", e);
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <Marquee direction="none">Alaric</Marquee>
        <SearchBusesContainer>
          <Heading>Search the buses</Heading>
          <Form onSubmit={handleSubmit}>
            <div>
              <Row>
                <Icon>
                  <GoLocation size={28} />
                </Icon>
                <Dropdown
                  searchString={sourceValue}
                  setSearchString={setSourceValue}
                  setData={setSource}
                  feedback={sourceFeedback}
                  setFinalValue={setFinalSource}
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
                  searchString={destinationValue}
                  setSearchString={setDestinationValue}
                  setData={setDestination}
                  feedback={destinationFeedback}
                  setFinalValue={setFinalSource}
                  placeholder="To"
                />
              </Row>
            </div>
            <div>
              <Row>
                <Select defaultValue="government">
                  <option value="private">Private</option>
                  <option value="government">Government</option>
                </Select>
              </Row>
            </div>
            <div>
              <Row>
                <Input type="text" placeholder="Bus Name (optional)" />
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
          </Form>
        </SearchBusesContainer>
      </Container>
      <div>
        {resultDoc.length === 0
          ? null
          : resultDoc.map((item) => {
              return <div>{item.stopName}</div>;
            })}
      </div>
    </>
  );
};

export default Home;
