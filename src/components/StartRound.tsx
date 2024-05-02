import React from 'react'
import Styles from "@/styles/wordsOverlay.module.css"
type PropsType={
    round:number
}
export default function StartRound({round}:PropsType) {
  return (
    <div className={Styles.container}>
        <p>{`Round ${round} of 3`}</p>
    </div>
  )
}
