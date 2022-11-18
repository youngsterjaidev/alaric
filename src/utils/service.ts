import axios from "axios"

const SERVER_URI = process.env.REACT_APP_SERVER_URI

export const createUser = async (data: any) => {
	try {
		return await axios({
			url: `${SERVER_URI}/create`,
			method: "POST",
			data: JSON.stringify(data)
		})	
	} catch(e) {
		console.log("Error Occured while creating a user :", e)
	}
}
