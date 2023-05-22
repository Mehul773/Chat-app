import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {UserContext} from "../component/UserContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect,setRedirect] = useState(false);

  const {ready,user,setUser} = useContext(UserContext);

  if(user || redirect)
  {
    return <Navigate to={'/chat'}/>
  }

  async function userLogin(ev) {
    ev.preventDefault();
    if (email === "" || password === "") {
      toast.error("Please fill all fields");
    } else {
      try {
        const {data} = await axios.post(
          "/login",
          {
            email,
            password,
          },
          { withCredentials: true }
        );
        if(data.message==="pass ok")
        {
          toast.success('Login successfull')
          console.log(data);
          console.log(data.userDoc);
          setUser(data.userDoc.name)
          console.log(user);
          setRedirect(true);
        }
        if(data.message==='pass not ok')
        {
          toast.error("Password is incorrect");
        }
        if(data.message==='not found')
        {
          toast.error("User not found");
        }
        
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <form onSubmit={userLogin}>
        <div className="flex justify-center items-center h-[44rem] ">
          <div className="bg-secondary px-10 py-6  rounded-2xl w-[450px] flex flex-col gap-3 justify-center items-center">
            <div className="text-3xl text-white">Login</div>
            <div className=" w-full text-white flex flex-col gap-2">
              Your email
              <input
                value={email}
                onChange={(ev) => {
                  setEmail(ev.target.value);
                }}
                type="email"
                name="email"
                placeholder="abc123@gmail.com"
              />
            </div>
            <div className=" w-full  text-white flex flex-col gap-2">
              Your password
              <input
                value={password}
                onChange={(ev) => {
                  setPassword(ev.target.value);
                }}
                type="password"
                name="password"
                placeholder="Password"
              />
            </div>
            <button className="mt-3 myBtn text-white hover:scale-95 hover:transition-all duration-75">
              Login
            </button>
            <div className="text-white">
              Don't have an account yet?{" "}
              <Link to={"/register"} className="text-myBlue">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default LoginPage;
