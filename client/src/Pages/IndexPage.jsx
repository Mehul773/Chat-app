import React from "react";
import { Link } from "react-router-dom";

function IndexPage() {
  return (
    <>
      <div className="flex flex-col justify-center items-center bg-grey-100 gap-6 h-screen">
        <div className="text-6xl text-white">Find your chat partner</div>
        <div className="flex gap-4 justify-center items-center ">
          <Link to={'/login'} ><button className="w-40 myBtn"> Login</button></Link>
          <Link to={'/register'} ><button className="w-40 myBtn"> Register</button></Link>
        </div>
      </div>
    </>
  );
}

export default IndexPage;
