import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: string | object;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Step 1: Check if authorization header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Step 2: Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    // Step 3: Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Step 4: Attach decoded payload to request object
    req.user = decoded;

    // Step 5: Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Step 6: Token is invalid or expired
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
