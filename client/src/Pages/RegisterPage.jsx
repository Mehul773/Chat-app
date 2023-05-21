import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(ev) {
    ev.preventDefault();
    if (email === "" || password === "" || name === "") {
      toast.error("Please fill all fields");
    } else {
      try {
        const {data} = await axios.post("/register", {
          email,
          name,
          password,
        });
        if(data.message==='register successfull')
        toast.success("Registraction Successfull");
      } catch (err) {
        console.log(err + " -> from register page");
        toast.error("Registraction failed");
      }
    }
  }
  return (
    <>
      <ToastContainer />
      <div className="flex justify-center items-center h-screen ">
        <div className="bg-secondary px-10 py-6  rounded-2xl w-[450px] ">
          <form
            onSubmit={registerUser}
            className="flex flex-col gap-4 justify-center items-center"
          >
            <div className="text-3xl text-center w-full text-white">
              Create an acoount
            </div>
            <div className=" w-96  flex flex-col gap-2 text-white">
              Your email
              <input
                type="email"
                value={email}
                onChange={(ev) => {
                  setEmail(ev.target.value);
                }}
                name="email"
                placeholder="abc123@gmail.com"
              />
            </div>
            <div className=" w-96  text-white flex flex-col gap-2">
              Your name
              <input
                type="text"
                name="name"
                value={name}
                onChange={(ev) => {
                  setName(ev.target.value);
                }}
                placeholder="Ram"
              />
            </div>
            <div className=" w-96 text-white  flex flex-col gap-2">
              Your password
              <input
                type="password"
                name="password"
                value={password}
                onChange={(ev) => {
                  setPassword(ev.target.value);
                }}
                placeholder="Password"
              />
            </div>
            <button className="mt-3 myBtn text-white hover:scale-95 hover:transition-all duration-75">
              Create an account
            </button>
            <div className="text-white">
              Already have an account?{" "}
              <Link to={"/login"} className="text-myBlue ">
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
