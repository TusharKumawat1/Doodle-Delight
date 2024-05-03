"use client";
import { fourRandomWords } from "@/utils/RandomWords";
import React, { useEffect, useState } from "react";
import Styles from "@/styles/wordsOverlay.module.css";
import { useDispatch } from "react-redux";
import { toggleShowRandomWords } from "@/redux/utils/utilitySlice";
import { socket } from "@/app/socket";
export default function WorsdOverlay() {
  const [time, settime] = useState(10);
  const [words, setWords] = useState(fourRandomWords());
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();
  let selectedWord = "";
  const selectWord = (word: string) => {
    selectedWord = word;
    socket.emit("wordToBeGuessed", selectedWord);
    dispatch(toggleShowRandomWords(false));
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (selectedWord.length === 0 && active) {
        setActive((p) => true);
        let index = Math.floor(Math.random() * words.length);
        if (active) {
          socket.emit("wordToBeGuessed", words[index]);
        }
        dispatch(toggleShowRandomWords(false));
      }
    }, 10000);
    return () => {
      if (active) {
        setActive(false)
        clearTimeout(timeOut);
      }
    };
  }, []);

  useEffect(() => {
    const interverl = setInterval(() => {
      settime((p) => p - 1);
    }, 1000);
    return () => {
      clearInterval(interverl);
    };
  }, []);
  return (
    <div className={Styles.container}>
      <div className={Styles.time}>{time}</div>
      {words.map((word, index) => {
        return (
          <button
            type="button"
            onClick={() => selectWord(word)}
            className={Styles.word}
            key={index}
          >
            {word}
          </button>
        );
      })}
    </div>
  );
}
