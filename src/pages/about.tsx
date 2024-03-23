import React from "react";
import styled, { keyframes } from "styled-components";
import { Navbar } from "../components";
import { MdOutlineArrowDownward } from "react-icons/md";
import { GoArrowDown } from "react-icons/go";
import { FaXTwitter, FaFacebook, FaYoutube } from "react-icons/fa6";
import { Button, Input, Sidebar } from "../components";
import { navigate } from "@reach/router";

const rotate = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

const move = keyframes`
    to {
        transform: translateY(15px);
    }
`;

const Container = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: ${(props) => props.theme.__background};

  &:first-of-type {
    position: sticky;
    top: 0;
    z-index: -1;

    & div {
      color: ${(props) => props.theme.__textColor};
      text-align: center;
      animation: ${rotate} 3s 1;
    }

    & svg {
      animation: ${move} 3s infinite cubic-bezier(0.13, 0.83, 0.32, 0.92);
    }
  }

  &:nth-of-type(2) {
    padding: 18ch;
    box-shadow: 0px 0 20px rgb(0 0 0 / 45%);
    z-index: 2;
    text-align: justify;

    @media (max-width: 550px) {
      padding: 2ch;
    }
  }

  & h1,
  & h3 {
    text-align: center;
    color: ${(props) => props.theme.__textColor};
  }
`;

const Heading = styled.h1`
  font-size: 18ch;
  margin: 0;
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

const Tagline = styled.h3`
  font-weight: bold;
  color: ${(props) => props.theme.__textColor};
  text-transform: lowerspace;
`;

const MyButton = styled(Button)`
  margin-left: 1em;
  border-radius: 4em;
`;

const GetStarted = styled.div`
  padding: 1rem 0rem;
  display: grid;
  place-items: center;
`;

const MediaHandler = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0rem;

  & svg {
    color: ${(props) => props.theme.__textColor};
  }
`;

export default () => {
  return (
    <>
      <Container>
        <div>
          <Heading>Alaric</Heading>
          <Tagline>The Smarter Way to Ride</Tagline>
          <div>Scroll Down</div>
          <div>
            <MdOutlineArrowDownward size={30} />
          </div>
        </div>
      </Container>
      <Container>
        <div>
          <h1>ABOUT US</h1>
          <h3>
            Experience the future of seamless mobility with our cutting-edge
            platform. We empower you to take control of your commute by
            providing real-time vehicle tracking and instant ride booking
            capabilities. Stay ahead of the curve by accessing up-to-the-minute
            location data of our fleet, allowing you to plan your journey with
            precision.
          </h3>
          <GetStarted>
            <MyButton primary medium onClick={() => navigate("/home")}>
              Get Started
            </MyButton>
          </GetStarted>
          <MediaHandler>
            <FaXTwitter size={30} />
            <FaFacebook size={30} />
            <FaYoutube size={30} />
          </MediaHandler>
        </div>
      </Container>
    </>
  );
};
