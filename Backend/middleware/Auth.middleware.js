import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const AuthUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "You are not authorized!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach the decoded user data to the request object
    next(); // Proceed to the next middleware/controller
  } catch (err) {
    console.error("Authentication Error:", err);
    return res.status(403).json({ error: "Invalid or expired token!" });
  }
};
