import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Input } from "..";
import { useFindStops } from "../../../custom-hooks";

const Container = styled(Button)`
  width: 100%;
  display: block;
  padding: 0;
  margin: 0;
  border: none;
  z-index: 1;
  text-align: left;
  position: relative;
  background: transparent;

  & > div:nth-of-type(1) {
    display: none;
    border: none;
  }

  &:focus-within > div:nth-of-type(1) {
    display: block;
  }
`;

const DropdownInput = styled(Input)`
  width: 100%;
`

const Panel = styled.div`
  background: ${(props) => props.theme.__background};
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 0.5em;
  border-radius: 1em;
  height: max-content;
  max-height: 50vh;
  overflow: auto;
  border: 2px solid ${props => props.theme.__outlineColor};
  box-shadow: 0px 4px 15px 2px #00000069;

  &:empty {
    display: none;
  }

  & > div {
    padding: 1em;
    width: 100%;
    color: ${(props) => props.theme.__textColor};
  }

  & > div:hover {
    background: ${(props) => props.theme.__line};
    color: ${(props) => props.theme.__textColor};
  }
`;

const dummyData = [
  {
    stopName: "igmc",
  },
  {
    stopName: "shimla",
  },
  {
    stopName: "Mashobra",
  },
];

interface Props {
  placeholder: string;
  setData: any;
  feedback: [any];
  searchString: any;
  setSearchString: any,
}

export const Dropdown: React.FC<Props> = ({
  searchString,
  setSearchString,
  placeholder,
  setData,
  feedback,
}) => {
  const [result, setResult] = useState([]);
  const [ready, setReady] = useState(false)

  const filterStops = (val: string) => {

    let stopName = val.toLowerCase().replace(/\s/g, '')

    let newData: any = feedback.filter((item) => {
      console.log(val);
      if (!val) return false;
      return item.stopName.replace(/\s/g, '').slice(0, stopName.length) === stopName
    });
    setResult(newData);
    setData(newData[0])
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSearchString(e.target.value);
      setData(e.target.value);
    } catch (e) {
      console.log("Error Occured in the handleSearch fn : ", e);
    }
  };

  useEffect(() => {
    console.log("Component should be re -render");
    console.log(feedback)
  }, [searchString]);

  return (
    <Container
      type="button"
    >
      <DropdownInput
        type="search"
        value={searchString}
        onChange={handleSearch}
        placeholder={placeholder}
      />
      {true ? (
        <Panel>
          {feedback.length === 0
            ? null
            : feedback.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  onClick={(e) => {
                    setSearchString(item.stopName);
                    setData(item.stopName);
                  }}
                >
                  {item.stopName}
                </div>
              );
            })}
        </Panel>
      ) : null}
    </Container>
  );
};
