import React, { useEffect, useRef, useState } from "react";
import { UserContext } from "../component/UserContext";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import Avatar from "../component/Avatar";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "../component/Contact";

function ChatPage() {
  const { user, setReady, ready ,ws, setWs } = useContext(UserContext);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserID] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const divUnderMessage = useRef();
  const [offlinePeople, setOfflinePeople] = useState({});

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:4001");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  }

  useEffect(() => {
    const div = divUnderMessage.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  //receive message
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data); // text,sender,recipient,id aa badhu hase message data ma
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      console.log({ messageData });
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function sendMessage(ev) {
    ev.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
      })
    ); //convert into string
    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: user._id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
    setNewMessageText("");
  }

  if (!!user) {
    useEffect(() => {
      axios.get("/people").then((res) => {
        const offlinePeopleArr = res.data
          .filter((p) => p._id !== user.id)
          .filter((p) => !Object.keys(onlinePeople).includes(p._id));
        const offlinePeople = {};
        offlinePeopleArr.forEach((p) => {
          offlinePeople[p._id] = p;
        });
        // console.log(offlinePeople);
        setOfflinePeople(offlinePeople);
      });
    }, [onlinePeople]);
  }
  const onlinePeopleExcluOurUser = { ...onlinePeople };
  if (user) {
    delete onlinePeopleExcluOurUser[user._id];
  }

  if (!user) {
    // setTimeout(() => {
    return <Navigate to={"/login"} />;
    // }, 2000);
  }

  //In message there are duplicate so we will remove it
  const messagesWithoutDups = uniqBy(messages, "_id");
  // console.log(messagesWithoutDups);
  return (
    <>
      <div className="flex h-[88vh] ">
        <div className="bg-leftnav lg:w-1/4 md:w-1/3 ">
          {Object.keys(onlinePeopleExcluOurUser).map((userId) => (
            <>
              <Contact
              key={userId}
                userId={userId}
                username={onlinePeopleExcluOurUser[userId]}
                onClick={() => setSelectedUserID(userId)}
                selected={userId === selectedUserId}
                isOnline={true}
              />
            </>
          ))}
          {Object.keys(offlinePeople).map((userId) => (
            <>
              <Contact
              key={userId}
                userId={userId}
                username={offlinePeople[userId].name}
                onClick={() => setSelectedUserID(userId)}
                selected={userId === selectedUserId}
                isOnline={false}
              />
            </>
          ))}
        </div>
        <div className=" lg:w-3/4 md:w-2/3 p-2 flex flex-col">
          <div className="grow overflow-y-auto">
            {!selectedUserId && (
              <>
                <div className="text-white flex justify-center items-center h-full opacity-50">
                  Select person and start chatting
                </div>
              </>
            )}

            {!!selectedUserId && (
              <>
                <div>
                  {messagesWithoutDups.map((message) => (
                    <div
                      className={
                        " " +
                        (message.sender === user._id
                          ? " text-right"
                          : " text-left")
                      }
                    >
                      <div
                        className={
                          "inline-block p-2 my-1 mx-2 " +
                          (message.sender === user._id
                            ? " lg:max-w-5xl md:max-w-sm bg-blue-600 text-left text-white rounded-l-xl rounded-tr-xl"
                            : " lg:max-w-5xl md:max-w-sm bg-gray-400 text-left  rounded-r-xl rounded-bl-xl")
                        }
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={divUnderMessage}></div>
                </div>
              </>
            )}
          </div>
          {!!selectedUserId && (
            <>
              <form className="flex gap-2" onSubmit={sendMessage}>
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(ev) => {
                    setNewMessageText(ev.target.value);
                  }}
                  placeholder="Say hii..."
                  className="w-11/12 "
                />
                <button
                  type="submit"
                  className="bg-myBlue w-1/12 rounded-xl flex justify-center items-center hover:scale-95 hover:transition-all hover:duration-150"
                >
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
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatPage;
