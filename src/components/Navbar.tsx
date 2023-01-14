// using React from the compiling
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Input, Sidebar } from "../components";
import { ThemeToggle } from "../assets";
import { Link, navigate } from "@reach/router";
import { useAuth, useTheme } from "../custom-hooks";
import { IoIosArrowBack, IoIosMenu } from "react-icons/io";
import Modal from "../Modal";

const Nav = styled.nav`
  padding: 0.5em 1em;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background-color: ${(props) => props.theme.__background};
  transition: background-color 0.4s linear;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
	box-shadow: 5px 0 20px rgb(0 0 0 / 45%);

  @media (max-width: 600px) {
    display: none;
  }
`;

const Form = styled.form`
  width: auto;
  display: flex;
  flex-flow: row nowrap;
`;

const MyLink = styled(Link)`
  text-decoration: none;
  margin-right: 1em;
  padding: 0.15em 1em;
  font-weight: 600;
  border-radius: 4em;
  color: ${(props) => props.theme.__textColor};

  &:hover {
    background: ${(props) => props.theme.__textColor};
    color: ${(props) => props.theme.__background};
  }
`;

const MyButton = styled(Button)`
  margin-left: 1em;
  border-radius: 4em;
`;

const MobileNav = styled.div`
  display: none;

  @media (max-width: 600px) {
    padding: 0.5em 1em;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    background-color: ${(props) => props.theme.__background};
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
`;

const Ul = styled.div`
  list-style-type: none;
`;

const Icon = styled.div`
  cursor: pointer;
  & > svg {
    color: ${(props) => props.theme.__textColor};
  }
`;

export const Navbar = () => {
  // @ts-ignore
	const { user } = useAuth()
  const [theme, setTheme] = useTheme();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

	console.log("Navbar User : ", user)

  // toggle sidebar
  const toggleSidebar = () => {
    try {
      setShowSidebar(!showSidebar);
    } catch (e) {
      console.log("Error Occured while toggling the sidebar : ", e);
    }
  };

  return (
    <>
      <Nav>
        <div style={{ display: "flex", alignItems: "center" }}>
          <MyLink data-test="web-nav-link-home" to="/home">Home</MyLink>
          <MyLink data-test="web-nav-link-live" to="/live">Live</MyLink>
          <MyLink data-test="web-nav-link-contact" to="/contact">Contact</MyLink>
          <MyLink data-test="web-nav-link-help" to="/help">Help</MyLink>
          <ThemeToggle
						dataTest="web-nav-link-themetoggle"
            onClick={() => {
              console.log("Ready !");
              setTheme(theme === "dark" ? "light" : "dark");

              console.log("red");
            }}
          >
            Light
          </ThemeToggle>
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
            <MyButton secondary type="submit" primary small>
              Search
            </MyButton>
						<MyButton type="submit" primary small onClick={() => {
							navigate(`${user ? "/profile" : "/login"}`)
							}}>
							{user ? "Account" : "Login"}
            </MyButton>
          </Form>
        </div>
      </Nav>
      <Sidebar showModal={showSidebar} setShowModal={setShowSidebar}>
        <Ul>
          <li>
            <MyLink data-test="mobile-nav-link-home" to="/home">Home</MyLink>
          </li>
          <li>
            <MyLink data-test="mobile-nav-link-live" to="/live">Live</MyLink>
          </li>
          <li>
            <MyLink data-test="mobile-nav-link-contact" to="/contact">Contact</MyLink>
          </li>
          <li>
            <MyLink data-test="mobile-nav-link-help" to="/help">Help</MyLink>
          </li>
					<li>
						{!user ? (
            	<MyLink data-test="mobile-nav-link-login" to="/login">Login</MyLink>
						) : (
            	<MyLink data-test="mobile-nav-link-login" to="/profile">Account</MyLink>
						)}
          </li>
          <ThemeToggle
						dataTest="mobile-nav-link-themetoggle"
            onClick={() => {
              console.log("Ready !");
              setTheme(theme === "dark" ? "light" : "dark");

              console.log("red");
            }}
          >
            Light
          </ThemeToggle>
        </Ul>
      </Sidebar>
      <MobileNav>
        <Icon>
          <IoIosArrowBack data-test="mobile-nav-link-back" size={30} />
        </Icon>
        <Icon
          onClick={() => {
            console.log("Nav : ");
            toggleSidebar();
          }}
        >
          <IoIosMenu data-test="mobile-nav-link-menu" size={30} />
        </Icon>
      </MobileNav>
    </>
  );
};
