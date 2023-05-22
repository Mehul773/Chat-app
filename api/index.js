const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const user = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
let path = require('path');

//--------------------------------------------------------------------------
const app = express();
app.listen(4001);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGOURL);
const bcryptSalt = bcrypt.genSaltSync(10);

//---------------------------------------------------------------------------
// functions

//----------------------------------------------------------------------------
//Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await user.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      photo:'',
    });
    res.json({ userDoc, message: "register successfull" });
  } catch (e) {
    console.log(e + " -> From index.js");
    res.status(422).json(e);
  }
});

//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await user.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // res.json({message:'pass ok'});
      jwt.sign(
        { email: userDoc.email, id: userDoc._id, name: userDoc.name },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res
            .cookie("token", token, {
              expires: new Date(Date.now() + 86400000),
              httpOnly: true,
            })
            .json({ userDoc, message: "pass ok" });
        }
      );
    } else {
      res.json({ message: "pass not ok" });
    }
  } else {
    res.json({ message: "not found" });
  }
});

//For userContextProvider
app.get("/getUserDetails", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id ,photo} = await User.findById(userData.id);
      res.json({ name, email, _id ,photo});
    });
  } else {
    return res.json(null);
  }
});

//Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token").json("clear cookie");
});

//User profile photo upload
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
      const userDoc = await User.findById(userData.id);
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