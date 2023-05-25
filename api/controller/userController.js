require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const ws = require("ws");

const { Module } = require("module");

//Register
const bcryptSalt = bcrypt.genSaltSync(10);
const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      photo: "",
    });
    res.json({ userDoc, message: "register successfull" });
  } catch (e) {
    console.log(e + " -> From index.js");
    res.status(422).json(e);
  }
};

//Login
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
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
};

//For userContextProvider
const userContextProvider = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id, photo } = await User.findById(userData.id);
      res.json({ name, email, _id, photo });
    });
  } else {
    return res.json(null);
  }
};

// Function -> Get user data from token -> return userData
async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    //function ma callback function vaparavu hoi to tene Promise ma nakhavu pade
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

//Logout
const userLogout = (req, res) => {
  res.clearCookie("token").json("clear cookie");
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
    });
  } else {
    return res.json(null);
  }
};

//get message of selected user
const getUserMessage = async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.id;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createsAt: 1 });
  res.json(messages);
};

const getAllPeople = async (req, res) => {
  const users = await User.find({},{'_id':1,name:1})
  res.json(users);
}

module.exports = {
  userLogout,
  userContextProvider,
  userLogin,
  userRegister,
  getUserMessage,
  getAllPeople,
};
