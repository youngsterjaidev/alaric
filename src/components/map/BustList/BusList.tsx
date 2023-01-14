import React, { useEffect, useState } from "react";
import styled from "styled-components"

const Container = styled.div`
  width: 100%;
  padding: 0rem 1rem;
  overflow-y: auto;
  height: 60vh;
`

const CardContainer = styled.div``

const Card = styled.div`
  padding: 1rem 0rem;
  
`

const Heading = styled.h3`
  position: sticky;
  margin: 0;
  top: 0;
  background: ${props => props.theme.__background};
`

interface BusListProp {
  list: any;
}
export const BusList: React.FC<BusListProp> = ({ list }) => {

  const [buses, setBuses] = useState([]);

  useEffect(() => {
    if (list) {
      setBuses(list.buses);
    }
    // NOTE: adding "list" var because the useEffect function does not 
    // update when props change
  }, [list]);

  if (!list) {
    return (
      <div>Buses not found !</div>
    )
  }

  return (
    <Container>
      <Heading>Buses near by you</Heading>
      {list.buses.map((bus, i) => (
        <CardContainer key={i}>
          <Card>{bus}</Card>
        </CardContainer>
      ))}
    </Container>
  );
};
