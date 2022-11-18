import React, { useState } from "react";
import styled from "styled-components";
import { animated, useSpring, config } from "@react-spring/web";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1;
`;

const CloseWrapper = styled.div`
  background: hsl(0deg 0% 10% / 34%);
`;

const Content = styled.div`
  padding: 1rem;
  background: ${(props) => props.theme.__background};
  color: ${(props) => props.theme.__textColor};
  box-shadow: 5px 0 40px rgb(0 0 0 / 45%);
`;

export const Sidebar = ({ children, showModal, setShowModal }) => {
  const styles = useSpring({
    visibility: showModal ? "visible" : "hidden",
    opacity: showModal ? 1 : 0,
    gridTemplateColumns: showModal ? "1fr 2fr" : "1fr 0fr",
    config: config.slow,
  });

  return (
    <div>
      <Container as={animated.div} style={styles}>
        <CloseWrapper data-test="mobile-sidebar-close" onClick={() => setShowModal(!showModal)}></CloseWrapper>
        <Content data-test="mobile-sidebar-container">{children}</Content>
      </Container>
    </div>
  );
};
