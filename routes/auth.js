// todo: update error handling

import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.js";
console.log("JWT_SECRET used in /signin route:", JWT_SECRET);

import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;
  console.log("📥 Received:", req.body); // <-- Add this

  if (!email || !password || !username)
    return res.status(400).send({ error: "Missing credentials" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(201)
      .send({ token, email: newUser.email, username: newUser.username });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).send({ error: "User already exists" });
    } else {
      res
        .status(500)
        .send({ error: "Internal server error", details: err.message });
    }
  }
});

// POST /signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send({ error: "Missing credentials" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).send({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).send({ error: "Invalid email or password" });

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // res.send({ token, email: user.email });
    res.send({ token, email: user.email, username: user.username });
  } catch (err) {
    res
      .status(500)
      .send({ error: "Internal server error", details: err.message });
  }
});

// router.get("/users/me", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("email");
//     if (!user) return res.status(404).send({ error: "User not found" });
//     res.send({ email: user.email });
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch user" });
//   }
// });

router.get("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("email username");
    if (!user) return res.status(404).send({ error: "User not found" });
    res.send({ email: user.email, username: user.username });
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch user" });
  }
});

export default router;
