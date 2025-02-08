import { create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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
        try {
          const res = await axiosInstance.get("/auth/check");
          set({ authUser: res.data });
        } catch (error) {
          console.log("Error in checkAuth:", error);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
        set({ isCheckingAuth: false })
      },
    

      signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Account created successfully");
        } catch (error) {
          toast.error(error.res.data.message);
        } finally {
          set({ isSigningUp: false });
        }
      },

      logout: async() =>{
         try{
          const res = await axiosInstance.post("/auth/logout");
          set({authUser: null});
          toast.success("Successfully Loged Out");
         }
         catch(error){
          toast.error("failed to logout");
         } 
      },

      login: async (data) =>{
        set({isLoggingIn: true});
        try{
          const res = await axiosInstance.post("/auth/login",data);
          set({authUser: res.data})
          toast.success("login successful");
        }
        catch(error){
          toast.error("failed to login");
        }
        finally{
          set({isLoggingIn: false});
        }
      }
})
)