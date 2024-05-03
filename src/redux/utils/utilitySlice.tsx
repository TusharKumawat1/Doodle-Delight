import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type  PaylodaType={
    notAllowedToDraw:boolean;
    showRandomWords:boolean
}
const initialState:PaylodaType={
    notAllowedToDraw:true,
    showRandomWords:false
}
export const utilitySlice=createSlice({
    name:"utility",
    initialState,
    reducers:{
        togglenotAllowedToDraw:(state,action:PayloadAction<boolean>)=>{state.notAllowedToDraw=action.payload},
        toggleShowRandomWords:(state,action:PayloadAction<boolean>)=>{state.showRandomWords=action.payload}
    }
})
export const {togglenotAllowedToDraw,toggleShowRandomWords}=utilitySlice.actions
export default utilitySlice.reducer