import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../user/userSlice";
type roomType={
    roomId:string;
    allMembers:UserType[]
}
type updateScore={
    allMembers:UserType[]
    userIndex:number
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
        addMemberToRoom:(state,action:PayloadAction<UserType[]>)=>{
             state.allMembers=action.payload
        }
    }
})
export const {setRoomId,addMemberToRoom}=roomSlice.actions
export default roomSlice.reducer