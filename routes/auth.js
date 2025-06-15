/* eslint-disable no-underscore-dangle */

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { JWT_SECRET } from "../utils/config.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).send({
      token,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).send({ error: "Incorrect email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({ error: "Incorrect email or password" });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.send({
      token,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/users/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    return res.send({
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
