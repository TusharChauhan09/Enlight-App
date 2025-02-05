import { create} from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create( (set) => ({
    // states
    authUser: null,
    isCheckingAuth: true,
    
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    
    // function 
    // checkAuth : to check if the user is authenticated
    checkAuth: async () => {
        try{
            const response = await axiosInstance.get("/auth/check");
            set({authUser:response.data});
        }
        catch(error){
            console.log("Error in checkAuth: ",error);
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
    }
})
)