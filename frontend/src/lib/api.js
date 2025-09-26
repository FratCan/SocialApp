import { axiosInstance } from './axios.js'

export const signup =async (signupData)=>{
    const res = await axiosInstance.post('/auth/signup',signupData)
    return res.data;
}

export const verify = async (verifyData) => {
	console.log("Sending verify request:", verifyData);
	const res = await axiosInstance.post("/auth/verify-code", verifyData);
	return res.data;
}