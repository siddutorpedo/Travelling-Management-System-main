import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory or root
dotenv.config({ path: path.join(__dirname, "../../.env") });
if (!process.env.MONGO_URL) {
  dotenv.config({ path: path.join(__dirname, "../.env") });
}

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL not found in environment variables. Please check your .env file.");
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB...");

    const adminExists = await User.findOne({ username: "admin" });

    if (adminExists) {
      console.log("Admin user already exists.");
    } else {
      const hashedPassword = await bcrypt.hash("admin", 10);
      const adminUser = new User({
        username: "admin",
        email: "admin@admin.com",
        password: hashedPassword,
        address: "Admin Office",
        phone: "0000000000",
        user_role: 1,
      });

      await adminUser.save();
      console.log("Admin user created successfully!");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit();
  }
};

seedAdmin();
