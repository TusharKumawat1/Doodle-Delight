import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"
export type UserType={
    username:string;
    roomId:string;
    avatar:string;
}
const initialState:UserType={
    username:"",
    roomId:"",
    avatar:""
}
export const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
       setUser:(state,action:PayloadAction<UserType>)=>{
            state.username=action.payload.username
            state.roomId=action.payload.roomId
            state.avatar=action.payload.avatar
       }
    }
})
export const {setUser} =userSlice.actions
export default userSlice.reducer