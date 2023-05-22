const express = require("express");
const cors = require("cors");
const { default: mongoose, connection } = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
// const user = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const user = require("./models/User");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const ws = require("ws");
const connectDB = require("./config/db");
const userroute = require("./routes/userroute");

//--------------------------------------------------------------------------
const port = process.env.PORT || 5000;
const app = express();
const server = app.listen(port, () => console.log(`Server started on ${port}`));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

connectDB();


//---------------------------------------------------------------------------

app.use("/", userroute);

//-------------------------------------------------------------------------------
//upload image
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads');
  },
  filename: function(req, file, cb) {   
      cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if(allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb(null, false);
  }
}

let upload = multer({ storage, fileFilter });
app.put('/user-photo-upload',upload.single('photo'),(req,res)=>{
  const photo = req.file.filename;
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const userDoc = await user.findById(userData.id);
      userDoc.set({
        photo,
      })
      await userDoc.save();
      res.json('Photo uploaded');
    });
  } else {
    return res.json("Upload failed");
  }


})

//----------------------------------------------------------------------------
//contacts

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      // if(token){

      // }
    }
  }
});