const mongoose = require("mongoose");
const { Schema, model } = mongoose;

export enum UserRole {
  DEVELOPER = "Developer",
  CLIENT = "Client",
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  userRole: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.DEVELOPER    
  },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = model("User", userSchema);

export default UserModel;
