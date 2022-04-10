// Hooks
import React, { createContext, useContext } from "react"
import { ThemeProvider } from "styled-components"
import { useLocalStorage } from "./useLocalStorage"

import { defaultTheme, darkTheme } from "../utils/theme"


/*const useTheme = ()  => {
	// store the theme in the localStorage with "default" value
	const [theme, setTheme] = useLocalStorage("color-scheme", "default")

	const changeTheme = (themeName: string) => {
		try {
			// change the theme in the localstorage
			setTheme(themeName)
		} catch(e) {
			console.error("Error Occure while changing the theme in changeTheme fn : ", e)
		}
	}

	// returning the theme state and its dispactch function to change that
	return [theme, setTheme]
}
 */

// creating a Theme context so we use in the child components
const ThemeContext = createContext()


/*
 * ToggleTheme hook changes the theme of the page
 * - set the theme in localstorage of the page by calling the hook
 * - check the theme we get it fall in which condition
 * - and passing the props to the useTheme hook that React.Context
 */
export const ToggleTheme = ({ children }) => {
	const [theme, setTheme] = useLocalStorage("color-scheme", "dark")

	console.log("use Theme : ", theme, setTheme)

	if (theme === "dark") {
		return (<ThemeProvider theme={darkTheme}>
			<ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>
		</ThemeProvider>)
	}

	if (theme === "light") {
		return <ThemeProvider theme={defaultTheme}>

			<ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>
		</ThemeProvider>
	}

	if (theme === "dim") {
		return <ThemeProvider theme={defaultTheme}>

			<ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>
		</ThemeProvider>
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>
		</ThemeProvider>)
}

export const useTheme = () => {
	let theme = useContext(ThemeContext)
	console.log(theme)
	return theme
}
