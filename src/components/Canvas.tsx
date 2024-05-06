"use client";
import React, { useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import Styles from "../styles/canvas.module.css";
import { ColorPicker } from "@/assets";
import { socket } from "@/app/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import {
  setAllowedToGuess,
  setWord,
  updateScore,
} from "@/redux/utils/utilitySlice";
type BrushType = {
  color: string;
  radius: number;
};
type wordType = {
  word: string;
  active: boolean;
};
export default function Canvas() {
  const Allusers = useSelector((state: RootState) => state.room.allMembers);
  const UserId = useSelector((state: RootState) => state.user.userId);
  const rightGuess = useSelector(
    (state: RootState) => state.utility.rightGuess
  );
  const wordTobeGuessed = useSelector(
    (state: RootState) => state.utility.wordTobeGuessed
  );
  const notAllowedToDraw = useSelector(
    (state: RootState) => state.utility.notAllowedToDraw
  );
  const [time, settime] = useState(60);
  const [admin, setAdmin] = useState(false);
  const [active, setactive] = useState(false);
  const [done, setDone] = useState(false);
  const [syncData, setSyncData] = useState("");
  const [brush, setBrush] = useState<BrushType | undefined>();
  const CanvasRef = useRef<CanvasDraw>(null);
  const toolBoxRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [word, setword] = useState<wordType>({
    word: "",
    active: false,
  });
  const dispatch = useDispatch();
  //Brush adjustments
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

  //Handling Canvas drawing and sharing to other users
  const handleChange = () => {
    if (CanvasRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        let data = CanvasRef.current!.getSaveData();
        socket.emit("draw", data);
      }, 300);
    }
  };
  //Toggling Adjustmet box for canvas
  const toggleBox = () => {
    setactive((p) => !p);
  };

  //Game logic
  const users = [...Allusers];
  const UserTurn = async () => {
    //Itrate every user for completing rounds
    for (let player = 0; player < users.length; player++) {
      socket.emit("userWhoGuess", users[player]);
      await new Promise((resolve) => setTimeout(resolve, 70000));
    }
  };
  const newRound = async () => {
    // 3 Rounds
    for (let round = 1; round <= 3; round++) {
      socket.emit("startRound", round);
      await UserTurn();
    }
    //  Indicating the Game is over
    setDone(true);
  };

  // Start The Game When Admin Click On Statr Button
  const startGame = () => {
    if (Allusers.length <= 1) {
      toast.warn("Need at least two players");
    } else {
      setAdmin((p) => false);
      newRound();
    }
  };
  //Sending winner details to all user in a room
  function winner() {
    socket.emit("winner", Allusers[0]);
  }

  //Setting Admin
  useEffect(() => {
    if (Allusers[0].userId === UserId) {
      setAdmin((p) => true);
    }
  }, []);

  //Handle toggle box logic
  useEffect(() => {
    if (toolBoxRef.current) {
      if (active) {
        toolBoxRef.current.style.opacity = `1`;
      } else {
        toolBoxRef.current.style.opacity = `0`;
      }
    }
  }, [active]);
  useEffect(() => {
    socket.on("loadData", (data) => {
      setSyncData(data);
    });
  }, []);

  // Syncing all users canvas
  useEffect(() => {
    try {
      if (CanvasRef.current) {
        if (syncData) {
          CanvasRef.current.loadSaveData(syncData, true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [syncData]);

  // Word Gussing Logic
  useEffect(() => {
    let userID = "";
    // Reseting all details when newuser is guessing
    socket.on("currentlyGuessing", (data) => {
      userID = data.userId;
      Clear();
      dispatch(setAllowedToGuess(true));
    });

    // Showing  Random words to select
    socket.on("guessTheWord", (data) => {
      settime(60);
      dispatch(setWord(data));
      // If Current user guess the word the show is other wise hide it
      //Only the person who select the word can see the word
      let emptySpace = Array.from(data).fill("_");
      if (UserId === userID) {
        setword((p) => ({
          ...p,
          active: true,
          word: data,
        }));
      } else {
        setword((p) => ({
          ...p,
          active: true,
          word: emptySpace.toString().replaceAll(",", " "),
        }));
      }
    });
  }, []);

  //If user guess the word correctly showing the word to it
  useEffect(() => {
    if (rightGuess) {
      setword((p) => ({
        ...p,
        active: true,
        word: wordTobeGuessed!,
      }));
    }
  }, [rightGuess]);

  //Decreasing time for a guess
  useEffect(() => {
    //triggring time
    const interverl = setInterval(() => {
      settime((p) => p - 1);
    }, 1000);
    return () => {
      clearInterval(interverl);
    };
  }, []);

  //Updating score based on time
  useEffect(() => {
    if (time === 0) {
      setword((p) => ({ ...p, active: false }));
      dispatch(updateScore(100));
    }
    if (time >= 50 && time <= 60) {
      dispatch(updateScore(80));
    } else if (time >= 40 && time <= 50) {
      dispatch(updateScore(50));
    } else if (time > 0 && time <= 30) {
      dispatch(updateScore(30));
    }
  }, [time]);

  //If game done shoing winner
  useEffect(() => {
    if (done) {
      winner();
    }
  }, [done]);

  return (
    <div className={Styles.canvasContainer}>
      {word.active && <div className={Styles.word}>{<p>{word.word}</p>}</div>}
      {word.active && (
        <div className={Styles.time}>
          <i className="fa-regular fa-clock"> </i> {time}
        </div>
      )}
      <div className={Styles.innerContainer}>
        <CanvasDraw
          onChange={handleChange}
          ref={CanvasRef}
          hideGrid={true}
          canvasWidth={1800}
          canvasHeight={1800}
          brushColor={brush?.color}
          brushRadius={brush?.radius}
          disabled={notAllowedToDraw}
        />
      </div>
      {admin && (
        <button type="button" className={Styles.startBtn} onClick={startGame}>
          Start
        </button>
      )}
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
