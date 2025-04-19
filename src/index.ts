import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import morgan from "morgan";

dotenv.config();
// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // if using cookies/auth headers
  })
);

app.get("/", (_req: any, res: any) => {
  res.send("Hello, TypeScript with Express!");
});

import userRoutes from "./routes/user.routes";
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
