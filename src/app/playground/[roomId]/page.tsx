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
  const AllMembers = useSelector((state: RootState) => state.room.allMembers);
  const dispatch = useDispatch();
  const arr = ["Tushar", "Alok", "Amit", "Gulshan"];
  const [brush, setBrush] = useState<BrushType | undefined>();
  const CanvasRef = useRef<CanvasDraw>(null);
  const roomId = useSelector((state: RootState) => state.room.roomId);
  const router = useRouter();
  const handleChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrush((p) => ({
      ...p!,
      color: e.target.value,
    }));
  };
  const changeBrushSpecs = (radius?: number, color?: string) => {
    if (radius) {
      setBrush((p) => ({
        ...p!,
        radius: radius!,
      }));
    }
    if (color) {
      setBrush((p) => ({
        ...p!,
        color: color!,
      }));
    }
  };
  const Undo = () => {
    if (CanvasRef.current) {
      CanvasRef.current.undo();
    }
  };
  const Clear = () => {
    if (CanvasRef.current) {
      CanvasRef.current.clear();
    }
  };
  const hc = (data: CanvasDraw) => {
    console.log(data);
  };

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
      <ScoreBoard />
      <Canvas />
      <ChatBox />
    </div>
  );
}
