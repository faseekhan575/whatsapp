import {createSlice} from "@reduxjs/toolkit";

const infos=createSlice({
    name:"data",
    initialState:{
        imageurl:"",
        name:"",
        userid:""
    },
    reducers:{
        imageurl:(state,action)=>{
            state.imageurl=action.payload
        },
        name:(state,action)=>{
            state.name=action.payload
        },
        userid:(state,action)=>{
            state.userid=action.payload
        }     
    }
})

export const {imageurl,name,userid}=infos.actions

export {infos}