import React, { useContext } from "react";
import { Link } from "react-router-dom";
import * as myConst from "../myConst";
import { UserContext } from "./UserContext";

function Header() {
  const { user, ready } = useContext(UserContext);

  if (!ready) {
    return null; // Render nothing until the user data is ready
  }

  return (
    <div>
      <header className="flex justify-between items-center bg-[#1E2837] p-5 text-2xl">
        <Link
          to={"/"}
          className="flex mx-7 gap-4 justify-center items-center text-myBlue text-3xl hover:opacity-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-9 h-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
          QuickChat
        </Link>
        <div className="text-white flex justify-center items-center gap-6 ">
          <Link to={'/chat'} className="text-myBlue text-3xl hover:opacity-90 cursor-pointer">
          Chat
          </Link>
          {!user && (
          <>
            <div className="flex gap-4 mx-7">
              <Link
                to={"/login "}
                className="text-white hover:text-myBlue hover:transition-all hover:duration-200 "
              >
                Login
              </Link>
              <Link
                to={"/register "}
                className="text-white hover:text-myBlue hover:transition-all hover:duration-200 "
              >
                Sign up
              </Link>
            </div>
          </>
        )}
        {user && (
          <>
            <Link to={"/profile"} className="cursor-pointer flex gap-4 items-center justify-center border  border-gray-400  py-1 px-2 rounded-full">
              {!!user.photo && (
                <>
                  <img
                    className=" aspect-square object-cover rounded-full max-h-[3rem]"
                    src={myConst.BACKEND_URL + "uploads/" + user.photo}
                  />
                </>
              )}
              {!user.photo && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="Blue"
                    className=" rounded-full w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </>
              )}
              <div  className="text-white pr-4">
                {user.name}
              </div>
            </Link>
          </>
        )}
        </div>
        
      </header>
    </div>
  );
}

export default Header;
