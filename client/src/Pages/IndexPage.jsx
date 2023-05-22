import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../component/UserContext";

function IndexPage() {
  // const{user,ready} = useContext(UserContext)
  // if(user)
  // {
  //   return <Navigate to={'/chat'}/>
  // }
  return (
    <>
      <div className="flex flex-col justify-center items-center bg-grey-100 gap-6 h-[44rem]">
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
