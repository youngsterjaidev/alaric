import {useEffect, useState} from "react"
import { collection, getDocs  } from "firebase/firestore"
import { db } from "../firebase"

export const useFindStops = () => {
	const [stopName, setStopName] = useState<string>("")
	const [result, setResult] = useState([])

	const handleStopName = async () => {
		try {
			console.log("handle Stop Name : ")
			let querySnapshot = await getDocs(collection(db, "stops"))
			let tempArr = []
			querySnapshot.forEach(doc => {
				// doc.data() is never undefined for query doc snapshot
				tempArr.push(doc.data())
			})
			setResult(tempArr)
		} catch(e) {
			console.log("Error Occured in the handleStopName custom hook : ", e)
		}
	}

	useEffect(() => {
		handleStopName()	
	}, [stopName])
	
	return [stopName, setStopName, result]
}
