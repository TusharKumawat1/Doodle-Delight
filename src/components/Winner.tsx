import React from 'react'
import Styles from "@/styles/winner.module.css"
import { Avatar2, Celebration } from '@/assets'
export type winnerType={
   username:string;
   pfp:string;
}
export default function Winner(props:winnerType) {
  return (
    <div className={Styles.container}>
      <img src={props.pfp} alt=""  width={150}/>
      <h1>{props.username} is winner</h1>
      <img src={Celebration.src} alt="Celebration" />
    </div>
  )
}
