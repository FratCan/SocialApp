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

export const getAuther = async () => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
}

export const onaboard = async (onaboardData) => {
	const res = await axiosInstance.post('/auth/onboarding',onaboardData);
	return res.data;
}