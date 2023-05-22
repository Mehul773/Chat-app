import React, { useEffect, useState } from "react";
import { UserContext } from "../component/UserContext";
import { Navigate } from "react-router-dom";
import { useContext } from "react";

function ChatPage() {
  const { user, setReady, ready } = useContext(UserContext);
  const [ws, setWs] = useState(null);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4001");
    setWs(ws);
    ws.addEventListener('message',handleMessage)
  }, []);

  function handleMessage(e) {
    console.log('new message ',e);
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <div className="flex h-[88vh] ">
        <div className="bg-leftnav lg:w-1/4 md:w-1/3">Contacts</div>
        <div className=" lg:w-3/4 md:w-2/3 p-2 flex flex-col">
          <div className="grow">messages</div>
          <div className="flex gap-2">
            <input type="text" placeholder="Say hii..." className="w-11/12 " />
            <button className="bg-myBlue w-1/12 rounded-xl flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
