import { connectDB } from "./config/db";

const start = async () => {
  await connectDB();
  console.log("🎉 Database test completed!");
  process.exit(0);
};

start();