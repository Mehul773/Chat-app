const { default: mongoose, connection } = require("mongoose");
const user = require("../models/User");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");
const express = require("express");
const router = express.Router();

const {
  userLogout,
  userContextProvider,
  userLogin,
  userRegister,
  getUserMessage,
  getAllPeople,
} = require("../controller/userController");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/getUserDetails", userContextProvider);
router.post("/logout", userLogout);
router.get("/messages/:userId", getUserMessage);
router.get("/people", getAllPeople);

module.exports = router;
