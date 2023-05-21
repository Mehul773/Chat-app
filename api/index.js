const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const user = require("./models/User");
const jwt = require("jsonwebtoken");

//--------------------------------------
const app = express();
app.listen(4001);
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGOURL);
const bcryptSalt = bcrypt.genSaltSync(10);

//--------------------------------------

//Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await user.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({userDoc,message:'register successfull'});
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
            .json({userDoc,message:'pass ok'});
        }
      );
    } else {
      res.json({ message: "pass not ok" });
    }
  } else {
    res.json({ message: "not found" });
  }
});
