import React from 'react'
import { Asset1 } from "@/assets";
import Styles from "@/styles/Hero.module.css"
export default function Hero() {
  return (
    <div className={Styles.mainContainer}>
    <div className={Styles.circle}>
      <span className={Styles.innerCircle}></span>
    </div>
    <h1 className={Styles.Name}>Doodle Delight</h1>
    <div className={Styles.innerContainer}>
      <div className={Styles.leftSection}>
       <p>
       DRAW & GUESS
        <br />
        2D <i className="fa-solid fa-asterisk"></i>  MULTIPLAYER GAME
       </p>
       @2024
      </div>
      <div className={Styles.rightSection}>
        <img src={Asset1.src} alt="sun" className={Styles.sun}/>
        <div className={Styles.box}>
          <span className={`${Styles.innerBox} ${Styles.c1}`}></span>
        </div>
        <div className={Styles.box}>
          <span className={`${Styles.innerBox} ${Styles.c2}`}></span>
        </div>
        <div className={Styles.box}>
          <span className={`${Styles.innerBox} ${Styles.c3}`}></span>
        </div>
        <a href='#join' className={Styles.playBtn}>Play now &nbsp;<i className="fa-solid fa-play "></i></a>
      </div>
    </div>
  </div>
  )
}
