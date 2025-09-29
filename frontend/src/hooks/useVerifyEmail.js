import React from 'react'
import { verify } from "../lib/api.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";


const useVerifyEmail = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isPending, error, mutate} = useMutation({
		mutationFn: verify,
		onSuccess: (data) => {
			queryClient.setQueryData(["authUser"], { user: data.user });
			//queryClient.invalidateQueries(["authUser"]);
			navigate("/onboarding");
		},
	});

    return{isPending,error,verifyMutation:mutate};
}

export default useVerifyEmail
