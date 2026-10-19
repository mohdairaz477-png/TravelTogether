
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/user.model";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

dotenv.config({ path: "backend/.env" });

async function createAdmin() {
  const rl = readline.createInterface({ input, output });

  try {
    const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();

    if (!email || !process.env.MONGO_URI) {
      throw new Error("ADMIN_EMAIL or MONGO_URI is missing.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists. No changes made.");
      return;
    }

    const name = "Mohd Airaz";
    const password = await rl.question(
      "Create admin password (minimum 8 characters): "
    );

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const username = email.split("@")[0];

    await User.create({
      name,
      username,
      email,
      password: await bcrypt.hash(password, 12),
      verified: true,
    });

    console.log("Admin user created successfully.");
    console.log("Email:", email);
    console.log("Name:", name);
  } catch (error) {
    console.error(
      "Admin creation failed:",
      error instanceof Error ? error.message : error
    );
    process.exitCode = 1;
  } finally {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  }
}

createAdmin();
