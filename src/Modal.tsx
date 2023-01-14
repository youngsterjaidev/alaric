import React, { useRef, useEffect } from "react";
import { a, useSpring } from "@react-spring/web";
import styled from "styled-components";
import { createPortal } from "react-dom";

const Container = styled(a.div)`
  position: relative;
`;

const CloseWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #80808030;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  cursor: pointer;
`;

const Content = styled(a.div)`
  width: 70vw;
  background: ${(props) => props.theme.__background};
  color: ${(props) => props.theme.__textColor};
  position: fixed;
  right: 0;
  height: 100vh;
`;

const modalRoot: HTMLDivElement = document.getElementById("modal");

const Modal = ({ children, showModal, closeModal }) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  const animation = useSpring({
    opacity: showModal ? 1 : 0,
    display: showModal ? "block" : "none",
  });

  const ContentAnimation = useSpring({
    transform: showModal ? `translateX(-360)` : `translateX(0)`,
  });

  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    if (elRef) {
      modalRoot.appendChild(elRef?.current);
    }
    return () => modalRoot.removeChild(elRef.current);
  }, []);

  return createPortal(
    <Container style={animation}>
      <CloseWrapper onClick={closeModal}></CloseWrapper>
      <Content style={ContentAnimation}>{children}</Content>
    </Container>,
    elRef.current
  );
};

export default Modal;
