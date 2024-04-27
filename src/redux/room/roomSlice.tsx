import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../user/userSlice";
type roomType={
    roomId:string;
    allMembers:UserType[]
}

const initialState:roomType={
    roomId:"",
    allMembers:[]
}

export const roomSlice=createSlice({
    name:"Room",
    initialState,
    reducers:{
        setRoomId:(state,action:PayloadAction<string>)=>{
             state.roomId=action.payload
        },
        addMemberToRoom:(state,action:PayloadAction<UserType>)=>{
             state.allMembers.push(action.payload)
        }
    }
})
export const {setRoomId,addMemberToRoom}=roomSlice.actions
export default roomSlice.reducer