// Hooks
import React from "react"
import {ThemeProvider} from "styled-components"
import { useLocalStorage } from "./useLocalStorage"

import { defaultTheme, darkTheme } from "../utils/theme"


interface Props {
	themeName: string
}

const useTheme = ()  => {
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

export const ToggleTheme: React.FC<Props> = ({ children, themeName }) => {
	const [theme, setTheme] = useLocalStorage("color-scheme", themeName)

	if(theme === "dark") {
		return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
	}

	if(theme === "light") {
		return <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
	}

	if(theme === "dim") {
		return <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
	}
	
	return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
}
