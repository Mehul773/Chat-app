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
} = require("../controller/userController");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/getUserDetails", userContextProvider);
router.post("/logout", userLogout);
// router.post("/user-photo-upload",upload.single("photo"),userPhotoUpload)

//User profile photo upload
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
router.post("/user-photo-upload",upload.single("photo"), (req, res) => {
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

module.exports = router;
