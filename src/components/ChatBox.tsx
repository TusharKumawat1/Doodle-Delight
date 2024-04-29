"use client";
import React, { useEffect, useRef, useState } from "react";
import Styles from "../styles/chatBox.module.css";
import { socket } from "@/app/socket";
export default function ChatBox() {
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [Messages, setMessages] = useState<string[]>([]);
  const [content, setcontent] = useState("");
  const sendMessage = () => {
    socket.emit("sendMessage", content);
    setcontent("");
  };
  useEffect(() => {
    socket.on("receiveMessage", (data: string) => {
      setMessages((p) => [...p, data]);
    });
  }, []);
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [Messages]);
  return (
    <div className={Styles.container}>
      <div className={Styles.chats} ref={chatBoxRef}>
        {Messages.length > 0 &&
          Messages.map((data) => {
            return (
              <div className={Styles.message} key={data}>
                {" "}
                {data}
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
