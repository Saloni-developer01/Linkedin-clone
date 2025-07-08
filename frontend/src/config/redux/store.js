import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";



/**
 * 
 *  STEPS for state management:
 *  Submit Action   (Action -> Reducer -> Store -> View)
 *  Handle action in it's reducer
 *  Register reducer in the store
 */



export const store = configureStore({
    reducer:{
        auth: authReducer,
        postReducer: postReducer
    }

})