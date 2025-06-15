import jwt from "jsonwebtoken";

import { UnauthorizedError } from "../errors/index.js";
import { JWT_SECRET } from "../utils/config.js";

export default (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Invalid token"));
  }

  req.user = { _id: payload._id };
  return next();
};
