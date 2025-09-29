import { useQuery } from '@tanstack/react-query'
import { getAuther } from '../lib/api.js'

const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ['authUser'],
        queryFn: getAuther,
        retry:false
    });
    return {isLoading:authUser.isLoading, authUser:authUser.data?.user};
}

export default useAuthUser
