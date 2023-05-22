import axios from "axios";
import React, { useContext, useState } from "react";
import * as myConst from "../myConst";
import { UserContext } from "./UserContext";

function PhotoUploader() {
  // const [userPhoto, setUserPhoto] = useState("");
  const { user } = useContext(UserContext);

  async function photoHandler(ev) {
    ev.preventDefault();
    const formData = new FormData();
    formData.append("photo", ev.target.files[0]);
    axios
      .put("/user-photo-upload", formData, {
        headers: { "Content-type": "multipart/form-data" },
      }) //multer multipart formdata j samaji sake
      .then((res) => {
        alert("Photo uploaded successfully");
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      <div className="">
        <label>
          <input
            type="file"
            className="hidden cursor-pointer"
            onChange={photoHandler}
            name="img"
          />
          {user.photo && (
            <>
              <img
                src={myConst.BACKEND_URL + "uploads/" + user.photo}
                alt=""
                className="rounded-full object-cover aspect-square h-[13rem] hover:bg-black hover:opacity-70 cursor-pointer"
              />
            </>
          )}
          {!user.photo && (<>
            <img
            src={myConst.BACKEND_URL+"uploads/default.png"}
            alt=""
            className="rounded-full object-cover aspect-square h-[13rem] hover:bg-black hover:opacity-70 cursor-pointer"
          /></>)}
        </label>
      </div>
    </>
  );
}

export default PhotoUploader;
