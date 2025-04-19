import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: string | object;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Secret Key:", process.env.JWT_SECRET);
    // Step 1: Check if authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    // Step 2: Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized: Invalid token format" });
      return; // Stop further execution
    }

    if (!process.env.TOKEN_SECRET) {
      res.status(500).json({ message: "Server error: TOKEN_SECRET not set" });
      return; // Stop further execution
    }
    // Step 3: Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);

    // Step 4: Attach decoded payload to request object
    req.user = decoded;

    // Step 5: Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Step 6: Token is invalid or expired
    console.log("Here is the error:", error)
    res.status(403).json({ message: "Forbidden: Invalid token", error });
  }
};

export default authMiddleware;
