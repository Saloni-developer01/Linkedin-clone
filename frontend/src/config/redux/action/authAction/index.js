import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try{

            const response = await clientServer.post(`/login`, {
                email: user.email,
                password: user.password
            });

            if(response.data.token){
                localStorage.setItem("token", response.data.token); // yaha token ko localStorage mein store karte hain taki humnai user ko login karne ke baad uski session ko maintain kar sakein or ye token humnai backend se mila hai jab user login karta hai user.controller.js mein mai login function ke andar
            }else{
                return thunkAPI.rejectWithValue({  // this is called payload jo hum authReducer/index.js mai use kar rhe hai payload means simply message 
                    message: "token not provided"
                })
            }

            return thunkAPI.fulfillWithValue(response.data.token);  // dekho fulfillWthValue ek action hai or eskai ander jo value hai yaa message haii response.data.token yee payload hai 


        }catch (error) {
            return thunkAPI.rejectWithValue(error.response.data); // yaha response.data se error message milta hai jo humnai backend kai user.controller mein diya tha login function mein ess tarah sai  return res.status(500).json({message: error.message});
        }
    }
)


export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {

        try {

            const request = await clientServer.post(`/register`, {
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name,
            })
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data); 
        }
     }
)


export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user, thunkAPI) =>{
        try {
            
            ///get_user_and_profile ye route user.routes.js file sai aya hai
            const response = await clientServer.get("/get_user_and_profile", {
                params: {
                    token: user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data);

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async(_, thunkAPI) => {
        try{

            const response = await clientServer.get("/user/get_all_users")

            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)


export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async(user, thunkAPI) => {
        try{

            const response = await clientServer.post("/user/send_connection_request", {
                token: user.token,
                connectionId: user.user_id
            })

            thunkAPI.dispatch(getConnectionRequest({token: user.token}))

            return thunkAPI.fulfillWithValue(response.data);

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)


export const getConnectionRequest = createAsyncThunk(
    "user/getConnectionRequests",
    async(user, thunkAPI) => {
        try {

            const response = await clientServer.get("/user/getConnectionRequests", {
                params:{
                    token: user.token
                }
                
            })

            return thunkAPI.fulfillWithValue(response.data);
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)


export const getMyConnectionsRequests = createAsyncThunk(
    "/user/getMyConnectionRequests",
    async(user, thunkAPI) => {
        try {

            const response = await clientServer.get("/user/user_connection_request", {
                params:{
                    token: user.token
                    
                }
            });

            return thunkAPI.fulfillWithValue(response.data);
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)


export const AcceptConnection = createAsyncThunk(
    "user/acceptConnection", 
    async(user, thunkAPI)=>{
        try {
            const response = await clientServer.post("/user/accept_connection_request", {
                token: user.token,
                requestId: user.connectionId,
                action_type: user.action
            });

            thunkAPI.dispatch(getConnectionRequest({token: user.token})); //(phli line) en dono line ko esliye likha gya hai kii kisi kii request ko accept karne kai baad page ko reload naa karna pare wo apne aap my connection sai my network mai aa jaye
            thunkAPI.dispatch(getMyConnectionsRequests({token: user.token})) /// (dusri line)

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)