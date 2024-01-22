import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import cors from "cors";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import serviceAccountKey from "./urblogging-web-app-firebase-adminsdk-dlxmp-d83072725f.json" assert { type: "json" };

// Schema below
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";

// server and port
const server = express();
let PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  storageBucket: "urblogging-web-app.appspot.com",
});

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

// setting up firebase storage
const bucket = admin.storage().bucket();

// function to generate upload url
const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

  const file = bucket.file(imageName);
  const [url] = await file.getSignedUrl({
    action: "write",
    expires: Date.now() + 60 * 1000,
    contentType: "image/jpeg",
  });

  return url;
};

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user.id;
    next();
  });
};

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

// route upload image
server.get("/get-upload-url", async (req, res) => {
  try {
    const url = await generateUploadURL();
    res.status(200).json({ uploadURL: url });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// route for signup
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

// route for signin
server.post("/signin", (req, res) => {
  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: "Email not found" });
      }

      if (!user.google_auth) {
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
      } else {
        return res.status(403).json({
          error: "Account was created using google. Try logging in with google",
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

// route for google auth
server.post("/google-auth", async (req, res) => {
  let { accessToken } = req.body;

  getAuth()
    .verifyIdToken(accessToken)
    .then(async (payload) => {
      let { email, name, picture } = payload;

      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({
        "personal_info.email": email,
      })
        .select(
          "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });

      if (user) {
        // signin
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "This email was signed up with google. Please log in with password to access the account",
          });
        }
      } else {
        // signup
        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email,
            username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }

      return res.status(200).json(formatDataToSend(user));
    })
    .catch((err) => {
      return res.status(500).json({
        error:
          "Failed to authenticate you with google. Try with some other google account",
      });
    });
});

server.post("/create-blog", verifyJWT, (req, res) => {
  let authorId = req.user;

  let { title, des, banner, tags, content, draft } = req.body;

  if (!title.length) {
    return res.status(403).json({ error: "Title cannot be empty" });
  }
  if (!des.length || des.length > 200) {
    return res.status(403).json({
      error: "Description cannot be empty or more than 200 characters",
    });
  }
  if (!content.blocks.length) {
    return res.status(403).json({ error: "Content cannot be empty" });
  }
  if (!tags.length || tags.length > 10) {
    return res
      .status(403)
      .json({ error: "Tags cannot be empty or more than 10 tags" });
  }

  tags = tags.map((t) => t.toLowerCase());

  let blog_id =
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid();

  let blog = new Blog({
    title,
    des,
    banner,
    tags,
    content,
    author: authorId,
    blog_id,
    draft: Boolean(draft),
  });

  blog
    .save()
    .then((blog) => {
      let incrementVal = draft ? 0 : 1;

      User.findOneAndUpdate(
        { _id: authorId },
        {
          $inc: { "account_info.total_posts": incrementVal },
          $push: { blogs: blog._id },
        }
      )
        .then((user) => {
          return res.status(200).json({ id: blog.blog_id });
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// server listening on port
server.listen(PORT, () => {
  console.log("listening on port -> " + PORT);
});
