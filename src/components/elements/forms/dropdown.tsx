import React, {useState} from "react"
import styled from "styled-components"
import { Input } from ".."
import { useFindStops } from "../../../custom-hooks"

const Container = styled.div`
	width: max-content;
`

const Panel = styled.div`
	background: ${props => props.theme.__background};
	position: absolute;
	min-width: 18em;
	margin-top: 0.5em;
	border-radius: 1em;

	&:empty {
		display: none;
	}

	& > div {
		padding: 1em;
		width: 100%;
		color: ${props => props.theme.__textColor};
	}

	& > div:hover {
		background: ${props => props.theme.__line};
		color: ${props => props.theme.__textColor};
	}
`

const dummyData = [
	{
		stopName: "igmc"
	},
	{
		stopName: "shimla"
	},
	{
		stopName: "Mashobra"
	}
]

interface Props {
	placeholder: string;
	setData: any;
	feedback: [any]
}

export const Dropdown: React.FC<Props> = ({ placeholder, setData, feedback }) => {
	const [searchString, setSearchString]	= useState<string>("")
	const [result, setResult] = useState([])

	const filterStops = (val) => {
		let newData = feedback.filter(item => {
			console.log(val)
			if(!val) return false
			return item.stopName.slice(0, val.length)	=== val.toLowerCase()
		})
		setResult(newData)
	}

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {	
			setSearchString(e.target.value)
			setData(e.target.value)
			filterStops(e.target.value)
		} catch(e) {
			console.log("Error Occured in the handleSearch fn : ", e)
		}
	}

	return (
		<Container>
			<Input type="search" onChange={handleSearch} placeholder={placeholder} />
			<Panel>
				{result.length === 0 ? null : result.map((item) => {
					return <div>{item.stopName}</div>
				})}
			</Panel>
		</Container>
	)
}
