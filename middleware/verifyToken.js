import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.better - auth.session_token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.BETTER_AUTH_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
