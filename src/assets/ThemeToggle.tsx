import { useState } from "react";
import { useTheme } from "../custom-hooks";
import styled from "styled-components";

const Container = styled.div`
  background: transparent;
`;

const Circle = styled.circle`
  transition: all 0.5s linear;
`;

export const ThemeToggle = ({ dataTest }) => {
  // @ts-ignore
  const [theme, setTheme] = useTheme();
  const [FPosX, setFPosX] = useState<number>(35);
  const [FSize, setFSize] = useState<number>(15);
  const [SPosX, setSPosX] = useState<number>(70);
  const [SSize, setSSize] = useState<number>(25);
  const [FColor, setFColor] = useState("white");
  const [SColor, setSColor] = useState("purple");

  // @ts-ignore
  const changeTheme = (e) => {
    setTheme(theme === "dark" ? "light" : "dark");
    if (FColor === "white") {
      setFColor("purple");
      setSColor("white");
    } else {
      setFColor("white");
      setSColor("purple");
    }
  };

  return (
    <Container 
			data-test={dataTest}
			style={{ width: "45px", height: "45px" }}
		>
      <svg
        onClick={changeTheme}
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
      >
        <Circle
          cx={`${FPosX}`}
          stroke-width="2"
          stroke={SColor}
          cy="50"
          fill={FColor}
          r={`${FSize}`}
        />
        <Circle
          cx={`${SPosX}`}
          stroke-width="2"
          cy="50"
          // stroke={FColor}
          fill={SColor}
          r={`${SSize}`}
        />
      </svg>
    </Container>
  );
};
