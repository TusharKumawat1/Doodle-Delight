"use client"
import React, { useEffect } from 'react'
import Styles from "../styles/Scoreboard.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UserType } from '@/redux/user/userSlice';
import { socket } from '@/app/socket';
import { addMemberToRoom } from '@/redux/room/roomSlice';
export default function ScoreBoard() {
    const AllMembers = useSelector((state:RootState)=>state.room.allMembers)
    const dispatch=useDispatch()
    useEffect(()=>{
      socket.on("updateScore",data=>{
        dispatch(addMemberToRoom(data))
      })
    },[])
  return (
    <div className={Styles.scoreBoard}>
    <p>Scoreboard</p>
    {AllMembers && AllMembers.map((user:UserType, index) => {
      return (
        <div
          key={index}
          className={`${Styles.player} ${
            index % 2 === 0 ? Styles.black : Styles.yellow
          }`}
        >
         <div className={Styles.ranking}>
         <span>{`#${index + 1}`}</span>
         <div className={Styles.imgContainer}><img src={user.avatar} alt={`useravatar${user.userId}`} width={40}/></div>
         
         </div>
        <div className={Styles.userDetails}>
        <span> {user?.username}</span>
         <span>
          {user?.score}
         </span>
        </div>
        </div>
      );
    })}
  </div>
  )
}
