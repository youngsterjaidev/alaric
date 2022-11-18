// using React from the compiling
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import firebase from "firebase/compat/app";
import { Stop } from "../types/firestore"
import { Input, Dropdown } from "../components";
import {
  useFindStops,
  findBusByStopIds,
  findBusByStopId,
} from "../custom-hooks";

const Form = styled.form``;

const HomeInput = styled(Input)`
  width: 100%;
`;

interface Props {
  setBuses: any;
  setReady: any;
}

const HomeSearch: React.FC<Props> = ({ setBuses, setReady }) => {
  const [searchStr, setSearchStr] = useState<string>("");

  const [finalStop, setFinalStop] = useState();

  const [stop, setStop, stopFeedback] = useFindStops();

  useEffect(() => {
    console.log("Final Stop : ", stop);
  }, [stop]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // setBuses(await findBusByStopId("routes", "stops", stop.stopId))
      console.log("Buses List : ", stop)
      // @ts-ignore
      setBuses(stop.buses)
      setReady(false)
    } catch (e) {
      console.log("Error Occured while submitting the form : ", e);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Dropdown
        searchString={searchStr}
        setSearchString={setSearchStr}
        setData={setStop}
        feedback={stopFeedback}
        setFinalValue={setFinalStop}
        placeholder="Enter Stop Name"
      />
    </Form>
  );
};

export default HomeSearch;
