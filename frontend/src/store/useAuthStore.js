import { create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000"

export const useAuthStore = create( (set,get) => ({
    // states
    authUser: null,
    isCheckingAuth: true,
    
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    onlineUsers: [],

    socket: null,
    
    // function 
    // checkAuth : to check if the user is authenticated
    checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");
          set({ authUser: res.data });

          // connect socket every refresh
          get().connectSocket();

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

          // connect socket here after sigin  
          get().connectSocket();

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

          //disconnect the socket after login out 
          get().disconnectSocket();

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

          // connect socket here after login in 
          get().connectSocket();

        }
        catch(error){
          toast.error("failed to login");
        }
        finally{
          set({isLoggingIn: false});
        }
      },

      updateProfile: async (data)=>{
        set({isUpdatingProfile: true});
        try{
          const res = await axiosInstance.put("/auth/update-profile",data);
          // newly updated data of the user 
          set({authUser: res.data});
          toast.success("Updation successful")
        }
        catch(error){
          toast.error("failed Update");
        }
        finally{
          set({isUpdatingProfile: false });
        }
      },

      // socket connect function 
      connectSocket: () => {
        const { authUser } = get();
        if(!authUser || get().socket?.connected ) return;
        const socket = io(BASE_URL,{
          query: {
            userId: authUser._id
          }
        });
        socket.connect()
        set({socket:socket});

        socket.on("getOnlineUsers", (userIds)=>{
          set({onlineUsers: userIds})
        })
      },

      disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
      },
}));