import { Primary, Grayscale, Success, Error } from "./colors";
export { primaryFont } from "./typography";

export const defaultTheme = {
  __primary: Primary.Default,
  __primaryHoverColor: Primary.Dark,
  __primaryActiveColor: Primary.Dark,
  __textColor: Grayscale.Body,
  __buttonColor: Grayscale["Off-White"],
  __background: Grayscale["Background"],
  __line: Grayscale["Input Background"],
  __placeholder: Grayscale.Placeholder,
  __outlineColor: Primary.Fade,
  __success: Success.Default,
  __container: Grayscale["Off-White"],
  __error: Error.Default
};

export const darkTheme = {
  __primary: Primary.Staturated,
  __primaryHoverColor: Primary.Dark,
  __primaryActiveColor: Primary.DarkMode,
  __textColor: Grayscale.Background,
  __buttonColor: Grayscale["Off-White"],
  __background: Primary.DarkMode,
  __line: Grayscale["Title-Active"],
  __placeholder: Grayscale.Placeholder,
  __outlineColor: Grayscale.OutlineColor,
  __success: Success.Default,
  __container: Grayscale["Off-Black"],
  __error: Error.DarkMode
};
