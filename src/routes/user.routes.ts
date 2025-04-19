import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";



router.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    try {
      console.log("Register endpoint hit", req.body);
      const { username, password, email, isAdmin, profilePicture, bio, createdAt } = req.body;
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
        createdAt
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

export default router;
