import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/index.js";
import { JWT_SECRET } from "../utils/config.js";

export default function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new UnauthorizedError("Authorization required"));
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid token"));
  }
}
