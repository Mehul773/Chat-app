const express = require("express");
const cors = require("cors");
const { default: mongoose, connection } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const ws = require("ws");
const connectDB = require("./config/db");
const userroute = require("./routes/userroute");
require("dotenv").config();
const Message = require("./models/Message");

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
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });
app.put("/user-photo-upload", upload.single("photo"), (req, res) => {
  const photo = req.file.filename;
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const userDoc = await User.findById(userData.id);
      userDoc.set({
        photo,
      });
      await userDoc.save();
      res.json("Photo uploaded");
    });
  } else {
    return res.json("Upload failed");
  }
});

//----------------------------------------------------------------------------

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {

  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer =  setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer)
      connection.terminate();
      notifyAboutOnlinePeople()
      console.log("death");
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });
  //read name and id from the cookie for this coonection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
          if (err) throw err;
          const { id, name } = userData;
          connection.username = name;
          connection.userId = id;
        });
      }
    }
  }

  //notify everyone about online people (when someone connect)
  notifyAboutOnlinePeople()

  //user pasethi message ane message kone mokal vano (recipient) 6e te lye ane bija user ne mokale
  //message bija user ne mokalva
  connection.on("message", async (message) => {
    messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;
    if (recipient && text) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
      });
      [...wss.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) => {
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              _id: messageDoc._id,
            })
          );
        });
    }
  });
});

