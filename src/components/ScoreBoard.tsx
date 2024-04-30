"use client"
import React from 'react'
import Styles from "../styles/Scoreboard.module.css"
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { UserType } from '@/redux/user/userSlice';
export default function ScoreBoard() {
    const AllMembers = useSelector((state:RootState)=>state.room.allMembers)
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
         <span>#1</span>
         <div className={Styles.imgContainer}><img src={user.avatar} alt={`useravatar${user.userId}`} width={40}/></div>
         
         </div>
        <div className={Styles.userDetails}>
        <span> {user?.username}</span>
         <span>100</span>
        </div>
        </div>
      );
    })}
  </div>
  )
}
