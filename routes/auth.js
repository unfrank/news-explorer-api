import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

import auth from "../middleware/auth.js";

const router = express.Router();

// POST /signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send({ error: "Missing credentials" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).send({ message: "User created", email: newUser.email });
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

    res.send({ token, email: user.email });
  } catch (err) {
    res
      .status(500)
      .send({ error: "Internal server error", details: err.message });
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("email");
    if (!user) return res.status(404).send({ error: "User not found" });
    res.send({ email: user.email });
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch user" });
  }
});
export default router;
