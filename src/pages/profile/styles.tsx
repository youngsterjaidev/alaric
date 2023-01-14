import styled from "styled-components"

export const Container = styled.div`
	display: grid;
	grid: 1fr 2fr/min-content [nav] 1fr;
	margin-top: 3.8em;
	background: ${props => props.theme.__background};
`

export const Sidebar = styled.div`
	padding: 4rem 1.7rem;
`

export const SidebarProfileContainer = styled.div`
	display: grid;
	place-items: center;
`

export const SidebarProfile = styled.div`
	border-radius: 50%;
	inline-size: 20ch;
	block-size: 20ch;
`

export const Heading = styled.h4`
	color: ${props => props.theme.__textColor};
`

export const Main = styled.div`
	padding: 1rem;
`
