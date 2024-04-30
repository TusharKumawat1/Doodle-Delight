"use client";
import React, { useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import Styles from "../styles/canvas.module.css";
import { ColorPicker } from "@/assets";
import { socket } from "@/app/socket";
type BrushType = {
  color: string;
  radius: number;
};
export default function Canvas() {
  const [active, setactive] = useState(false);
  const [syncData, setSyncData] = useState("");
  const [brush, setBrush] = useState<BrushType | undefined>();
  const CanvasRef = useRef<CanvasDraw>(null);
  const toolBoxRef = useRef<HTMLDivElement | null>(null);
  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrush((p) => ({
      ...p!,
      color: e.target.value,
    }));
  };
  const handleRadius = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrush((p) => ({
      ...p!,
      radius: Number(e.target.value),
    }));
  };
  const changeBrushSpecs = (color: string) => {
    setBrush((p) => ({
      ...p!,
      color: color!,
    }));
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
  const handleChange = () => {
    const interval = setInterval(() => {
      if (CanvasRef.current) {
        let data = CanvasRef.current.getSaveData();
        socket.emit("draw", data);
      }
      return () => clearInterval(interval);
    }, 100);
  };
  const toggleBox = () => {
    setactive((p) => !p);
  };
  useEffect(() => {
    if (toolBoxRef.current) {
      if (active) {
        toolBoxRef.current.style.width = `100%`;
        toolBoxRef.current.style.opacity = `1`;
      } else {
        toolBoxRef.current.style.width = `0%`;
        toolBoxRef.current.style.opacity = `0`;
      }
    }
  }, [active]);
  useEffect(() => {
    socket.on("loadData", (data) => {
      setSyncData(data);
    });
  }, []);
  useEffect(() => {
    try {
      if (CanvasRef.current) {
        if (syncData) {
          CanvasRef.current.loadSaveData(syncData, true);
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [syncData]);
  return (
    <div className={Styles.canvasContainer}>
      <div className={Styles.innerContainer}>
        <CanvasDraw
          onChange={handleChange}
          ref={CanvasRef}
          hideGrid={true}
          canvasWidth={1800}
          canvasHeight={1800}
          brushColor={brush?.color}
          brushRadius={brush?.radius}
        />
      </div>
      <div className={Styles.toolsContainer}>
        <button type="button" className={Styles.tools} onClick={toggleBox}>
          <i className="fa-solid fa-palette"></i>
        </button>
        <div className={Styles.toolBox} ref={toolBoxRef}>
          <div
            className={Styles.color}
            onClick={() => changeBrushSpecs("#0bc90b")}
          ></div>
          <div
            className={Styles.color}
            onClick={() => changeBrushSpecs("#FF76CE")}
          ></div>
          <div
            className={Styles.color}
            onClick={() => changeBrushSpecs("#9195F6")}
          ></div>
          <div
            className={Styles.color}
            onClick={() => changeBrushSpecs("#E21818")}
          ></div>
          <div
            className={Styles.color}
            onClick={() => changeBrushSpecs("#F0DE36")}
          ></div>
          <label htmlFor="picker">
            <img src={ColorPicker.src} alt="colorPicker" width={30} />
          </label>
          <input
            type="color"
            id="picker"
            className={Styles.picker}
            onChange={handleColor}
          />
          <div className={Styles.radius}>
            <i className="fa-solid fa-paintbrush"></i>
            <input
              type="range"
              min={1}
              max={50}
              className={Styles.brush}
              value={brush?.radius}
              onChange={handleRadius}
            />
          </div>
          <div className={Styles.btnContainer}>
            <button type="button" onClick={Undo}>
              Undo <i className="fa-solid fa-rotate-left"></i>
            </button>
            <button type="button" onClick={Clear}>
              Clear <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
