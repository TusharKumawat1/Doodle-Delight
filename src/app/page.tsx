"use client"
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import JoinRoom from "@/components/JoinRoom";
import React, { useEffect, useState } from "react";
import { socket } from "./socket";

export default function Page() {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(()=>{
    if (socket.connected) {
      onConnect()
    }
    function onConnect(){
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  },[])
  return (
   <>
   <Hero/>
   <JoinRoom/>
   {/* <Footer/> */}
   </>
  );
}
