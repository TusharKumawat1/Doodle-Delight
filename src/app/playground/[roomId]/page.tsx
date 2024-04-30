"use client";
import React, { useEffect, useRef, useState } from "react";
import Styles from "./page.module.css";
import CanvasDraw from "react-canvas-draw";
import { ColorPicker } from "@/assets";
import { socket } from "@/app/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { addMemberToRoom } from "@/redux/room/roomSlice";
import { UserType } from "@/redux/user/userSlice";
import ChatBox from "@/components/ChatBox";
import ScoreBoard from "@/components/ScoreBoard";
import Canvas from "@/components/Canvas";
type BrushType = {
  color: string;
  radius: number;
};
export default function Page() {
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    socket.on("users", (data) => {
      dispatch(addMemberToRoom(data));
    });

    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/");
    }
    window.addEventListener("beforeunload", () => {
      socket.emit("removeUser", userId);
      localStorage.removeItem("userId");
    });
  }, []);
  useEffect(() => {
    socket.on("userExit", (data) => dispatch(addMemberToRoom(data)));
  }, []);
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
    </div>
  );
}
