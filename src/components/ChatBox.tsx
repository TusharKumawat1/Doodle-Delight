"use client";
import React, { useEffect, useRef, useState } from "react";
import Styles from "../styles/chatBox.module.css";
import { socket } from "@/app/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserType } from "@/redux/user/userSlice";
import { setAllowedToGuess, setRightGuess } from "@/redux/utils/utilitySlice";
interface MessageType extends UserType {
  content: string;
  textColor: string;
  bgColor: string;
}
export default function ChatBox() {
  const allMembers = useSelector((state: RootState) => state.room.allMembers);
  const wordTobeGuessed = useSelector(
    (state: RootState) => state.utility.wordTobeGuessed
  );
  const allowedToGuess = useSelector(
    (state: RootState) => state.utility.allowedToGuess
  );
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [Messages, setMessages] = useState<MessageType[]>([]);
  const [content, setcontent] = useState("");
  const dispatch = useDispatch();
  const User = useSelector((state: RootState) => state.user);
  const score = useSelector((state: RootState) => state.utility.score);

  //Sending messings in room to every user
  const sendMessage = () => {
    let payLoad = {};
    //if player guess the right word
    if (content === wordTobeGuessed) {
      payLoad = {
        ...User,
        content: "Guessed the Correct word",
        textColor: "#00cb00",
        bgColor: "#CFFFBD",
      };
      //Showing word to user who guess
      dispatch(setRightGuess(true));
      //sending message that user gussed the word
      socket.emit("sendMessage", payLoad);
      const userIndex = allMembers.findIndex(
        (user) => user.userId === User.userId
      );
      //giving score to the user how guess correct word
      const updatedMembers = [...allMembers];
      updatedMembers[userIndex] = {
        ...updatedMembers[userIndex],
        score: updatedMembers[userIndex].score! + score!,
      };
      //sending updated details to server
      socket.emit("newScore", updatedMembers);
      dispatch(setAllowedToGuess(false));
    } else {
      //normal chats
      payLoad = { ...User, content, textColor: "black", bgColor: "#f9f9f9" };
      socket.emit("sendMessage", payLoad);
    }
    setcontent("");
  };
  //receiving messages
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((p) => [...p, data]);
    });
  }, []);

  //scroll bottom to top logic
  useEffect(() => {
    if (chatBoxRef.current) {
      if (typeof window !== "undefined") {
        setTimeout(() => {
          chatBoxRef.current!.scrollTop &&
            (chatBoxRef.current!.scrollTop = chatBoxRef.current!.scrollHeight);
        }, 100);
      }
    }
  }, [Messages]);

  //showing message who is guessing 
  useEffect(() => {
    socket.on("currentlyGuessing", (data) => {
      let obj = data;
      obj.content = `${data.username} is guessing`;
      obj.bgColor = "#e1faff";
      setMessages((p) => [...p, obj]);
    });
  }, []);

  return (
    <div className={Styles.container}>
      <h1>Guess The Word</h1>
      <div className={Styles.chats} ref={chatBoxRef}>
        {Messages &&
          Messages.length > 0 &&
          Messages.map((data, index) => {
            return (
              <div
                className={Styles.message}
                key={index}
                style={{ backgroundColor: data.bgColor }}
              >
                {" "}
                <div className={Styles.pfp}>
                  <img src={data.avatar} alt={data.userId} width={30} />
                </div>
                <div className={Styles.content}>
                  <p className={Styles.username}>{data.username}</p>
                  <p className={Styles.msg} style={{ color: data.textColor }}>
                    {data.content}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
      <div className={Styles.inputContainer}>
        {" "}
        <input
          type="text"
          placeholder="Type your guess here..."
          value={content}
          onChange={(e) => setcontent(e.target.value)}
          disabled={!allowedToGuess}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />{" "}
      </div>
    </div>
  );
}
