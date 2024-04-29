"use client";
import React, { useEffect, useState } from "react";
import Styles from "@/styles/joinRoom.module.css";
import { Asset1, Avatar1, Avatar2, Avatar3, Avatar4 } from "@/assets";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/user/userSlice";
import { socket } from "@/app/socket";
import { addMemberToRoom } from "@/redux/room/roomSlice";
type PayLoadType = {
  username: string;
  roomId: string;
  userId: string;
  avatar: string;
};
export default function JoinRoom() {
  const User = useSelector((state: RootState) => state.user);
  const [Avatar, setAvatar] = useState(Avatar1);
  const [PayLoad, setPayLoad] = useState<PayLoadType>({
    username: "",
    roomId: "",
    userId: localStorage.getItem("userId") || "",
    avatar: Avatar1.src,
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const changeAvatar = () => {
    let avatarArr = [Avatar1, Avatar2, Avatar3, Avatar4];
    let index = Math.floor(Math.random() * avatarArr.length);
    while (Avatar === avatarArr[index]) {
      index = Math.floor(Math.random() * avatarArr.length);
    }
    setAvatar(avatarArr[index]);
    let obj=PayLoad
    PayLoad.avatar=avatarArr[index].src
    setPayLoad(obj)
  };
  function makeid(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$&";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  const generateRoomId = () => {
    setPayLoad((p) => ({
      ...p!,
      roomId: makeid(10),
    }));
  };
  const handleONchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPayLoad((p) => ({
      ...p!,
      [name]: value,
    }));
  };
  const GoToPlayground = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!PayLoad.userId) {
      let userId = makeid(5);
      localStorage.setItem("userId", userId);
      let obj = PayLoad;
      obj.userId = userId;
      setPayLoad(obj);
    }
    dispatch(
      setUser({
        username: PayLoad?.username!,
        roomId: PayLoad?.roomId!,
        avatar: Avatar.src!,
        userId:PayLoad.userId,
      })
    );
    socket.emit("joinRoom", PayLoad);
    socket.on("users", (data) => {
      dispatch(addMemberToRoom(data));
    });

    router.push(`/playground/${PayLoad?.roomId}`);
  };

  return (
    <div id="join" className={Styles.container}>
      <div className={Styles.firstSection}>
        <h1 className={Styles.heading}>Begin the Game</h1>
        <p>Join an Existing Group or Create a New One</p>
        <div className={Styles.box1}>
          <span className={`${Styles.innerBox} ${Styles.c1}`}></span>
        </div>
        <div className={Styles.box2}>
          <span className={`${Styles.innerBox}`}></span>
        </div>
        <div className={Styles.box3}>
          <span className={`${Styles.innerBox}`}></span>
        </div>
        <div className={Styles.box4}>
          <span className={`${Styles.innerBox}`}></span>
        </div>
      </div>
      <form className={Styles.secondSection} onSubmit={GoToPlayground}>
      <div className={Styles.imageContainer}>
      <img src={Avatar.src} alt="Avatar" className={Styles.Avatar} />
      </div>
        <button type="button" className={Styles.avatarBtn} onClick={changeAvatar}>
          <i className="fa-solid fa-dice"></i>
        </button>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className={Styles.userInput}
          value={PayLoad?.username}
          onChange={handleONchange}
          required={true}
        />
        <input
          type="text"
          name="roomId"
          placeholder="Romm ID"
          className={Styles.roomId}
          value={PayLoad?.roomId}
          onChange={handleONchange}
          required={true}
          minLength={10}
        />
        <p>
          Create Room |{" "}
          <button
            type="button"
            onClick={generateRoomId}
            className={Styles.idBtn}
          >
            Generate Room ID
          </button>
        </p>
        <button type="submit" className={Styles.joinBtn}>
          Join
        </button>
        <img src={Asset1.src} alt="sun" className={Styles.sun} />
      </form>
    </div>
  );
}
