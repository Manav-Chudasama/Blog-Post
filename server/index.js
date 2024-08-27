const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const bodyParser = require('body-parser')
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const jwt_secret = process.env.JWT_SECRET;

const app = express();

app.use(express.json());
app.use(cors());

// Increase the payload size limit
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("Error connecting", err));

require("./UserDetails");
require("./Posts");

const user = new mongoose.model("Users");
const posts = new mongoose.model("Posts");

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }
    if (await user.findOne({ username })) {
      return res.status(400).json({ message: "Username already exists" });
    }
    if (await user.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const encryptedPassword = await bcrypt.hash(password, 1);

    await user.create({
      username,
      email,
      password: encryptedPassword,
    });
    const token = jwt.sign({ username }, jwt_secret);
    return res
      .status(201)
      .json({ message: "User registered successfully", data: token });
    console.log(username, email, password);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username and password" });
    }
    const UserDetails = await user.findOne({ username });
    if (!UserDetails) {
      return res.status(400).json({ message: "Invalid username" });
    }
    const isMatch = await bcrypt.compare(password, UserDetails.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ username }, jwt_secret);
    return res
      .status(200)
      .json({ message: "Logged in successfully", data: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/user", async (req, res) => {
  const { token } = req.body;

  try {
    const userInfo = jwt.verify(token, jwt_secret);
    console.log(userInfo);
    await user
      .findOne({ username: userInfo.username })
      .then((user) => {
        // console.log(user)
        return res.status(200).json({ message: "details fetched", data: user });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Something went wrong in userdetails",
        });
      });
  } catch (error) {
    console.log(error);
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

app.post("/create-post", upload.single("image"), async (req, res) => {
  const { title, content, token } = req.body;
  const userInfo = jwt.verify(token, jwt_secret);

  const img = req.file ? req.file.path : null;

  console.log(title, content, img, userInfo.username);

  // if (!title) {
  //     return res.status(400).json({ message: "Please provide title" });
  // }

  try {
    await posts.create({
      author: userInfo.username,
      title,
      content,
      image: img,
    });
    // await posts.save();
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    return res
      .status(201)
      .json({ message: "Post created successfully", data: img });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/quick-post", async (req, res) => {
  const { token, content } = req.body;
  const userInfo = jwt.verify(token, jwt_secret);

  try {
    await posts.create({
      author: userInfo.username,
      title: "",
      content,
      image: null,
    });

    return res
      .status(201)
      .json({ message: "quick Post created successfully", data: content });
  } catch (error) {
    console.log(error);
  }
});

app.get("/posts", async (req, res) => {
  try {
    const allPosts = await posts.find({});
    return res
      .status(200)
      .json({ message: "Posts fetched successfully", data: allPosts });
  } catch (error) {
    console.log(error);
  }
});

app.post("/userPosts", async (req, res) => {
  const { token } = req.body;
  const userInfo = jwt.verify(token, jwt_secret);

  const username = userInfo.username;

  try {
    const allPosts = await posts.find({ author: username });
    res
      .status(200)
      .json({ messages: "all posts", data: allPosts, userInfo: username });
  } catch (error) {
    console.log(error);
  }
});

app.listen(4000);
console.log("listening...");
