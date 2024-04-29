"use client";
import React, { useEffect, useRef, useState } from "react";
import Styles from "../styles/chatBox.module.css";
import { socket } from "@/app/socket";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserType } from "@/redux/user/userSlice";
export default function ChatBox() {
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [Messages, setMessages] = useState<UserType[]>([]);
  const [content, setcontent] = useState("");
  const User=useSelector((state:RootState)=>state.user)
  const sendMessage = () => {
    const payLoad={...User,content}
    socket.emit("sendMessage", payLoad);
    setcontent("");
  };
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((p) => [...p, data]);
    });
  }, []);
  useEffect(() => {
    if (chatBoxRef.current) {
        setTimeout(() => {
            chatBoxRef.current!.scrollTop = chatBoxRef.current!.scrollHeight;
          }, 100);
    }
  }, [Messages]);
  return (
    <div className={Styles.container}>
      <div className={Styles.chats} ref={chatBoxRef}>
        {Messages&& Messages.length > 0 &&
          Messages.map((data,index) => {
            return (
              <div className={Styles.message} key={index}>
                {" "}
                <div className={Styles.pfp}>
                    <img src={data.avatar} alt={data.userId} width={30}/>
                </div>
                <div className={Styles.content} >
                    <p className={Styles.username} >{data.username}</p>
                    <p>{data.content}</p>
                </div>
              </div>
            );
          })}
      </div>
      <div className={Styles.inputContainer} >
        {" "}
        <input
          type="text"
          placeholder="type..."
          value={content}
          onChange={(e) => setcontent(e.target.value)}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />{" "}
      </div>
    </div>
  );
}
