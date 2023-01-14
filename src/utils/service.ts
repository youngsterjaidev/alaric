import axios from "axios"

console.log(process.env)

const SERVER_URI = process.env.REACT_APP_SERVER_URI

export const createUser = async (data: any) => {
	try {
		console.log(`${SERVER_URI}/create`)
		return await axios({
			url: `${SERVER_URI}/create`,
			method: "POST",
			data: JSON.stringify(data)
		})
	} catch (e) {
		console.log("Error Occured while creating a user :", e)
	}
}
