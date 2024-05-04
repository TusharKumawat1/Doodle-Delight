"use client";
import React, { useEffect, useState } from "react";
import Styles from "./page.module.css";
import { socket } from "@/app/socket";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addMemberToRoom } from "@/redux/room/roomSlice";
import dynamic from "next/dynamic";
import StartRound from "@/components/StartRound";
import WorsdOverlay from "@/components/WorsdOverlay";
import { RootState } from "@/redux/store";
import {
  setRightGuess,
  toggleShowRandomWords,
  togglenotAllowedToDraw,
} from "@/redux/utils/utilitySlice";
import { toast } from "react-toastify";
const Canvas = dynamic(() => import("@/components/Canvas"), { ssr: false });
const ChatBox = dynamic(() => import("@/components/ChatBox"), { ssr: false });
const ScoreBoard = dynamic(() => import("@/components/ScoreBoard"), {
  ssr: false,
});
let userId = "";
export default function Page() {
  const [ShowRound, setShowRound] = useState(false);

  const [Round, setRound] = useState(0);
  const User = useSelector((state: RootState) => state.user);
  const showRandomWords = useSelector(
    (state: RootState) => state.utility.showRandomWords
  );
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    socket.on("users", (data) => {
      dispatch(addMemberToRoom(data));
    });
    if (typeof window !== "undefined") {
      userId = localStorage.getItem("userId")!;
    }
    if (!userId) {
      router.push("/");
    }
    window.addEventListener("beforeunload", () => {
      socket.emit("removeUser", userId);
      localStorage.removeItem("userId");
    });
    window.addEventListener("popstate", () => {
      socket.emit("removeUser", userId);
      localStorage.removeItem("userId");
    });
  }, []);
  useEffect(() => {
    socket.on("userExit", (data) => dispatch(addMemberToRoom(data)));
    socket.on("getRound", (data) => {
      setShowRound((p) => true);
      setRound((p) => data);
      setTimeout(() => {
        setShowRound((p) => false);
      }, 1000);
    });
  }, []);
  useEffect(() => {
    socket.on("currentlyGuessing", (data) => {
      dispatch(togglenotAllowedToDraw(true));
      dispatch(setRightGuess(false))
      if (User.userId === data.userId) {
        setTimeout(() => dispatch(toggleShowRandomWords(true)), 1000);

        dispatch(togglenotAllowedToDraw(false));
        setTimeout(() => dispatch(toggleShowRandomWords(false)), 11000);
      }
    });
  }, []);
  useEffect(()=>{
      socket.on("winnerIs",data=>{
        toast(`${data.username} is winner`)
      })
  },[])
  return (
    <div className={Styles.container}>
      <div className={Styles.innerContainer}>
        <div className={Styles.box}>
          <span className={Styles.innerBox}></span>
        </div>
        <div className={Styles.box}>
          <span className={Styles.innerBox}></span>
        </div>
        <div className={Styles.box}>
          <span className={Styles.innerBox}></span>
        </div>
        <div className={Styles.box}>
          <span className={Styles.innerBox}></span>
        </div>
        <ScoreBoard />
        <Canvas />
        <ChatBox />
      </div>
      {ShowRound && <StartRound round={Round} />}
      {showRandomWords && <WorsdOverlay />}
    </div>
  );
}
