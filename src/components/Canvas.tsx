import React, { useRef, useState } from 'react'
import CanvasDraw from 'react-canvas-draw';
import Styles from "../styles/canvas.module.css"
import { ColorPicker } from '@/assets';
type BrushType = {
    color: string;
    radius: number;
  };
export default function Canvas() {
    const [brush, setBrush] = useState<BrushType | undefined>();
    const CanvasRef = useRef<CanvasDraw>(null);
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
    
    return (
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
  )
}
