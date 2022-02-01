// using React from the compiling
import React, { useState, useEffect } from "react"
import styled from "styled-components"
import firebase from "firebase/compat/app"

const Form = styled.div``

const Input = styled.input``

interface Props {
	setBuses: any,
	setReady: boolean
}

const HomeSearch: React.FC<Props> = ({ setBuses, setReady }) => {
	const [searchStr, setSearchStr] = useState<string>("")

	const findBuses = async (busesArr: [string]) => {
		let temp = []
		for (let bus of busesArr) {
			let res = await firebase.firestore().collection("buses").where("allotedRoute", "==", bus)
			res.onSnapshot(snap => {
				snap.docChanges().forEach(doc => {
					console.log("Buses", doc.doc.data())
					temp.push(doc.doc.data())
				})
				setReady(false)
				setBuses(temp)
			})
		}
	}

	const findRoute = async (id) => {
		let temp = []
		try {
			// find the route
			let res = await firebase.firestore().collection("routes").where("stops", "array-contains", id)
			res.onSnapshot(snap => {
				snap.docChanges().forEach(doc => {
					temp.push(doc.doc.id)
				})
				findBuses(temp)
			})
		} catch (e) {
			console.error("Error Occured in findRoute fn : ", e)
		}
	}


	const findStopId = async (stopName: string) => {
		console.log("stopName", stopName)

		try {
			let res = await firebase.firestore().collection("stops").where("stopName", "==", stopName)
			res.onSnapshot(snap => {
				snap.docChanges().forEach(doc => {
					if (doc.doc.id) {
						findRoute(doc.doc.id)
					}
				})
			})
		} catch (e) {
			console.log("Error Occured in the findStopId fn : ", e)
		}
	}

	const findBusByString = async (str: string) => {
		console.log("Search String : ", str)

		try {
			// search the string
			let res = await firebase.firestore().collection("buses").doc(str)
			res.onSnapshot(doc => {
				console.log(doc.exists)
				if (doc.exists) {
					// set the array to busList
					console.log("Bus : ", doc.data())
					setReady(false)
					setBuses(doc.data())
					return
				}
				findStopId(str)
			})
		} catch (e) {
			console.error("Error Occured in findBus fn : ", e)
		}
	}


	// handle search
	const handleSearch = async (e) => {
		// find the resquest to the firebase server

		let val = e.target.value
		setSearchStr(val)

		findBusByString(val)

	}

	return (
		<Form>
			<Input value={searchStr} type="search" placeholder="Search" onChange={handleSearch} />
		</Form>
	)
}

export default HomeSearch

