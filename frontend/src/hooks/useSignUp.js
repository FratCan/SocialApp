import React from 'react'
import { useNavigate } from 'react-router';
import { useMutation} from '@tanstack/react-query'
import {signup} from '../lib/api.js'

const useSignUp = () => {
    //const QueryClient = useQueryClient();
    const navigate = useNavigate();
    const { isPending, error, mutate } = useMutation({
        mutationFn: signup,
        onSuccess: (data,variables) => {
            localStorage.setItem("pendingEmail", variables.email);
            navigate("/verify-email", { state: { email: variables.email } });
        }
        //onSuccess:()=>QueryClient.invalidateQueries(['authUser']),
    });

    return { isPending, error, signUpMutation: mutate };
};
export default useSignUp;