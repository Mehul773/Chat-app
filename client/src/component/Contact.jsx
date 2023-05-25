import React from "react";
import Avatar from "./Avatar";

function Contact({selected,onClick,userId,username,isOnline}) {
  return (
    <div
      key={userId}
      onClick={() => onClick(userId)}
      className={
        "cursor-pointer flex gap-3 justify-start items-center border-b rounded-xl border-cyan-300 p-3 " +
        (selected ? " border rounded-3xl" : "")
      }
    >
      <Avatar online={isOnline} userId={userId} username={username} />
      <span className="text-white  py-2 text-xl">{username}</span>
    </div>
  );
}

export default Contact;
