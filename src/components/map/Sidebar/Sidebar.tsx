import React, { FC, useState } from "react";
import { Router } from "@reach/router";
import styled from "styled-components"
import { Dropdown, Button } from "../../elements";
import { useFindStops } from "../../../custom-hooks";
import { BusList } from "../BustList/BusList";
import { BusInfo } from "../BusInfo/BusInfo";

const Container = styled.div<{ containerHeight: string }>`
  z-index: 4;
  position: fixed;
  top: 10px;
  left: 10px;
  width: 37%;
  border-radius: 0.5rem;
  background: ${(props) => props.theme.__background};
  color: ${(props) => props.theme.__textColor};
  box-shadow: 0px 0px 20px 3px #00000069;

  @media (max-width: 550px) {
    top: ${props => props.containerHeight};
    width: 98%;
    margin: auto;
    border-radius: 1rem 1rem 0 0;
    bottom: 0;
    right: 0;
    height: auto;
    left: 0;
  }
`;

const Panel = styled.div`
  padding: 1rem;
  display: flex;
  height: 3vh;
  justify-content: center;
  align-items: center;

  & > div {
    width: 15vh;
    height: 6px;
    border-radius: 50px;
    background: #d0d0d0;
  }
`;

const SidebarForm = styled.form`
  padding: 1rem;
  display: flex;
  flex-flow: row nowrap;
  gap: 0.5rem;
  border-bottom: 2px solid ${props => props.theme.__line};
`;

const Main = styled.div`
  width: 100%;
`

interface SidebarProps {
  findStop: any,
  updateRoute: any
}

export const Sidebar: FC<SidebarProps> = ({ findStop, updateRoute }) => {

  const [searchString, setSearchString] = useState("");
  const [result, setResult, resultFeedback] = useFindStops();
  const [containerHeight, setContainerHeight] = useState("40vh");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("The result will be : ", result, resultFeedback);
    findStop(resultFeedback[0]);
  };


  return (
    <Container containerHeight={containerHeight}>
      <Panel>
        <div onClick={() => {
          if (containerHeight === "40vh") {
            setContainerHeight("96vh");
            return;
          }

          setContainerHeight("40vh");
        }}></div>
      </Panel>
      <SidebarForm onSubmit={handleSubmit}>
        <Dropdown
          placeholder="Stop Name, Place, Bus Number"
          searchString={searchString}
          setSearchString={setSearchString}
          setData={setResult}
          feedback={resultFeedback} />
        <Button type="submit" primary>
          Search
        </Button>
      </SidebarForm>
      <Main>
        <Router>
          <BusList list={resultFeedback[0]} path="/" />
          <BusInfo email="random" updateRoute={updateRoute} path="/:bus" />
        </Router>
      </Main>
    </Container>
  );
};
