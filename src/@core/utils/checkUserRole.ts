import { useAuthContext } from "src/auth/hooks";


export const checkRole=(expectRole: any)=>{
    const {user} = useAuthContext();
    return user?.role === expectRole;
}