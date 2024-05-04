import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type  PaylodaType={
    notAllowedToDraw:boolean;
    showRandomWords:boolean;
    wordTobeGuessed?:string;
    rightGuess?:boolean;
    score?:number
}
const initialState:PaylodaType={
    notAllowedToDraw:true,
    showRandomWords:false,
    wordTobeGuessed:"",
    rightGuess:false,
    score:100
}
export const utilitySlice=createSlice({
    name:"utility",
    initialState,
    reducers:{
        togglenotAllowedToDraw:(state,action:PayloadAction<boolean>)=>{state.notAllowedToDraw=action.payload},
        toggleShowRandomWords:(state,action:PayloadAction<boolean>)=>{state.showRandomWords=action.payload},
        setWord:(state,action:PayloadAction<string>)=>{
            state.wordTobeGuessed=action.payload
        },
        setRightGuess:(state,action:PayloadAction<boolean>)=>{
            state.rightGuess=action.payload
        },
        updateScore:(state,action:PayloadAction<number>)=>{
            state.score=action.payload
        },
    }
})
export const {togglenotAllowedToDraw,toggleShowRandomWords,setWord,setRightGuess,updateScore}=utilitySlice.actions
export default utilitySlice.reducer