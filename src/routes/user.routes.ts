import express , {RequestHandler} from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";

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
      return res.status(400).json({ message: "Invalid request body" });
    }
    // Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and Password are required" });
    }else {
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if(!process.env.TOKEN_SECRET) {
        return res.status(500).json({ message: "Token secret not set" });
      }
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {expiresIn: '1h'});
      
      res.status(200).json({message: "Login successful", token, user });
    }


  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

router.post("/login", loginHandler);
 


export default router;
