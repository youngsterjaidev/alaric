import React, { useState, useEffect, useContext } from "react";
import { Redirect, navigate } from "@reach/router";
import BarLoader from "react-spinners/BarLoader";
import firebase from "firebase/compat/app";
import styled from "styled-components";
import UserContext from "../UserContext.js";
import { useAuth, useTheme } from "../custom-hooks/";
import { defaultTheme, darkTheme } from "../utils/theme";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  place-items: center;
  background: ${(props) => props.theme.__background};
`;

const Loader = ({ theme }) => {
  return (
    <BarLoader
      color={theme.__primary}
      css="display: block;"
      loading={true}
      height={3}
      width={100}
    />
  );
};

const Loading = () => {
  const [isLogin, setIsLogin] = useState(false);
  const { user } = useAuth();
  const [theme] = useTheme();

  useEffect(() => {
    console.log("The User Will Be ", user);
  });

  // check if the user is null send the user to login page

  // if the user  is login send the user to home page

  return (
    <Container>
      <div>
        <Loader theme={theme === "dark" ? darkTheme : defaultTheme} />
      </div>
      {user ? (
        <Redirect to="/home" noThrow />
      ) : (
        <Redirect to="/login" noThrow />
      )}
    </Container>
  );
};

export default Loading;
