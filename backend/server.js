import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";

// Schema below
import User from "./Schema/User.js";

// server and port
const server = express();
let PORT = 3000;

// regex for email and password
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// middleware
server.use(express.json());
server.use(cors());

// connecting to database
mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

// function to format data to send
const formatDataToSend = (user) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    accessToken,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// function to generate username
const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let usernameExists = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  usernameExists ? (username += nanoid().substring(0, 5)) : "";

  return username;
};

// route for signing up
server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;

  // validating the data from frontend
  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be at least 3 characters long" });
  }
  if (!email.length) {
    return res.status(403).json({ error: "Email cannot be empty" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is not valid" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password should be between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter",
    });
  }

  bcrypt.hash(password, 10, async (err, hashPassword) => {
    let username = await generateUsername(email);

    let user = new User({
      personal_info: {
        fullname,
        email,
        username,
        password: hashPassword,
        username,
      },
    });

    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDataToSend(u));
      })
      .catch((err) => {
        if (err.code == 11000) {
          return res.status(500).json({ error: "Email already exists" });
        }

        return res.status(500).json({ error: err.message });
      });
  });
});

// route for signing in
server.post("/signin", (req, res) => {
  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: "Email not found" });
      }

      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res
            .status(403)
            .json({ error: "Error occured while login please try again" });
        }

        if (!result) {
          return res.status(403).json({ error: "Incorrect password" });
        } else {
          return res.status(200).json(formatDataToSend(user));
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

// server listening on port
server.listen(PORT, () => {
  console.log("listening on port -> " + PORT);
});
