
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/user.model";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

dotenv.config();

async function resetPassword() {
  const rl = readline.createInterface({ input, output });

  try {
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();

    if (!email || !process.env.MONGO_URI) {
      throw new Error("ADMIN_EMAIL or MONGO_URI is missing in backend/.env");
    }

    const password = await rl.question("Enter your new admin password (minimum 8 characters): ");

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error(`No user found for configured admin email: ${email}`);
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    console.log("Admin password reset successfully.");
  } catch (error) {
    console.error("Password reset failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  }
}

resetPassword();
