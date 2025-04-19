import express , {RequestHandler} from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import authMiddleware from "../middlewares/authMiddleware";

interface LoginRequestBody {
  username: string;
  password: string;
}

router.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    try {
      console.log("Register endpoint hit", req.body);
      const {
        username,
        password,
        email,
        isAdmin,
        profilePicture,
        bio,
        createdAt,
      } = req.body;
      // Perform registration logic here (e.g., save user to database)
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = {
        username,
        password: hashedPassword,
        email,
        isAdmin,
        profilePicture,
        bio,
        createdAt,
      };

      const createdUser = await UserModel.create(newUser);
      res
        .status(201)
        .json({ message: "User registered successfully", user: createdUser });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
    }
  }
);

const loginHandler: RequestHandler<{}, {}, LoginRequestBody> = async (req, res) => {
  try {
    const { username, password } = req.body;    
    // Request body validation

    if (typeof username !== 'string' || typeof password !== 'string') {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }
    // Check if username and password are provided
    if (!username || !password) {
      res.status(400).json({ message: "Username and Password are required" });
      return;
    } else {
      const user = await UserModel.findOne({ username });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      if (!process.env.TOKEN_SECRET) {
        res.status(500).json({ message: "Token secret not set" });
        return;
      }
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
      
      res.status(200).json({ message: "Login successful", token, user });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
    return;
  }
};

router.post("/login", loginHandler);

router.get("/verify", authMiddleware, async (req, res) => {
  res.status(200).json({
    message: "User verified",
    user: req.user,
})
})


export default router;
