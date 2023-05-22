require("dotenv").config();
const bcrypt = require("bcryptjs");
const user = require("../models/User");
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
    const userDoc = await user.create({
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
};

//For userContextProvider
const userContextProvider = async(req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id, photo } = await user.findById(userData.id);
      res.json({ name, email, _id, photo });
    });
  } else {
    return res.json(null);
  }
};

//Logout
const userLogout = (req, res) => {
  res.clearCookie("token").json("clear cookie");
};




module.exports = {
  userLogout,
  userContextProvider,
  userLogin,
  userRegister,
};
