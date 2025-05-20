import express from "express";

const router = express.Router();

// POST /signup
router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  // In Stage 2, just fake it:
  if (!email || !password) {
    return res.status(400).send({ error: "Missing credentials" });
  }
  return res.status(200).send({ message: "User created", email });
});

// POST /signin
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const fakeToken = "test-jwt-123";
    return res.status(200).send({ token: fakeToken, email });
  }
  return res.status(401).send({ error: "Invalid credentials" });
});

export default router;
