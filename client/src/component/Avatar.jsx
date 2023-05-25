import React from "react";

function Avatar({ userId, username, online }) {
  const colors = [
    "bg-green-300",
    "bg-yellow-300",
    "bg-purple-300",
    "bg-blue-300",
    "bg-red-300",
    "bg-teal-300",
  ];
  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  return (
    <div>
      <div
      
        className={
          "w-9 h-9  rounded-full flex items-center justify-center text-lg relative " +
          color
        }
      >
        {online && (
          <>
            {" "}
            <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border-white ">
              {" "}
            </div>
          </>
        )}
        <div className="opacity-70">{username[0]}</div>
      </div>
    </div>
  );
}

export default Avatar;
