"use client"
import { fourRandomWords } from '@/utils/RandomWords'
import React from 'react'
import Styles from "@/styles/wordsOverlay.module.css"
export default function WorsdOverlay() {
  let words=fourRandomWords()
  return (
    <div className={Styles.container}>
      {
        words.map((word,index)=>{
            return <button type='button'
            className={Styles.word} key={index}>{word}</button>
        })
      }
    </div>
  )
}
