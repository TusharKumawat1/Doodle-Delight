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
type BrushType = {
  color: string;
  radius: number;
};
export default function Page() {
  const AllMembers = useSelector((state:RootState)=>state.room.allMembers)
  const dispatch=useDispatch()
  const arr = ["Tushar", "Alok", "Amit", "Gulshan"];
  const [brush, setBrush] = useState<BrushType | undefined>();
  const CanvasRef = useRef<CanvasDraw>(null);
  const roomId = useSelector((state: RootState) => state.room.roomId);
  const router=useRouter()
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
      socket.on("users", (data) =>{
        dispatch(addMemberToRoom(data))
      });
    
    const userId=localStorage.getItem("userId")
    if (!userId) {
      router.push("/")
    }
     window.addEventListener("beforeunload",()=>{
      socket.emit("removeUser",userId)
      localStorage.removeItem("userId")
     })
  }, []);
  useEffect(()=>{
    socket.on("userExit",data=>  dispatch(addMemberToRoom(data)))
  },[])
  return (
    <div className={Styles.container}>
      <h1>Doodle Delight </h1>
      <div className={Styles.scoreBoard}>
        <p>Scoreboard</p>
        {AllMembers && AllMembers.map((user:UserType, index) => {
          return (
            <div
              key={index}
              className={`${Styles.player} ${
                index % 2 === 0 ? Styles.pink : Styles.yellow
              }`}
            >
             <div className={Styles.imgContainer}><img src={user.avatar} alt={`useravatar${user.userId}`} width={40}/></div> {user?.username}
            </div>
          );
        })}
      </div>
      <div className={Styles.canvasContainer}>
        <CanvasDraw
          onChange={hc}
          ref={CanvasRef}
          hideGrid={true}
          canvasWidth={800}
          canvasHeight={500}
          brushColor={brush?.color}
          brushRadius={brush?.radius}
        />
      </div>
      <div className={Styles.utils}>
        <p>Tools</p>
        <div className={Styles.tools}>
          <div className={Styles.buttonContainer}>
            <button onClick={Undo}>
              Undo <i className="fa-solid fa-rotate-left"></i>
            </button>
            <button onClick={Clear}>
              Clear <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
          <div className={Styles.BrushSize}>
            <i className="fa-solid fa-paintbrush"></i>
            <button onClick={() => changeBrushSpecs(5)}></button>
            <button onClick={() => changeBrushSpecs(10)}></button>
            <button onClick={() => changeBrushSpecs(15)}></button>
            <button onClick={() => changeBrushSpecs(20)}></button>
            <button onClick={() => changeBrushSpecs(30)}></button>
          </div>
          <div className={Styles.BrushColor}>
            <span className={Styles.colorContainer}>
              Change Color
              <button
                onClick={() => changeBrushSpecs(undefined, "#FF76CE")}
              ></button>
              <button
                onClick={() => changeBrushSpecs(undefined, "#9195F6")}
              ></button>
              <button
                onClick={() => changeBrushSpecs(undefined, "#F9D949")}
              ></button>
              <button
                onClick={() => changeBrushSpecs(undefined, "#06FF00")}
              ></button>
              <label htmlFor="colorPicker">
                <img src={ColorPicker.src} alt="colorPicker" />
              </label>
              <input
                type="color"
                id="colorPicker"
                name="color"
                onChange={handleChnage}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
